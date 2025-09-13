import { useEffect, useState } from "react";
import AsterButton from "../../../../components/AsterButton";
import { useNavigate, useParams } from "react-router";
import useFetcher from "../../../../utils/useFetcher";
import Loading from "../../../../components/messages/Loading";
import ParticipantList from "../ParticipantList";
import "./phases.css";
import PhaseTitle from "../PhaseTitle";

export default function CreatedGroups(props) {
  const [justEntered, setJustEntered] = useState(props.justEntered);
  const [participation, setParticipation] = useState(props.participation);
  const [isPhaseActive, setIsPhaseActive] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const { fetcher } = useFetcher(error, setError);
  const navigate = useNavigate();
  const params = useParams();

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
            navigate("group");
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

  return (
    <div>
      <GroupHeader />
    </div>
  );
}
