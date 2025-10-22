import { useNavigate, useParams } from "react-router";
import useFetcher from "../../utils/useFetcher";
import { useEffect, useState } from "react";
import Loading from "../../components/messages/Loading";
import useWebSockets from "../../utils/useWebSockets";
import CreatedGroups from "./phases/CreatedGroups";
import CreatingGroups from "./phases/CreatingGroups";
import PreparingHackathon from "./phases/PreparingHackathon";
import GroupPresentation from "./phases/GroupPresentation";
import CreatingTeams from "./phases/CreatingTeams";
import CreatedTeams from "./phases/CreatedTeams";

export default function ActiveHackathon() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hackathon, setHackathon] = useState(null);
  const [participation, setParticipation] = useState(null);

  const date = new Date(hackathon?.startDate);
  const rawDays = new Date() - date;

  const { fetcher } = useFetcher(error, setError);
  const params = useParams();
  const navigate = useNavigate();

  const socketCondition = !(
    !hackathon ||
    hackathon.state === "FINISHED" ||
    rawDays < 0
  );
  const { socket } = useWebSockets(socketCondition, params.hackathonId);

  useEffect(() => {
    fetcher({
      url: `hackathons/${params.hackathonId}`,
      onSuccess: (data) => {
        if (!data.isEnrolled) {
          navigate(`/unauthorized`);
        }
        setHackathon(data);
      },
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetcher({
      url: `hackathons/${params.hackathonId}/participants/me`,
      onSuccess: (data) => {
        setParticipation(data);
      },
    });
  }, [hackathon?.phase]);

  useEffect(() => {
    const shouldNotConnect =
      !socket || !participation || !participation?.hackathonId;
    const shouldNotJoinCluster = participation?.clusterNumber === null;

    if (shouldNotConnect || shouldNotJoinCluster) return;

    const clusterRoom = `${participation?.hackathonId}/cluster/${participation?.clusterNumber}`;
    socket.emit("join_room", clusterRoom);
  }, [participation, socket]);

  if (loading || !hackathon) {
    return <Loading />;
  }

  if (hackathon.state === "FINISHED") {
    return <h2>This hackathon has finished. Thanks for coming!</h2>;
  }

  if (rawDays < 0) {
    return <h2>This hackathon has not started yet.</h2>;
  }

  if (hackathon.phase === "PREPARING") {
    return <PreparingHackathon hackathon={hackathon} />;
  } else if (hackathon.phase === "GROUP_CREATION") {
    return <CreatingGroups />;
  } else if (hackathon.phase === "GROUP_WORK") {
    return <CreatedGroups participation={participation} socket={socket} />;
  } else if (hackathon.phase === "GROUP_PRESENTATION") {
    return (
      <GroupPresentation
        socket={socket}
        hackathonId={params.hackathonId}
        clusterNumber={participation?.clusterNumber}
      />
    );
  } else if (hackathon.phase === "TEAM_CREATION") {
    return <CreatingTeams />;
  } else if (hackathon.phase === "TEAM_WORK") {
    return <CreatedTeams participation={participation} />;
  } else {
    return <h2>Unknown phase: {hackathon.phase}</h2>;
  }
}
