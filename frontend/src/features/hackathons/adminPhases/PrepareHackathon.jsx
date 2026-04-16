import { useContext, useEffect, useState } from "react";
import { HackathonContext } from "../components/HackathonContext";
import "./adminPhases.css";
import AsterButton from "../../../components/buttons/AsterButton";
import FormInput from "../../../components/form/FormInput";
import Participant from "../../../components/roles/Participant";
import AsterTable from "../../../components/AsterTable";
import useFetcher from "../../../utils/useFetcher";
import { showSuccessMessage } from "../../../components/messages/Message";
import ConfirmPhaseChangeModal from "./ConfirmPhaseChangeModal";

export default function PrepareHackathon() {
  const { hackathon, setHackathon, socket } = useContext(HackathonContext);

  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [meetLink, setMeetLink] = useState(hackathon.meetLink ?? "");

  const { fetcher } = useFetcher(error, setError);

  const updateParticipation = (participationChanges) => {
    setHackathon((prev) => ({
      ...prev,
      participations: prev.participations.map((p) =>
        p.id === participationChanges.id ? participationChanges : p,
      ),
    }));
  };

  useEffect(() => {
    if (!socket) return;
    socket.on("participation:updated", (participationChanges) =>
      updateParticipation(participationChanges),
    );
  }, [socket]);

  useEffect(() => {
    if (meetLink === hackathon.meetLink) return;
    setMeetLink(hackathon.meetLink);
  }, [hackathon.meetLink]);

  const handleSubmitLink = (e) => {
    e.preventDefault();
    if (hackathon.meetLink === meetLink) return;
    fetcher({
      url: `hackathons/${hackathon.id}?broadcast=true`,
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
    fetcher({
      url: `hackathons/${hackathon.id}/participants/${participant.userProfile.id}?broadcast=true`,
      method: "PUT",
      body: { hasConfirmedAssistance: !participant.hasConfirmedAssistance },
      onSuccess: (updatedParticipation) =>
        updateParticipation(updatedParticipation),
    });
  };

  const handleCreateGroups = () => {
    fetcher({
      url: `hackathons/${hackathon.id}/next-phase?broadcast=true`,
      method: "POST",
      onSuccess: (updatedHackathon) => {
        setHackathon(updatedHackathon);
      },
    });
  };

  const participantsColumns = [
    {
      key: "name",
      label: "Name",
      render: (p) => `${p.userProfile?.name} ${p.userProfile?.surname}`,
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
      <h1>{hackathon.internalName}</h1>

      <ConfirmPhaseChangeModal
        openCondition={openModal}
        onConfirm={handleCreateGroups}
        onCancel={() => setOpenModal(false)}
      />

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
          data={hackathon.participations}
          emptyMessage="No participants yet."
        />
      </section>

      <div className="create-groups-section">
        <p>Is everybody here?</p>
        <AsterButton onClick={() => setOpenModal(true)}>
          Create Exploring Groups
        </AsterButton>
      </div>
    </div>
  );
}
