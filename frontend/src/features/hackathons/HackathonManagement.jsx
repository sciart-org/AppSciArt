import { useContext } from "react";
import useWebSockets from "../../utils/useWebSockets";
import { HackathonContext } from "./components/HackathonContext";
import PrepareHackathon from "./adminPhases/PrepareHackathon";
import { useEffect } from "react";
import "./adminPhases/adminPhases.css";

export default function HackathonManagement() {
  const { hackathon, setHackathon, setSocket } = useContext(HackathonContext);
  const { socket } = useWebSockets(!!hackathon, hackathon.id);

  const updateParticipation = (participationChanges) => {
    setHackathon((prev) => ({
      ...prev,
      participations: prev.participations.map((p) =>
        p.id === participationChanges.id ? participationChanges : p,
      ),
    }));
  };

  useEffect(() => {
    if (!socket) return;
    setSocket(socket);
    const adminRoom = `${hackathon.id}/staff`;
    socket.emit("join_room", adminRoom);

    socket.on("hackathon:updated", (hackathonChanges) => {
      if (hackathonChanges.id !== hackathon.id) return;
      setHackathon((prev) => ({ ...prev, ...hackathonChanges }));
    });

    socket.on("participation:updated", (participationChanges) =>
      updateParticipation(participationChanges),
    );
  }, [socket]);

  if (hackathon.phase === "PREPARING") {
    return <PrepareHackathon updateParticipation={updateParticipation} />;
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
