import { useEffect, useState } from "react";
import useFetcher from "../../../../utils/useFetcher";
import Loading from "../../../../components/messages/Loading";
import { DiagramContext } from "./DiagramContext";
import Diagram from "./Diagram";
import AsterButton from "../../../../components/buttons/AsterButton";

export const DiagramGallery = (props) => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [error, setError] = useState(null);
  const [showingMapId, setShowingMapId] = useState(null);
  const [conceptualMapIds, setConceptualMapIds] = useState([]);
  const currentIndex = conceptualMapIds?.indexOf(showingMapId);

  const { fetcher } = useFetcher(error, setError);

  useEffect(() => {
    if (!showingMapId) return;
    setNodes(null);
    fetcher({
      url: `exploring-groups/${showingMapId}/conceptual-map`,
      onSuccess: (data) => {
        setNodes(data?.map?.nodes || []);
        setEdges(data?.map?.edges || []);
      },
    });
  }, [showingMapId]);

  useEffect(() => {
    if (!props.seedId) return;
    fetcher({
      url: `seeds/${props.seedId}/conceptual-maps`,
      onSuccess: (data) => {
        if (data.length === 0) {
          setConceptualMapIds(null);
          return;
        }
        setConceptualMapIds(data);
        setShowingMapId(data[0] || null);
      },
    });
  }, [props.seedId]);

  if (!nodes) {
    return <Loading />;
  }

  if (!!nodes && !conceptualMapIds && props.showMap) {
    return <p>No maps found</p>;
  }

  return (
    <>
      <DiagramContext value={{ nodes, edges, setNodes, setEdges }}>
        <Diagram
          editionMode={false}
          style={{ width: "80vw", display: props.showMap ? "block" : "none" }}
        />
      </DiagramContext>
      {props.showMap && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "end",
          }}
        >
          <AsterButton
            style={{ width: "8rem" }}
            disabled={currentIndex === 0}
            onClick={() => setShowingMapId(conceptualMapIds[currentIndex - 1])}
          >
            Previous
          </AsterButton>
          <p>
            {conceptualMapIds?.indexOf(showingMapId) + 1}/
            {conceptualMapIds.length}
          </p>
          <AsterButton
            style={{ width: "8rem" }}
            disabled={currentIndex === conceptualMapIds.length - 1}
            onClick={() => setShowingMapId(conceptualMapIds[currentIndex + 1])}
          >
            Next
          </AsterButton>
        </div>
      )}
    </>
  );
};
