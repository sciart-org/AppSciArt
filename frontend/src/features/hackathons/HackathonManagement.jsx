import { useContext, useState } from "react";
import useWebSockets from "../../utils/useWebSockets";
import { HackathonContext } from "./components/HackathonContext";
import PrepareHackathon from "./adminPhases/PrepareHackathon";
import { useEffect } from "react";
import CreateGroups from "./adminPhases/CreateGroups";
import "./adminPhases/adminPhases.css";
import SelectorBar from "../../components/buttons/SelectorBar";
import AsterButton from "../../components/buttons/AsterButton";
import { parseEnumValue } from "../../utils/commonUtils";
import ManageGroups from "./adminPhases/ManageGroups";
import useFetcher from "../../utils/useFetcher";

export default function HackathonManagement() {
  const { hackathon, setHackathon, setSocket } = useContext(HackathonContext);
  const { socket } = useWebSockets(!!hackathon, `${hackathon.id}/staff`);
  const [error, setError] = useState(null);

  const { fetcher } = useFetcher(error, setError);

  const [exploringGroups, setExploringGroups] = useState([]);

  const hackathonPhases = [
    "PREPARING",
    "GROUP_CREATION",
    "GROUP_WORK",
    "GROUP_PRESENTATION",
    "TEAM_CREATION",
    "TEAM_WORK",
  ];

  const [selectedPhase, setSelectedPhase] = useState(
    hackathonPhases.indexOf(hackathon.phase),
  );

  useEffect(() => {
    setSelectedPhase(hackathonPhases.indexOf(hackathon.phase));
    fetchExploringGroups();
  }, [hackathon.phase]);

  const updateParticipation = (participationChanges) => {
    setHackathon((prev) => ({
      ...prev,
      participations: prev.participations.map((p) => {
        if (p.id === participationChanges.id) return participationChanges;
        if (
          participationChanges.isGroupVoice &&
          p.conceptualMap?.id === participationChanges.conceptualMap?.id
        ) {
          return { ...p, isGroupVoice: false };
        }
        return p;
      }),
    }));
  };

  const fetchExploringGroups = async () => {
    await fetcher({
      url: `hackathons/${hackathon.id}/clusters/${0}/exploring-groups`,
      onSuccess: (data) => {
        setExploringGroups(data);
      },
    });
  };

  useEffect(() => {
    if (!socket) return;
    setSocket(socket);
    socket.on("hackathon:updated", (hackathonChanges) => {
      if (hackathonChanges.id !== hackathon.id) return;
      setHackathon((prev) => ({ ...prev, ...hackathonChanges }));
    });

    socket.on("participation:updated", (participationChanges) => {
      updateParticipation(participationChanges);
      fetchExploringGroups();
    });
  }, [socket]);

  useEffect(() => {
    if (!hackathon.id) return;
    fetchExploringGroups();
  }, [hackathon.id]);

  const phaseScreen = () => {
    if (selectedPhase > hackathonPhases.indexOf(hackathon.phase)) {
      return <p>Phase not yet started</p>;
    }

    const screens = {
      PREPARING: <PrepareHackathon updateParticipation={updateParticipation} />,
      GROUP_CREATION: (
        <CreateGroups
          updateParticipation={updateParticipation}
          exploringGroups={exploringGroups}
          fetchExploringGroups={fetchExploringGroups}
        />
      ),
      GROUP_WORK: <ManageGroups exploringGroups={exploringGroups} />,
      GROUP_PRESENTATION: "Under development",
      TEAM_CREATION: "Under development",
      TEAM_WORK: "Under development",
    };

    return (
      screens[hackathonPhases[selectedPhase]] ?? (
        <h2>Unknown phase: {hackathon.phase}</h2>
      )
    );
  };

  return (
    <div className="hackathon-management-page">
      <h1 style={{ marginTop: 0 }}>{hackathon.internalName}</h1>
      <SelectorBar className="hackathon-phase-selector">
        {hackathonPhases.map((p) => {
          const isSelected = selectedPhase === hackathonPhases.indexOf(p);
          const isCurrent = p === hackathon.phase;
          const isPast =
            hackathonPhases.indexOf(p) <
            hackathonPhases.indexOf(hackathon.phase);

          return (
            <div style={{ position: "relative", flex: 1 }}>
              <AsterButton
                onClick={() => setSelectedPhase(hackathonPhases.indexOf(p))}
                style={{ borderRadius: 0, width: "100%" }}
                className={[
                  isCurrent ? "current-hackathon-phase" : "",
                  isSelected
                    ? "aster-button-hover"
                    : isPast
                      ? "past-hackathon-phase"
                      : "",
                ].join(" ")}
              >
                {parseEnumValue(p)}
              </AsterButton>
              {isPast && isSelected && (
                <p className="warning-text hackathon-warning-phase">
                  ⚠ This is a past phase
                </p>
              )}
            </div>
          );
        })}
      </SelectorBar>
      {phaseScreen()}
    </div>
  );
}
