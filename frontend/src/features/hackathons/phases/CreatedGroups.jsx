import { useEffect, useState } from "react";
import AsterButton from "../../../components/AsterButton";
import { useNavigate, useParams } from "react-router";
import useFetcher from "../../../utils/useFetcher";
import Loading from "../../../components/messages/Loading";
import ParticipantList from "../components/ParticipantList";
import SeedResources from "../../products/components/SeedResources";
import Diagram from "../components/diagramming/Diagram";
import Modal from "../../../components/Modal";
import "./phases.css";
import { DiagramContext } from "../components/diagramming/DiagramContext";
import CreationProcessHeader from "../../../components/CreationProcessHeader";
import RenderUrl from "../../../components/RenderUrl";

const GroupSeedResources = ({ pdf, seed }) => {
  return (
    <div style={{ flex: 1 }}>
      <RenderUrl url={pdf} style={{ margin: "1rem 0" }} />
      <SeedResources seed={seed} style={{ marginLeft: 0 }} />
    </div>
  );
};

export default function CreatedGroups(props) {
  const [justEntered, setJustEntered] = useState(true);
  const [participation, setParticipation] = useState(props.participation);
  const [isPhaseActive, setIsPhaseActive] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  const { fetcher } = useFetcher(error, setError);
  const navigate = useNavigate();
  const params = useParams();

  const socket = props.socket;

  useEffect(() => {
    fetcher({
      url: `hackathons/${params.hackathonId}`,
      onSuccess: (data) => {
        if (!data.isEnrolled) {
          navigate(`/unauthorized`);
        }
        setIsPhaseActive(data?.phase === "GROUP_WORK");
      },
    }).finally(() => setLoading(false));

    if (!isPhaseActive || participation) return;
    fetcher({
      url: `hackathons/${params.hackathonId}/participants/me`,
      onSuccess: (data) => {
        setParticipation(data);
      },
    });
  }, []);

  const groupRoom = `${participation?.hackathonId}/group/${participation?.conceptualMap.id}`;
  useEffect(() => {
    const shouldNotConnect =
      !socket ||
      !participation ||
      !isPhaseActive ||
      !participation?.hackathonId;
    const shouldNotJoinGroup = !participation?.conceptualMap?.id;

    if (shouldNotConnect || shouldNotJoinGroup) return;

    socket.emit("join_room", groupRoom);
  }, [participation, socket, isPhaseActive]);

  if (loading) {
    return <Loading />;
  }

  if (!isPhaseActive) {
    return <h2>This phase is not active</h2>;
  }

  if (justEntered) {
    return (
      <>
        <h2>
          Now, you will work in groups to get familiar with the scientific
          seeds.
        </h2>
        <h3 style={{ marginBottom: "1rem", marginTop: "2rem" }}>
          Groups have been created! Your group will discover the seed:
        </h3>
        <h3 style={{ marginTop: 0 }}>{participation?.groupSeed?.title}</h3>
        <ParticipantList
          participants={participation?.groupMembers}
          participantStyle={{ margin: "2vw 2vw 0 2vw" }}
        />
        <AsterButton
          onClick={() => {
            setJustEntered(false);
          }}
        >
          <p>Enter exploring group</p>
        </AsterButton>
      </>
    );
  }

  if (participation?.conceptualMap?.isDelivered) {
    return (
      <>
        <CreationProcessHeader members={participation?.groupMembers}>
          Exploring group
        </CreationProcessHeader>
        <h3 style={{ marginTop: "5vh" }}>
          Your conceptual map has been submitted! Feel free to take a break.
        </h3>
      </>
    );
  }

  const DeliverMapButton = () => {
    if (!participation?.isGroupVoice) {
      return <></>;
    }
    return (
      <AsterButton
        onClick={() => {
          setOpenModal(true);
        }}
      >
        Deliver conceptual map
      </AsterButton>
    );
  };

  const submitConceptualMap = async () => {
    fetcher({
      url: `exploring-groups/${participation?.conceptualMap?.id}/conceptual-map/submit`,
      method: "PATCH",
      body: { nodes, edges },
      onSuccess: (data) => {
        setParticipation(data);
      },
    });
  };

  const ConfirmDeliveryModal = () => {
    return (
      <Modal openCondition={participation?.isGroupVoice && openModal}>
        <h3>Submit conceptual map</h3>
        <hr style={{ width: "90%" }} />
        <p>
          Are you sure you want to submit your conceptual map? {"\n"} This
          cannot be undone
        </p>
        <hr style={{ width: "90%" }} />
        <div
          style={{
            display: "flex",
            gap: "5vw",
          }}
        >
          <div></div>
          <AsterButton onClick={submitConceptualMap}>Submit</AsterButton>
          <AsterButton onClick={() => setOpenModal(false)}>Cancel</AsterButton>
          <div></div>
        </div>
      </Modal>
    );
  };

  return (
    <div>
      <ConfirmDeliveryModal />
      <CreationProcessHeader members={participation?.groupMembers}>
        Exploring group
      </CreationProcessHeader>
      <div style={{ display: "flex" }}>
        <GroupSeedResources
          pdf={participation?.groupSeed?.seedPDF}
          seed={participation?.groupSeed}
        />
        <div style={{ flex: 1 }}>
          <DiagramContext value={{ nodes, edges, setNodes, setEdges }}>
            <Diagram socket={socket} room={groupRoom} />
          </DiagramContext>
          <DeliverMapButton />
        </div>
      </div>
    </div>
  );
}
