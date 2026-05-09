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
import ManageGroupPresentations from "./adminPhases/ManageGroupPresentations";
import { showErrorMessage } from "../../components/messages/Message";
import CreateTeams from "./adminPhases/CreateTeams";
import WarningText from "../../components/messages/WarningText";
import useFetcher from "../../utils/useFetcher";
import Loading from "../../components/messages/Loading";
import ManageTeams from "./adminPhases/ManageTeams";

export default function HackathonManagement({
  updateParticipationState,
  setHackathonSeeds,
  setExploringGroups,
  setCoCreationTeams,
}) {
  const {
    hackathon,
    setHackathon,
    setSocket,
    exploringGroups,
    coCreationTeams,
  } = useContext(HackathonContext);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const { socket } = useWebSockets(!!hackathon, `${hackathon.id}/staff`);
  const { fetcher } = useFetcher(error, setError);

  const hackathonPhases = [
    "PREPARING",
    "GROUP_CREATION",
    "GROUP_WORK",
    "GROUP_PRESENTATION",
    "TEAM_CREATION",
    "TEAM_WORK",
    "TEAM_PRESENTATION",
  ];

  const [selectedPhase, setSelectedPhase] = useState(
    hackathonPhases.indexOf(hackathon.phase),
  );

  const fetchExploringGroups = async () => {
    await fetcher({
      url: `hackathons/${hackathon.id}/clusters/${0}/exploring-groups`,
      onSuccess: (data) => setExploringGroups(data),
    });
  };

  const fetchCoCreationTeams = async () => {
    await fetcher({
      url: `hackathons/${hackathon.id}/clusters/${0}/co-creation-teams`,
      onSuccess: (data) => setCoCreationTeams(data),
    });
  };

  const fetchSeeds = async () => {
    await fetcher({
      url: `seeds?hackathonId=${hackathon.id}`,
      onSuccess: (data) => setHackathonSeeds(data),
    });
  };

  const fetchHackathonItems = async () => {
    try {
      await Promise.all([
        fetchExploringGroups(),
        fetchCoCreationTeams(),
        fetchSeeds(),
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSelectedPhase(hackathonPhases.indexOf(hackathon.phase));
    fetchHackathonItems();
  }, [hackathon.phase]);

  useEffect(() => {
    if (!socket) return;
    setSocket(socket);
    socket.on("hackathon:updated", (hackathonChanges) => {
      if (hackathonChanges.id !== hackathon.id) return;
      setHackathon((prev) => ({ ...prev, ...hackathonChanges }));
    });

    socket.on("participation:updated", (participationChanges) => {
      updateParticipationState(participationChanges);
    });

    socket.on("group:updated", (groupChanges) => {
      if (!exploringGroups.map((g) => g.id).includes(groupChanges.id)) {
        fetchExploringGroups();
        return;
      }
      setExploringGroups((prev) =>
        prev.map((g) =>
          g.id === groupChanges.id ? { ...g, ...groupChanges } : g,
        ),
      );
    });

    socket.on("team:updated", (teamChanges) => {
      if (!coCreationTeams.map((f) => f.id).includes(teamChanges.id)) {
        fetchCoCreationTeams();
        return;
      }
      setCoCreationTeams((prev) =>
        prev.map((f) =>
          f.id === teamChanges.id ? { ...f, ...teamChanges } : f,
        ),
      );
    });

    socket.on("group:removed", (groupId) => {
      setExploringGroups((prev) => prev.filter((g) => g.id !== groupId));
    });

    socket.on("error_message", (error) => {
      showErrorMessage(error);
    });
  }, [socket]);

  const phaseScreen = () => {
    if (selectedPhase > hackathonPhases.indexOf(hackathon.phase)) {
      return <p>Phase not yet started</p>;
    }

    const screens = {
      PREPARING: <PrepareHackathon />,
      GROUP_CREATION: <CreateGroups />,
      GROUP_WORK: <ManageGroups />,
      GROUP_PRESENTATION: <ManageGroupPresentations />,
      TEAM_CREATION: <CreateTeams />,
      TEAM_WORK: <ManageTeams />,
      TEAM_PRESENTATION: "Under development",
    };

    return (
      screens[hackathonPhases[selectedPhase]] ?? (
        <h2>Unknown phase: {hackathon.phase}</h2>
      )
    );
  };

  if (loading) {
    return <Loading />;
  }

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
                <WarningText className="hackathon-warning-phase">
                  ⚠ This is a past phase
                </WarningText>
              )}
            </div>
          );
        })}
      </SelectorBar>
      {phaseScreen()}
    </div>
  );
}
