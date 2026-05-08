import { useContext, useEffect, useState } from "react";
import useWebSockets from "../../utils/useWebSockets";
import CreatedGroups from "./phases/CreatedGroups";
import CreatingGroups from "./phases/CreatingGroups";
import PreparingHackathon from "./phases/PreparingHackathon";
import GroupPresentation from "./phases/GroupPresentation";
import CreatingTeams from "./phases/CreatingTeams";
import CreatedTeams from "./phases/CreatedTeams";
import { HackathonContext } from "./components/HackathonContext";
import { showErrorMessage } from "../../components/messages/Message";
import useFetcher from "../../utils/useFetcher";

export default function ActiveHackathon() {
  const {
    hackathon,
    setHackathon,
    participation,
    setParticipation,
    setSocket,
  } = useContext(HackathonContext);

  const date = new Date(hackathon?.startDate);
  const rawDays = new Date() - date;

  const socketCondition = !(
    !hackathon ||
    hackathon.state === "FINISHED" ||
    rawDays < 0
  );

  const [error, setError] = useState(null);
  const { socket } = useWebSockets(socketCondition, hackathon.id);
  const { fetcher } = useFetcher(error, setError);

  const fetchParticipation = async () => {
    await fetcher({
      url: `hackathons/${hackathon?.id}/participants/me`,
      onSuccess: (data) => setParticipation(data),
    });
  };

  useEffect(() => {
    fetchParticipation();
  }, []);

  useEffect(() => {
    const shouldNotConnect =
      !socket || !participation || !participation?.hackathonId;
    const shouldNotJoinCluster = participation?.clusterNumber == null;

    if (shouldNotConnect || shouldNotJoinCluster) return;

    const clusterRoom = `${participation?.hackathonId}/cluster/${participation?.clusterNumber}`;
    socket.emit("join_room", clusterRoom);
  }, [participation, socket]);

  useEffect(() => {
    if (!socket) return;
    setSocket(socket);
    socket.on("hackathon:updated", (hackathonChanges) => {
      if (hackathonChanges.id !== hackathon.id) return;
      setHackathon((prev) => ({ ...prev, ...hackathonChanges }));
    });
    socket.on("participation:updated", () => {
      fetchParticipation();
    });
    socket.on("error_message", (error) => {
      showErrorMessage(error);
    });
  }, [socket]);

  if (rawDays < 0) {
    return <h2>This hackathon has not started yet.</h2>;
  }

  if (hackathon.phase === "PREPARING") {
    return <PreparingHackathon />;
  } else if (hackathon.phase === "GROUP_CREATION") {
    return <CreatingGroups />;
  } else if (hackathon.phase === "GROUP_WORK") {
    return <CreatedGroups />;
  } else if (hackathon.phase === "GROUP_PRESENTATION") {
    return (
      <GroupPresentation
        socket={socket}
        hackathonId={hackathon.id}
        clusterNumber={participation?.clusterNumber}
      />
    );
  } else if (hackathon.phase === "TEAM_CREATION") {
    return <CreatingTeams />;
  } else if (hackathon.phase === "TEAM_WORK") {
    return <CreatedTeams />;
  } else {
    return <h2>Unknown phase: {hackathon.phase}</h2>;
  }
}
