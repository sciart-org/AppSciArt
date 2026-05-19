import { useEffect, useState } from "react";
import tokenService from "../../utils/token.service";
import ActiveHackathon from "./ActiveHackathon";
import Loading from "../../components/messages/Loading";
import { useNavigate, useParams } from "react-router";
import useFetcher from "../../utils/useFetcher";
import HackathonEdit from "./HackathonEdit";
import HackathonManagement from "./HackathonManagement";
import { HackathonContext } from "./components/HackathonContext";
import Meet from "../home/components/Meet";

export default function HackathonRouter() {
  const isStaff = tokenService.getIsStaff();

  const [loading, setLoading] = useState(true);
  const [hackathon, setHackathon] = useState(null);
  const [participation, setParticipation] = useState(null);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);

  const [hackathonSeeds, setHackathonSeeds] = useState([]);
  const [coCreationTeams, setCoCreationTeams] = useState([]);
  const [exploringGroups, setExploringGroups] = useState([]);
  const [isEvaluatorOfHackathon, setIsEvaluatorOfHackathon] = useState(null);

  const { fetcher } = useFetcher(error, setError);

  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    fetcher({
      url: `hackathons/${params.hackathonId}/evaluators/me`,
      onSuccess: (data) => setIsEvaluatorOfHackathon(data.isEvaluator),
    });
  }, []);

  useEffect(() => {
    if (isEvaluatorOfHackathon === null) return;
    fetcher({
      url: `hackathons/${params.hackathonId}`,
      onSuccess: (data) => {
        if (!isStaff && !data.isEnrolled && !isEvaluatorOfHackathon) {
          navigate(`/unauthorized`);
        }
        setHackathon(data);
      },
    }).finally(() => setLoading(false));
  }, [isEvaluatorOfHackathon]);

  if (loading) {
    return <Loading />;
  }

  if (!hackathon) {
    return <h2>No hackathon found.</h2>;
  }

  if (hackathon.state === "FINISHED") {
    return <h2>This hackathon has finished. Thanks for coming!</h2>;
  }

  if (!isStaff && !isEvaluatorOfHackathon) {
    return (
      <HackathonContext
        value={{
          hackathon,
          setHackathon,
          participation,
          setParticipation,
          socket,
          setSocket,
        }}
      >
        {hackathon.phase !== "PREPARING" && (
          <Meet
            style={{
              position: "absolute",
              right: 0,
              margin: "1rem",
              width: "auto",
            }}
          >
            <span>Meet</span>
          </Meet>
        )}
        <ActiveHackathon />
      </HackathonContext>
    );
  }

  const handleNextPhase = ({ onError = () => {} } = {}) => {
    fetcher({
      url: `hackathons/${hackathon.id}/next-phase?broadcast=ALL`,
      method: "POST",
      onSuccess: (updatedHackathon) => {
        setHackathon(updatedHackathon);
      },
      onError,
    });
  };

  const updateParticipationState = (participationChanges) => {
    setHackathon((prev) => ({
      ...prev,
      participations: prev.participations.map((p) => {
        if (p.id === participationChanges.id) return participationChanges;

        const sameGroup =
          p.conceptualMap?.id === participationChanges.conceptualMap?.id;
        const sameTeam =
          p.teamFlower?.id === participationChanges.teamFlower?.id;

        return {
          ...p,
          ...(participationChanges.isGroupVoice &&
            sameGroup && { isGroupVoice: false }),
          ...(participationChanges.isTeamSpeaker &&
            sameTeam && { isTeamSpeaker: false }),
        };
      }),
    }));
  };

  const updateParticipant = async (
    participantId,
    newParticipant,
    broadcast = "ALL",
  ) => {
    await fetcher({
      url: `hackathons/${hackathon.id}/participants/${participantId}?broadcast=${broadcast}`,
      method: "PUT",
      body: newParticipant,
      onSuccess: (updatedParticipation) => {
        updateParticipationState(updatedParticipation);
      },
    });
  };

  if (hackathon.state === "CLOSED") {
    return (
      <HackathonContext
        value={{
          hackathon,
          setHackathon,
          socket,
          setSocket,
          handleNextPhase,
          hackathonSeeds,
          exploringGroups,
          coCreationTeams,
          updateParticipant,
          isEvaluatorOfHackathon
        }}
      >
        <HackathonManagement
          updateParticipationState={updateParticipationState}
          setHackathonSeeds={setHackathonSeeds}
          setExploringGroups={setExploringGroups}
          setCoCreationTeams={setCoCreationTeams}
        />
      </HackathonContext>
    );
  }

  return <HackathonEdit hackathon={hackathon} />;
}
