import { useContext, useEffect, useState } from "react";
import { HackathonContext } from "../components/HackathonContext";
import { DiagramContext } from "../components/diagramming/DiagramContext";
import Diagram from "../components/diagramming/Diagram";
import useFetcher from "../../../utils/useFetcher";
import AsterButton from "../../../components/buttons/AsterButton";
import Modal from "../../../components/Modal";
import GroupSelectionCard from "./components/GroupSelectionCard";
import "./ManageGroups.css";
import ConfirmPhaseChangeModal from "./components/ConfirmPhaseChangeModal";
import RatingCard from "./components/RatingCard";
import Loading from "../../../components/messages/Loading";

export default function ManageGroupPresentations() {
  const { socket, hackathon, handleNextPhase, exploringGroups } =
    useContext(HackathonContext);

  const [presentingGroup, setPresentingGroup] = useState(null);
  const [viewingGroup, setViewingGroup] = useState(null);
  const [changingGroup, setChangingGroup] = useState(null);
  const [canSubmitRatings, setCanSubmitRatings] = useState(false);
  const [ratings, setRatings] = useState([]);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [error, setError] = useState(null);
  const [openPhaseChangeModal, setOpenPhaseChangeModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const isCurrentPhase = hackathon.phase === "GROUP_PRESENTATION";

  const { fetcher } = useFetcher(error, setError);

  const showingGroupNumber = viewingGroup ?? presentingGroup;
  const showingGroupId = exploringGroups.find(
    (g) => g.number === showingGroupNumber,
  )?.id;

  const socketRoom = `${hackathon.id}/cluster/${0}`;

  useEffect(() => {
    if (!socket || !hackathon?.id) return;
    socket.on("group_presenting_state", (presentingState) => {
      setPresentingGroup(presentingState.presentingGroup);
      setCanSubmitRatings(presentingState.submissionEnabled);
      setLoading(false);
    });
    socket.on("new_presenting_group", (groupNumber) => {
      setPresentingGroup(groupNumber);
    });
    socket.on("ratings_submission_enabled", () => {
      setCanSubmitRatings(true);
    });
    socket.on("ratings", (ratings) => {
      setRatings(ratings);
    });
    socket.emit("get_group_presenting_state", socketRoom);
  }, [socket, hackathon?.id]);

  useEffect(() => {
    if (!canSubmitRatings) return;
    socket.emit("get_ratings", socketRoom);
  }, [canSubmitRatings]);

  useEffect(() => {
    if (!showingGroupId) return;
    fetcher({
      url: `exploring-groups/${showingGroupId}/conceptual-map`,
      onSuccess: (data) => {
        setNodes(data.map.nodes || []);
        setEdges(data.map.edges || []);
      },
    });
  }, [showingGroupId]);

  const sendNewPresentingGroup = (group) => {
    setPresentingGroup(group.number);
    setViewingGroup(null);
    socket.emit("set_presenting_group", {
      room: socketRoom,
      groupNumber: group.number,
    });
  };

  if (loading) {
    return <Loading />;
  }

  if (isCurrentPhase && canSubmitRatings) {
    return (
      <div>
        <ConfirmPhaseChangeModal
          openCondition={openPhaseChangeModal}
          onConfirm={() => {
            setOpenPhaseChangeModal(false);
            handleNextPhase();
          }}
          onCancel={() => setOpenPhaseChangeModal(false)}
        />

        <h2>Ratings</h2>
        <p style={{ color: "#666" }}>
          {Object.keys(ratings).length} /{" "}
          {exploringGroups.flatMap((g) => g.members).length} participants
          submitted
        </p>
        <div className="manage-groups-grid">
          {exploringGroups.map((group) => (
            <RatingCard key={group.id} group={group} ratings={ratings} />
          ))}
        </div>
        {isCurrentPhase && (
          <>
            <p>All ratings submitted?</p>
            <AsterButton onClick={() => setOpenPhaseChangeModal(true)}>
              Create teams
            </AsterButton>
          </>
        )}
      </div>
    );
  }

  return (
    <>
      <div style={{ display: "flex", height: "100%", paddingInline: "2rem" }}>
        <Modal openCondition={changingGroup !== null}>
          <h3>Change Presenting Group</h3>
          <p>
            Group {changingGroup?.number} will be set as the presenting group.
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
            }}
          >
            <AsterButton
              onClick={() => {
                sendNewPresentingGroup(changingGroup);
                setPresentingGroup(changingGroup.number);
                setChangingGroup(null);
              }}
            >
              Confirm
            </AsterButton>
            <AsterButton
              variant="secondary"
              onClick={() => setChangingGroup(null)}
            >
              Cancel
            </AsterButton>
          </div>
        </Modal>

        <div
          style={{
            width: "12rem",
            flexShrink: 0,
            overflowY: "auto",
            padding: "1rem 0",
            marginRight: "2rem",
          }}
        >
          <h3>Exploring groups</h3>
          {exploringGroups.map((group) => (
            <GroupSelectionCard
              key={group.number}
              group={group}
              presentingGroup={presentingGroup}
              viewingGroup={viewingGroup}
              onView={() => setViewingGroup(group.number)}
              onChangePresenting={() => setChangingGroup(group)}
            />
          ))}
        </div>

        <div style={{ flex: 1 }}>
          <DiagramContext value={{ nodes, edges, setNodes, setEdges }}>
            <Diagram editionMode={false} style={{ width: "100%" }} />
          </DiagramContext>
        </div>
      </div>
      <div>
        <p>Have all groups presented?</p>
        <AsterButton
          onClick={() => {
            socket.emit("enable_ratings_submission", socketRoom);
            setCanSubmitRatings(true);
          }}
        >
          Start ratings submission
        </AsterButton>
      </div>
    </>
  );
}
