import { useContext, useEffect, useState } from "react";
import { HackathonContext } from "../components/HackathonContext";
import ChangePresenterModal from "./components/ChangePresenterModal";
import ConfirmPhaseChangeModal from "./components/ConfirmPhaseChangeModal";
import Loading from "../../../components/messages/Loading";
import ItemSelectionCard from "./components/ItemSelectionCard";
import AsterButton from "../../../components/buttons/AsterButton";

export default function ManageTeamPresentations() {
  const { socket, handleNextPhase, hackathon, coCreationTeams } =
    useContext(HackathonContext);

  const [presentingTeam, setPresentingTeam] = useState(null);
  const [viewingTeam, setViewingTeam] = useState(null);
  const [changingTeam, setChangingTeam] = useState(null);
  const [openPhaseChangeModal, setOpenPhaseChangeModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const socketRoom = `${hackathon.id}/cluster/${0}`;

  useEffect(() => {
    if (!socket || !hackathon?.id) return;
    socket.on("team_presenting_state", (presentingState) => {
      setPresentingTeam(presentingState.presentingTeam);
      setLoading(false);
    });
    socket.on("new_presenting_team", (teamNumber) => {
      setPresentingTeam(teamNumber);
    });
    socket.emit("get_team_presenting_state", socketRoom);
  }, [socket, hackathon?.id]);

  const sendNewPresentingTeam = (team) => {
    setPresentingTeam(team.number);
    setViewingTeam(null);
    socket.emit("set_presenting_team", {
      room: socketRoom,
      teamNumber: team.number,
    });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <ConfirmPhaseChangeModal
        openCondition={openPhaseChangeModal}
        onConfirm={() => {
          setOpenPhaseChangeModal(false);
          handleNextPhase();
        }}
        onCancel={() => setOpenPhaseChangeModal(false)}
      />
      <div style={{ display: "flex", height: "100%", paddingInline: "2rem" }}>
        <ChangePresenterModal
          openCondition={changingTeam !== null}
          onChange={() => {
            sendNewPresentingTeam(changingTeam);
            setPresentingTeam(changingTeam.number);
            setChangingTeam(null);
          }}
          onCancel={() => setChangingTeam(null)}
          itemName={"Team"}
          itemNumber={changingTeam?.number}
        />
        <div
          style={{
            width: "12rem",
            flexShrink: 0,
            overflowY: "auto",
            padding: "1rem 0",
            marginRight: "2rem",
          }}
        >
          <h3>Co-creation teams</h3>
          {coCreationTeams.map((team) => (
            <ItemSelectionCard
              key={team.number}
              itemName={"Team"}
              itemTitle={team.flowerTitle ?? `Seed: ${team.seed.title}`}
              itemNumber={team.number}
              presentingItem={presentingTeam}
              viewingItem={viewingTeam}
              onChangePresenting={() => setChangingTeam(team)}
              onView={() => setViewingTeam(team.number)}
            />
          ))}
        </div>

        <div className="rubric-container" style={{ flex: 1 }}>
          <p>content</p>
        </div>
      </div>
      <div>
        <p>Have all teams presented?</p>
        <AsterButton onClick={() => {}}>Finish hackathon!</AsterButton>
      </div>
    </>
  );
}
