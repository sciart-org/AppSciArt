import { useContext, useState } from "react";
import { HackathonContext } from "../components/HackathonContext";
import "./adminPhases.css";
import AsterButton from "../../../components/buttons/AsterButton";
import FormInput from "../../../components/form/FormInput";
import Participant from "../../../components/roles/Participant";
import AsterTable from "../../../components/AsterTable";

export default function PrepareHackathon() {
  const { hackathon } = useContext(HackathonContext);
  const [meetLink, setMeetLink] = useState(hackathon.meetLink ?? "");
  const [confirmed, setConfirmed] = useState(() =>
    Object.fromEntries(
      hackathon.participations.map((p) => [p.id, p.hasConfirmedAssistance]), // ← use persisted value
    ),
  );

  const handleSubmitLink = () => {
    // TODO
  };

  const handleToggleConfirmed = (participationId) => {
    // TODO
  };

  const handleCreateGroups = () => {
    // TODO
  };

  const participantsColumns = [
    {
      key: "name",
      label: "Name",
      render: (p) => `${p.user_profile?.name} ${p.user_profile?.surname}`,
    },
    { key: "email", label: "Email", render: (p) => p.user_profile?.email },
    {
      key: "confirmed",
      label: "",
      width: "2rem",
      render: (p) => (
        <input
          type="checkbox"
          checked={confirmed[p.id] ?? false}
          onChange={() => handleToggleConfirmed(p.id)}
        />
      ),
    },
  ];

  return (
    <div className="prepare-page">
      <h1>{hackathon.internalName}</h1>

      <form onSubmit={handleSubmitLink} className="meet-link-form">
        <FormInput
          name="Meet Link"
          type="text"
          value={meetLink}
          onChange={(e) => setMeetLink(e.target.value)}
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
        <AsterButton onClick={handleCreateGroups}>
          Create Exploring Groups
        </AsterButton>
      </div>
    </div>
  );
}
