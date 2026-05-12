import { useState } from "react";
import Participant from "../../../components/roles/Participant";
import useFetcher from "../../../utils/useFetcher";
import { useEffect } from "react";
import { useContext } from "react";
import { HackathonContext } from "../components/HackathonContext";
import Flower from "../../../components/sciartProducts/Flower";
import Loading from "../../../components/messages/Loading";
import "./TeamPresentation.css";

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

  const getFullName = (m) => `${m.name} ${m.surname}`;

  const SeedFlowerTitles = () => {
    return (
      <div
        style={{
          display: "flex",
          textAlign: "start",
        }}
      >
        <div style={{ flex: 1 }}>
          <h3 style={{ marginBottom: 0 }}>Flower:</h3>
          <h3 style={{ fontWeight: "unset" }}>
            {presentingTeam?.flowerTitle ?? "No title yet"}
          </h3>
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ marginBottom: 0 }}>Original seed:</h3>
          <h3 style={{ fontWeight: "unset" }}>{presentingTeam?.seed?.title}</h3>
        </div>
      </div>
    );
  };

  const SeedFlowerAuthors = () => {
    return (
      <div
        style={{
          display: "flex",
          textAlign: "start",
        }}
      >
        <div style={{ flex: 1 }}>
          <h3>Authors:</h3>
          {presentingTeam?.members.map((m) => {
            return <h3 className="member-name">{getFullName(m)}</h3>;
          })}
        </div>
        <div style={{ flex: 1 }}>
          <h3>Scientists:</h3>
          {presentingTeam?.seed?.authors.map((m) => {
            return <h3 className="member-name">{getFullName(m)}</h3>;
          })}
        </div>
      </div>
    );
  };

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
      <div className="team-presentation-container">
        <Flower style={{ height: "50vh", marginRight: "2rem" }} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <SeedFlowerTitles />
          <SeedFlowerAuthors />
        </div>
      </div>
    </div>
  );
}
