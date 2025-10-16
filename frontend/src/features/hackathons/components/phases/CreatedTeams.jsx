import { useEffect, useState } from "react";
import useFetcher from "../../../../utils/useFetcher";
import Loading from "../../../../components/messages/Loading";
import { useParams } from "react-router";
import ParticipantList from "../ParticipantList";
import AsterButton from "../../../../components/AsterButton";
import PhaseTitle from "../PhaseTitle";
import "./phases.css";
import SeedResources from "../../../products/components/SeedResources";
import { DiagramContext } from "../diagramming/DiagramContext";
import Diagram from "../diagramming/Diagram";

const TeamHeader = ({ teamMembers, scientists }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div style={{ flex: 1, marginTop: "1vw" }}>
        <ParticipantList
          participants={teamMembers || []}
          fontSize={"1vw"}
          className={"participant-icon"}
        />
      </div>
      <PhaseTitle>Co-creation team</PhaseTitle>
      <div style={{ flex: 1, marginTop: "1vw" }}>
        <ParticipantList
          participants={scientists || []}
          fontSize={"1vw"}
          className={"participant-icon"}
        />
      </div>
    </div>
  );
};

const DiagramGallery = (props) => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [error, setError] = useState(null);

  const { fetcher } = useFetcher(error, setError);

  return (
    <DiagramContext value={{ nodes, edges, setNodes, setEdges }}>
      <Diagram
        editionMode={false}
        style={{ width: "80vw", display: props.showMap ? "block" : "none" }}
      />
    </DiagramContext>
  );
};

export default function CreatedTeams(props) {
  const [justEntered, setJustEntered] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPhaseActive, setIsPhaseActive] = useState(true);
  const [participation, setParticipation] = useState(props.participation);
  const [showMap, setShowMap] = useState(false);

  const params = useParams();

  const { fetcher } = useFetcher(error, setError);

  const seed = participation?.teamFlower?.seed;

  useEffect(() => {
    fetcher({
      url: `hackathons/${params.hackathonId}`,
      onSuccess: (data) => {
        if (!data.isEnrolled) {
          navigate(`/unauthorized`);
        }
        setIsPhaseActive(data?.phase === "TEAM_WORK");
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

  if (loading) {
    return <Loading />;
  }

  if (!isPhaseActive) {
    return <h2>This phase is not active</h2>;
  }

  if (justEntered) {
    return (
      <>
        <h2 style={{ whiteSpace: "pre-line" }}>
          You will be assigned a team based on you ratings!
          {"\n"}These will be as interdisciplinary as possible.
        </h2>
        <h3
          style={{
            marginBottom: "1rem",
            marginTop: "2rem",
            whiteSpace: "pre-line",
          }}
        >
          Co-creation teams have been created!
          {"\n"}Your team will help this seed flourish:
        </h3>
        <h3 style={{ marginTop: 0 }}>{seed?.title}</h3>
        <ParticipantList
          participants={participation?.teamMembers}
          participantStyle={{ margin: "2vw 2vw 0 2vw" }}
        />
        <AsterButton
          onClick={() => {
            setJustEntered(false);
          }}
        >
          <p>Enter co-creation team</p>
        </AsterButton>
      </>
    );
  }

  return (
    <div>
      <TeamHeader
        teamMembers={participation?.teamMembers}
        scientists={seed?.authors}
      />
      <h3>Additional information</h3>
      <p>Seed: {seed?.title}</p>
      <SeedResources seed={seed} isHorizontal includePdf />
      <AsterButton
        onClick={() => setShowMap(!showMap)}
        style={{ margin: "1rem", width: "10rem" }}
      >
        {showMap ? "Hide" : "Show"} maps
      </AsterButton>
      <DiagramGallery showMap={showMap} />
    </div>
  );
}
