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

export default function ManageGroupPresentations({ exploringGroups }) {
  const { socket, hackathon, handleNextPhase } = useContext(HackathonContext);
  const [presentingGroup, setPresentingGroup] = useState(null);
  const [viewingGroup, setViewingGroup] = useState(null);
  const [changingGroup, setChangingGroup] = useState(null);
  const [canSubmitRatings, setCanSubmitRatings] = useState(false);
  const [ratings, setRatings] = useState([]);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [error, setError] = useState(null);
  const [openPhaseChangeModal, setOpenPhaseChangeModal] = useState(false);

  const { fetcher } = useFetcher(error, setError);

  const showingGroupNumber = viewingGroup ?? presentingGroup;
  const showingGroupId = exploringGroups.find(
    (g) => g.number === showingGroupNumber,
  )?.id;

  const socketRoom = `${hackathon.id}/cluster/${0}`;

  useEffect(() => {
    if (!socket || !hackathon?.id) return;
    socket.on("presenting_state", (presentingState) => {
      setPresentingGroup(presentingState.presentingGroup);
      setCanSubmitRatings(presentingState.submissionEnabled);
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
    socket.emit("get_presenting_state", socketRoom);
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

  const getGroupRatings = (ratings, seedId) =>
    Object.values(ratings)
      .flatMap((r) => r.filter((ri) => ri.seedId === seedId))
      .map((ri) => ri.rating);

  const getAverage = (ratings) =>
    ratings.length
      ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
      : null;

  const getSubmissionCount = (ratings, seedId) =>
    Object.values(ratings).filter((r) => r.some((ri) => ri.seedId === seedId))
      .length;

  const RatingsCard = ({ group, ratings }) => {
    const groupRatings = getGroupRatings(ratings, group.seedId);
    const avg = getAverage(groupRatings);
    const submitted = getSubmissionCount(ratings, group.seedId);

    return (
      <div className="manage-groups-card">
        <div className="manage-groups-header">
          <h2>Group {group.number}</h2>
          <span style={{ fontSize: "1rem", fontWeight: "bold" }}>
            {avg ?? "—"}{" "}
            <span
              style={{
                fontSize: "0.8rem",
                fontWeight: "normal",
                color: "#666",
              }}
            >
              / 5
            </span>
          </span>
        </div>
        <p className="manage-groups-seed">{group.seedTitle}</p>
        <h4>{submitted} ratings</h4>
        <div style={{ display: "flex", gap: "0.25rem", flexWrap: "wrap" }}>
          {groupRatings.map((r, i) => (
            <span
              key={i}
              style={{
                background: "#f0f0f0",
                borderRadius: "0.25rem",
                padding: "0.2rem 0.6rem",
              }}
            >
              {r}
            </span>
          ))}
        </div>
      </div>
    );
  };

  if (canSubmitRatings) {
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
            <RatingsCard key={group.id} group={group} ratings={ratings} />
          ))}
        </div>
        <p>All ratings submitted?</p>
        <AsterButton onClick={() => setOpenPhaseChangeModal(true)}>
          Create teams
        </AsterButton>
      </div>
    );
  }

  return (
    <>
      <div style={{ display: "flex", height: "100%" }}>
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
