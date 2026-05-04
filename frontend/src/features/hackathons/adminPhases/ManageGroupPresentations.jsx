import { useContext, useEffect, useState } from "react";
import { HackathonContext } from "../components/HackathonContext";
import { DiagramContext } from "../components/diagramming/DiagramContext";
import Diagram from "../components/diagramming/Diagram";
import useFetcher from "../../../utils/useFetcher";
import AsterButton from "../../../components/buttons/AsterButton";
import Modal from "../../../components/Modal";
import { checkExists } from "../../../../../backend/src/validators/generalValidators";

export default function ManageGroupPresentations({ exploringGroups }) {
  const { socket, hackathon } = useContext(HackathonContext);
  const [presentingGroup, setPresentingGroup] = useState(null);
  const [viewingGroup, setViewingGroup] = useState(null);
  const [changingGroup, setChangingGroup] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [error, setError] = useState(null);
  const { fetcher } = useFetcher(error, setError);

  const showingGroupNumber = viewingGroup ?? presentingGroup;
  const showingGroupId = exploringGroups.find(
    (g) => g.number === showingGroupNumber,
  )?.id;

  useEffect(() => {
    if (!socket || !hackathon?.id) return;
    socket.on("presenting_state", (presentingState) => {
      setPresentingGroup(presentingState.presentingGroup);
    });
    socket.on("new_presenting_group", (groupNumber) => {
      setPresentingGroup(groupNumber);
    });
    socket.emit("get_presenting_state", `${hackathon.id}/cluster/${0}`);
  }, [socket, hackathon?.id]);

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
      room: `${hackathon.id}/cluster/${0}`,
      groupNumber: group.number,
    });
  };

  return (
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
        {exploringGroups.map((group) => {
          const isPresenting = presentingGroup === group.number;
          const isViewing = showingGroupNumber === group.number;
          return (
            <div
              key={group.id}
              onClick={() => setViewingGroup(group.number)}
              style={{
                padding: "0.5rem 1rem",
                cursor: "pointer",
                backgroundColor: isViewing ? "#f0f0f0" : "transparent",
                borderLeft: isPresenting
                  ? "3px solid black"
                  : "3px solid transparent",
                marginBottom: "0.25rem",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontWeight: isPresenting ? "bold" : "normal",
                }}
              >
                Group {group.number}
              </p>
              <p
                style={{
                  fontSize: "0.75rem",
                  margin: "0 0 0.4rem",
                  color: "#666",
                }}
              >
                {group.seedTitle}
              </p>
              {isPresenting ? (
                <AsterButton
                  style={{
                    fontSize: "0.8rem",
                    background: "#222",
                    color: "#fff",
                    width: "auto",
                    height: "2rem",
                    paddingBlock: 0,
                    cursor: "default",
                  }}
                >
                  ▶ Now presenting
                </AsterButton>
              ) : (
                <AsterButton
                  onClick={() => setChangingGroup(group)}
                  style={{
                    fontSize: "0.8rem",
                    width: "auto",
                    height: "2rem",
                    paddingBlock: 0,
                  }}
                >
                  Set as presenting
                </AsterButton>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ flex: 1 }}>
        <DiagramContext value={{ nodes, edges, setNodes, setEdges }}>
          <Diagram editionMode={false} style={{ width: "100%" }} />
        </DiagramContext>
      </div>
    </div>
  );
}
