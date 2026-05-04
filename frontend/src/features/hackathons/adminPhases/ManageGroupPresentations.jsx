import { useContext, useEffect, useState } from "react";
import { HackathonContext } from "../components/HackathonContext";
import { DiagramContext } from "../components/diagramming/DiagramContext";
import Diagram from "../components/diagramming/Diagram";
import useFetcher from "../../../utils/useFetcher";

export default function ManageGroupPresentations({ exploringGroups }) {
  const { socket, hackathon } = useContext(HackathonContext);

  const [presentingGroup, setPresentingGroup] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [error, setError] = useState(null);

  const { fetcher } = useFetcher(error, setError);

  const presentingGroupId = exploringGroups.find(
    (g) => g.number === presentingGroup,
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
    if (presentingGroup === null || !presentingGroupId) return;
    fetcher({
      url: `exploring-groups/${presentingGroupId}/conceptual-map`,
      onSuccess: (data) => {
        setNodes(data.map.nodes || []);
        setEdges(data.map.edges || []);
      },
    });
  }, [presentingGroup, presentingGroupId]);

  return (
    <div style={{ flex: 1 }}>
      <DiagramContext value={{ nodes, edges, setNodes, setEdges }}>
        <Diagram editionMode={false} style={{ width: "70vw" }} />
      </DiagramContext>
    </div>
  );
}
