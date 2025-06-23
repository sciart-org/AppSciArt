import { useEffect, useState } from "react";
import { useParams } from "react-router";
import tokenService from "../../utils/token.service";
import HackathonCard from "../../components/HackathonCard.jsx";

export default function JoinHackathon() {
  const API_URL = import.meta.env.VITE_API_URL;
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [hackathon, setHackathon] = useState({});
  const jwt = tokenService.getLocalAccessToken();

  useEffect(() => {
    fetch(`${API_URL}/hackathons/${params.hackathonId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setHackathon(data);
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ height: "100%", alignContent: "center" }}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <h2>You are joining:</h2>
      <h1>{hackathon.editionName}</h1>
      <HackathonCard
        hackathon={hackathon}
        style={{ border: "none" }}
        hideButton={true}
      />
    </div>
  );
}
