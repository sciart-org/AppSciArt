import { useState } from "react";
import Participant from "../../../components/roles/Participant";
import useFetcher from "../../../utils/useFetcher";
import { useEffect } from "react";
import { useContext } from "react";
import { HackathonContext } from "../components/HackathonContext";
import "./TeamPresentation.css";
import FlowerPresentationCard from "./components/FlowerPresentationCard";

export default function TeamPresentation() {
  const { hackathon, socket } = useContext(HackathonContext);
  const hackathonId = hackathon?.id;

  const [teams, setTeams] = useState([]);
  const [presentingTeamNumber, setPresentingTeamNumber] = useState(null);
  const presentingTeam = teams.find((t) => t.number === presentingTeamNumber);

  const [error, setError] = useState(null);

  const { fetcher } = useFetcher(error, setError);

  useEffect(() => {
    if (!hackathonId) return;
    fetcher({
      url: `hackathons/${hackathonId}/clusters/${0}/co-creation-teams`,
      onSuccess: (data) => {
        setTeams(data);
      },
    });
  }, [hackathonId]);

  useEffect(() => {
    if (!socket || !hackathonId) return;
    socket.on("team_presenting_state", (presentingState) => {
      setPresentingTeamNumber(presentingState.presentingTeam);
    });

    socket.on("new_presenting_team", (teamNumber) => {
      setPresentingTeamNumber(teamNumber);
    });

    socket.emit("get_team_presenting_state", `${hackathonId}/cluster/${0}`);
  }, [socket, hackathonId]);

  return (
    <div>
      <div className="groups-container">
        {teams.map((team) => (
          <div>
            <Participant
              style={{
                height: team.number === presentingTeamNumber ? "6rem" : "4rem",
              }}
              multiple={true}
            />
            <p style={{ margin: 0 }}>Team {team.number}</p>
          </div>
        ))}
      </div>
      <FlowerPresentationCard
        flowerTitle={presentingTeam?.flowerTitle}
        seedTitle={presentingTeam?.seed?.title}
        flowerAuthors={presentingTeam?.members}
        seedScientists={presentingTeam?.seed?.authors}
      />
    </div>
  );
}
