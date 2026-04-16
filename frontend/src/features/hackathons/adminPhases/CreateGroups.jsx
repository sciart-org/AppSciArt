import { useContext, useState } from "react";
import { HackathonContext } from "../components/HackathonContext";
import useFetcher from "../../../utils/useFetcher";
import ConfirmPhaseChangeModal from "./ConfirmPhaseChangeModal";

export default function CreateGroups() {
  const { hackathon, handleNextPhase } = useContext(HackathonContext);

  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const { fetcher } = useFetcher(error, setError);

  const unassignedParticipants = hackathon.participations.filter(
    (p) =>
      p.conceptualMap === null || Object.keys(p.conceptualMap).length === 0,
  );

  return (
    <div>
      <h1>{hackathon.internalName}</h1>
      <h2>Creation of exploring groups</h2>

      <ConfirmPhaseChangeModal
        openCondition={openModal}
        onConfirm={handleNextPhase}
        onCancel={() => setOpenModal(false)}
      />

      <div className="group-box-container">
        <div>
          <h3 className="group-box-header">Unassigned participants</h3>
          <div>
            {unassignedParticipants.map((p) => (
              <p key={p.id} className="group-box-item">
                {p.userProfile.name} {p.userProfile.surname}
                {p.roles ? " — " + p.roles.join(", ") : null}
              </p>
            ))}
          </div>
        </div>
        <div>
          <h3 className="group-box-header">Exploring groups</h3>
          <div></div>
        </div>
      </div>
    </div>
  );
}
