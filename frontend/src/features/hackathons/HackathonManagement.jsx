import { useContext } from "react";
import useWebSockets from "../../utils/useWebSockets";
import { HackathonContext } from "./components/HackathonContext";

export default function HackathonManagement() {
  const { hackathon } = useContext(HackathonContext);
  const { socket } = useWebSockets(!!hackathon, hackathon.id);

  if (hackathon.phase === "PREPARING") {
    return "Under development";
  } else if (hackathon.phase === "GROUP_CREATION") {
    return "Under development";
  } else if (hackathon.phase === "GROUP_WORK") {
    return "Under development";
  } else if (hackathon.phase === "GROUP_PRESENTATION") {
    return "Under development";
  } else if (hackathon.phase === "TEAM_CREATION") {
    return "Under development";
  } else if (hackathon.phase === "TEAM_WORK") {
    return "Under development";
  } else {
    return <h2>Unknown phase: {hackathon.phase}</h2>;
  }
}
