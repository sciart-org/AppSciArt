import { useContext, useEffect, useState } from "react";
import { HackathonContext } from "../components/HackathonContext";
import ChangePresenterModal from "./components/ChangePresenterModal";
import ConfirmPhaseChangeModal from "./components/ConfirmPhaseChangeModal";
import Loading from "../../../components/messages/Loading";
import ItemSelectionCard from "./components/ItemSelectionCard";
import AsterButton from "../../../components/buttons/AsterButton";
import useFetcher from "../../../utils/useFetcher";
import RenderUrl from "../../../components/RenderUrl";
import FlowerPresentationCard from "../phases/components/FlowerPresentationCard";

export default function ManageTeamPresentations() {
  const { socket, handleNextPhase, hackathon, coCreationTeams } =
    useContext(HackathonContext);

  const [presentingTeam, setPresentingTeam] = useState(null);
  const [viewingTeam, setViewingTeam] = useState(null);
  const [changingTeam, setChangingTeam] = useState(null);
  const [openPhaseChangeModal, setOpenPhaseChangeModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [flowerRubrics, setFlowerRubrics] = useState(null);

  const showingTeamNumber = viewingTeam ?? presentingTeam;
  const showingTeam = coCreationTeams.find(
    (t) => t.number === showingTeamNumber,
  );
  const showingRubric = flowerRubrics?.find(
    (f) => f.flowerId === showingTeam.id,
  );

  const socketRoom = `${hackathon.id}/cluster/${0}`;

  const { fetcher } = useFetcher(error, setError);

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

  useEffect(() => {
    fetcher({
      url: `hackathons/${hackathon?.id}/evaluators/me`,
      onSuccess: (data) => setFlowerRubrics(data.flowers),
    });
  }, []);

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

        {showingRubric?.rubric ? (
          <div style={{ flex: 1 }}>
            <RenderUrl
              url={showingRubric?.rubric}
              style={{
                height: "90vh",
                border: "solid 1px rgba(191, 191, 191, 255)",
                borderRadius: "1rem",
                width: "80vw",
                marginInline: "auto",
              }}
            />
          </div>
        ) : (
          <FlowerPresentationCard
            flowerTitle={showingTeam.flowerTitle}
            seedTitle={showingTeam.seed.title}
            flowerAuthors={showingTeam.members}
            seedScientists={showingTeam.seed.authors}
          />
        )}
      </div>
      <div>
        <p>Have all teams presented?</p>
        <AsterButton onClick={() => {}}>Finish hackathon!</AsterButton>
      </div>
    </>
  );
}
