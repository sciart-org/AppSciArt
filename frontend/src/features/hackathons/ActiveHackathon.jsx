import { useContext, useEffect } from "react";
import useWebSockets from "../../utils/useWebSockets";
import CreatedGroups from "./phases/CreatedGroups";
import CreatingGroups from "./phases/CreatingGroups";
import PreparingHackathon from "./phases/PreparingHackathon";
import GroupPresentation from "./phases/GroupPresentation";
import CreatingTeams from "./phases/CreatingTeams";
import CreatedTeams from "./phases/CreatedTeams";
import { HackathonContext } from "./components/HackathonContext";

export default function ActiveHackathon() {
  const { hackathon, participation } = useContext(HackathonContext);

  const date = new Date(hackathon?.startDate);
  const rawDays = new Date() - date;

  const socketCondition = !(
    !hackathon ||
    hackathon.state === "FINISHED" ||
    rawDays < 0
  );
  const { socket } = useWebSockets(socketCondition, hackathon.id);

  useEffect(() => {
    const shouldNotConnect =
      !socket || !participation || !participation?.hackathonId;
    const shouldNotJoinCluster = participation?.clusterNumber == null;

    if (shouldNotConnect || shouldNotJoinCluster) return;

    const clusterRoom = `${participation?.hackathonId}/cluster/${participation?.clusterNumber}`;
    socket.emit("join_room", clusterRoom);
  }, [participation, socket]);

  if (rawDays < 0) {
    return <h2>This hackathon has not started yet.</h2>;
  }

  if (hackathon.phase === "PREPARING") {
    return <PreparingHackathon />;
  } else if (hackathon.phase === "GROUP_CREATION") {
    return <CreatingGroups />;
  } else if (hackathon.phase === "GROUP_WORK") {
    return <CreatedGroups socket={socket} />;
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
