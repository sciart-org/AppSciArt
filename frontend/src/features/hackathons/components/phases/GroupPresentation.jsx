import { useEffect, useState } from "react";
import useFetcher from "../../../../utils/useFetcher";
import Participant from "../../../../components/roles/Participant";
import { DiagramContext } from "../diagramming/DiagramContext";
import Diagram from "../diagramming/Diagram";
import AsterButton from "../../../../components/AsterButton";
import SelectorBar from "../../../../components/SelectorBar";
import Loading from "../../../../components/messages/Loading";
import "./phases.css";

export default function GroupPresentation({
  socket,
  hackathonId,
  clusterNumber,
}) {
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState(null);
  const [presentingGroup, setPresentingGroup] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [showMap, setShowMap] = useState(true);
  const [ratingItems, setRatingItems] = useState([]);
  const { fetcher } = useFetcher(error, setError);

  const presentingGroupId = groups.find(
    (g) => g.number === presentingGroup
  )?.id;

  useEffect(() => {
    if (presentingGroup === null || !presentingGroupId) return;
    fetcher({
      url: `exploring-groups/${presentingGroupId}/conceptual-map`,
      onSuccess: (data) => {
        setNodes(data.map.nodes || []);
        setEdges(data.map.edges || []);
        setShowMap(true);
        setRatingItems([
          ...ratingItems,
          { ...data.seed, groupNumber: presentingGroup },
        ]);
      },
    });
  }, [presentingGroup, presentingGroupId]);

  useEffect(() => {
    if (!hackathonId || clusterNumber === undefined) return;
    fetcher({
      url: `hackathons/${hackathonId}/clusters/${clusterNumber}/exploring-groups`,
      onSuccess: (data) => {
        setGroups(data);
      },
    });
  }, [hackathonId, clusterNumber]);

  useEffect(() => {
    if (!socket || !hackathonId || clusterNumber) return;
    socket.on("presenting_state", (presentingState) => {
      setPresentingGroup(presentingState.presentingGroup);
      setRatingItems([...ratingItems, ...presentingState.previousSeeds]);
    });

    socket.on("new_presenting_group", (groupNumber) => {
      setPresentingGroup(groupNumber);
    });

    socket.emit(
      "get_presenting_state",
      `${hackathonId}/cluster/${clusterNumber}`
    );
  }, [socket, hackathonId, clusterNumber]);

  if (!presentingGroup) {
    return <Loading />;
  }

  return (
    <div>
      <div className="groups-container">
        {groups.map((group) => (
          <div>
            <Participant
              style={{
                height: group.number === presentingGroup ? "6rem" : "4rem",
              }}
              multiple={true}
            />
            <p style={{ margin: 0 }}>Group {group.number}</p>
          </div>
        ))}
      </div>
      <SelectorBar>
        <AsterButton
          onClick={() => setShowMap(true)}
          className={showMap ? "aster-button-hover" : ""}
        >
          Conceptual map
        </AsterButton>
        <AsterButton
          onClick={() => setShowMap(false)}
          className={showMap ? "" : "aster-button-hover"}
        >
          Ratings
        </AsterButton>
      </SelectorBar>
      <DiagramContext value={{ nodes, edges, setNodes, setEdges }}>
        <Diagram
          editionMode={false}
          style={{ width: "80vw", display: showMap ? "block" : "none" }}
        />
      </DiagramContext>
      <div style={{ height: "50vh", display: showMap ? "none" : "block" }}>
        Ratings view coming soon!
      </div>
    </div>
  );
}
