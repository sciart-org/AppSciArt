import { useContext, useEffect, useState } from "react";
import { HackathonContext } from "../components/HackathonContext";
import AsterButton from "../../../components/buttons/AsterButton";
import FormInput from "../../../components/form/FormInput";
import Participant from "../../../components/roles/Participant";
import AsterTable from "../../../components/AsterTable";
import useFetcher from "../../../utils/useFetcher";
import { showSuccessMessage } from "../../../components/messages/Message";
import ConfirmPhaseChangeModal from "./components/ConfirmPhaseChangeModal";
import {
  getFullParticipantName,
  sortParticipantsBySurname,
} from "../../../utils/commonUtils";

export default function PrepareHackathon() {
  const { hackathon, setHackathon, handleNextPhase, updateParticipant } =
    useContext(HackathonContext);

  const isCurrentPhase = hackathon.phase === "PREPARING";

  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [meetLink, setMeetLink] = useState(hackathon.meetLink ?? "");

  const { fetcher } = useFetcher(error, setError);

  useEffect(() => {
    if (meetLink === hackathon.meetLink) return;
    setMeetLink(hackathon.meetLink);
  }, [hackathon.meetLink]);

  const handleSubmitLink = (e) => {
    e.preventDefault();
    if (hackathon.meetLink === meetLink) return;
    fetcher({
      url: `hackathons/${hackathon.id}?broadcast=ALL`,
      method: "PUT",
      body: { meetLink },
      onSuccess: (updatedHackathon) => {
        showSuccessMessage("Meet link updated successfully");
        setHackathon(updatedHackathon);
        setMeetLink(updatedHackathon.meetLink);
      },
    });
  };

  const handleToggleConfirmed = (participant) => {
    updateParticipant(
      participant.userProfile.id,
      {
        hasConfirmedAssistance: !participant.hasConfirmedAssistance,
      },
      "STAFF",
    );
  };

  const participantsColumns = [
    {
      key: "name",
      label: "Name",
      render: (p) => getFullParticipantName(p),
    },
    { key: "email", label: "Email", render: (p) => p.userProfile?.email },
    {
      key: "confirmed",
      label: "",
      width: "2rem",
      render: (p) => (
        <input
          type="checkbox"
          checked={p.hasConfirmedAssistance}
          onChange={() => handleToggleConfirmed(p)}
        />
      ),
    },
  ];

  return (
    <div className="prepare-page">
      <ConfirmPhaseChangeModal
        openCondition={openModal}
        onConfirm={() => {
          setOpenModal(false);
          handleNextPhase();
        }}
        onCancel={() => setOpenModal(false)}
      >
        {hackathon.participations.some((p) => !p.hasConfirmedAssistance) ? (
          <p>Some participants have not confirmed their assistance yet</p>
        ) : undefined}
      </ConfirmPhaseChangeModal>

      <form onSubmit={handleSubmitLink} className="meet-link-form">
        <FormInput
          name="Meet Link"
          type="text"
          value={meetLink}
          onChange={(e) =>
            setMeetLink(e.target.value === "" ? null : e.target.value)
          }
        />
        <AsterButton type="submit" className="meet-link-submit">
          Submit
        </AsterButton>
      </form>

      <section className="participants-section">
        <div className="participants-header">
          <Participant className="participants-icon" />
          <h3>Participants — Confirm their assistance</h3>
        </div>
        <AsterTable
          columns={participantsColumns}
          data={sortParticipantsBySurname(hackathon.participations)}
          emptyMessage="No participants yet."
        />
      </section>

      {isCurrentPhase && (
        <div className="create-groups-section">
          <p>Is everybody here?</p>
          <AsterButton onClick={() => setOpenModal(true)}>
            Start hackathon
          </AsterButton>
        </div>
      )}
    </div>
  );
}
