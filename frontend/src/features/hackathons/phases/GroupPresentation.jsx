import { useEffect, useState } from "react";
import useFetcher from "../../../utils/useFetcher";
import Participant from "../../../components/roles/Participant";
import { DiagramContext } from "../components/diagramming/DiagramContext";
import Diagram from "../components/diagramming/Diagram";
import AsterButton from "../../../components/buttons/AsterButton";
import SelectorBar from "../../../components/buttons/SelectorBar";
import Loading from "../../../components/messages/Loading";
import "./phases.css";
import "../../products/collections/Collection.css";
import CreatingTeams from "./CreatingTeams";
import Modal from "../../../components/Modal";
import { useContext } from "react";
import { HackathonContext } from "../components/HackathonContext";
import RatingCard from "./components/RatingCard";

export default function GroupPresentation() {
  const { hackathon, socket } = useContext(HackathonContext);
  const hackathonId = hackathon?.id;

  const [groups, setGroups] = useState([]);
  const [presentingGroup, setPresentingGroup] = useState(null);
  const [ratingItems, setRatingItems] = useState([]);
  const [canSubmitRatings, setCanSubmitRatings] = useState(false);
  const [ratingsSubmitted, setRatingsSubmitted] = useState(false);

  const [error, setError] = useState(null);

  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [showMap, setShowMap] = useState(true);
  const [openSubmissionModal, setOpenSubmissionModal] = useState(false);

  const { fetcher } = useFetcher(error, setError);

  const presentingGroupId = groups.find(
    (g) => g.number === presentingGroup,
  )?.id;

  const addRatingItems = (newItems) => {
    setRatingItems((prev) => {
      const existingGroupNumbers = new Set(prev.map((i) => i.groupNumber));
      return [
        ...prev,
        ...newItems.filter((i) => !existingGroupNumbers.has(i.groupNumber)),
      ];
    });
  };

  useEffect(() => {
    if (presentingGroup === null || !presentingGroupId) return;
    fetcher({
      url: `exploring-groups/${presentingGroupId}/conceptual-map`,
      onSuccess: (data) => {
        setNodes(data.map.nodes || []);
        setEdges(data.map.edges || []);
        setShowMap(true);
        addRatingItems([{ ...data.seed, groupNumber: presentingGroup }]);
      },
    });
  }, [presentingGroup, presentingGroupId]);

  useEffect(() => {
    if (!hackathonId) return;
    fetcher({
      url: `hackathons/${hackathonId}/clusters/${0}/exploring-groups`,
      onSuccess: (data) => {
        setGroups(data);
      },
    });
  }, [hackathonId]);

  useEffect(() => {
    if (!socket || !hackathonId) return;
    socket.on("group_presenting_state", (presentingState) => {
      setPresentingGroup(presentingState.presentingGroup);
      addRatingItems(presentingState.previousSeeds);
      setCanSubmitRatings(presentingState.submissionEnabled);
      setRatingsSubmitted(presentingState.hasSubmitted);
    });

    socket.on("new_presenting_group", (groupNumber) => {
      setPresentingGroup(groupNumber);
    });

    socket.on("ratings_submission_enabled", () => {
      setCanSubmitRatings(true);
    });

    socket.emit(
      "get_group_presenting_state",
      `${hackathonId}/cluster/${0}`,
    );
  }, [socket, hackathonId]);

  if (ratingsSubmitted) {
    return <CreatingTeams />;
  }

  if (presentingGroup === null) {
    return <Loading />;
  }

  const submitRatings = () => {
    socket.emit(
      "submit_ratings",
      `${hackathonId}/cluster/${0}`,
      ratingItems.map((ri) => {
        return { seedId: ri.id, rating: ri.rating || 0.5 };
      }),
    );
    setRatingsSubmitted(true);
  };

  const SubmissionModal = () => {
    return (
      <Modal openCondition={openSubmissionModal}>
        <h3>Submit ratings</h3>
        <p>Your ratings will be submitted. This cannot be undone</p>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
          }}
        >
          <AsterButton onClick={submitRatings}>Confirm</AsterButton>
          <AsterButton
            variant="secondary"
            onClick={() => setOpenSubmissionModal(false)}
          >
            Cancel
          </AsterButton>
        </div>
      </Modal>
    );
  };

  return (
    <div>
      <SubmissionModal />
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
      <div style={{ display: showMap ? "none" : "block" }}>
        <div className="collection-grid" style={{ margin: "1rem 5rem" }}>
          {ratingItems.map((item) => (
            <RatingCard item={item} setRatingItems={setRatingItems} />
          ))}
        </div>
        {canSubmitRatings && (
          <div>
            <AsterButton onClick={() => setOpenSubmissionModal(true)}>
              Submit my ratings
            </AsterButton>
          </div>
        )}
      </div>
    </div>
  );
}
