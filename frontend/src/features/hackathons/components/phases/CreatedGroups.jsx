import { useEffect, useState } from "react";
import AsterButton from "../../../../components/AsterButton";
import { useNavigate, useParams } from "react-router";
import useFetcher from "../../../../utils/useFetcher";
import Loading from "../../../../components/messages/Loading";
import ParticipantList from "../ParticipantList";
import RenderPDF from "../../../../components/RenderPDF";
import SeedResources from "../../../products/components/SeedResources";
import "./phases.css";
import PhaseTitle from "../PhaseTitle";
import Diagram from "../diagramming/Diagram";

export default function CreatedGroups(props) {
  const [justEntered, setJustEntered] = useState(true);
  const [participation, setParticipation] = useState(props.participation);
  const [isPhaseActive, setIsPhaseActive] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const room = `${participation?.hackathonId}-group-${participation?.conceptualMap.id}`;
  useEffect(() => {
    const shouldNotConnect =
      !participation ||
      !isPhaseActive ||
      !participation?.hackathonId ||
      !participation?.conceptualMap?.id;

    if (!socket) return;
    if (shouldNotConnect) return;

    socket.emit("join_room", room);
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

  const GroupHeader = () => {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div style={{ flex: 1, marginTop: "1vw" }}>
          <ParticipantList
            participants={participation?.groupMembers || []}
            fontSize={"1vw"}
            className={"participant-icon"}
          />
        </div>
        <PhaseTitle>Exploring group</PhaseTitle>
        <div style={{ flex: 1 }}></div>
      </div>
    );
  };

  const GroupSeedResources = () => {
    return (
      <div style={{ flex: 1 }}>
        <RenderPDF
          pdfUrl={participation?.groupSeed?.seedPDF}
          style={{ margin: "1rem 0 1rem 0" }}
        />
        <SeedResources
          seed={participation?.groupSeed}
          style={{ marginLeft: 0 }}
        />
      </div>
    );
  };

  return (
    <div>
      <GroupHeader />
      <div style={{ display: "flex" }}>
        <GroupSeedResources />
        <div style={{ flex: 1 }}>
          <Diagram socket={socket} room={room} />
        </div>
      </div>
    </div>
  );
}
