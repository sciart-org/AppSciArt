import { useEffect, useState } from "react";
import { useParams } from "react-router";
import tokenService from "../../utils/token.service";
import HackathonCard from "../../components/HackathonCard.jsx";
import JoinForm from "./components/JoinForm.jsx";
import HackathonDescription from "./components/HackathonDescription.jsx";

export default function JoinHackathon() {
  const API_URL = import.meta.env.VITE_API_URL;
  const params = useParams();

  const [loading, setLoading] = useState(true);
  const [hackathon, setHackathon] = useState(null);
  const [error, setError] = useState(null);
  const [joined, setJoined] = useState(false);
  const [formData, setFormData] = useState({
    roles: null,
    interests: null,
  });

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
        if (!data.error) {
          setHackathon(data);
          setError(null);
        } else {
          setError(data.error);
        }
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, []);

  const itemsToLowerCase = (list) => {
    if (list === null) return null;
    return list.map((v) => v.toLowerCase());
  };

  const joinHackathon = () => {
    console.log(formData);
    fetch(`${API_URL}/hackathons/${params.hackathonId}/participants/me`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        ...formData,
        roles: itemsToLowerCase(formData.roles),
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (!data.error) {
          setJoined(true);
          setFormData({
            roles: null,
            interests: null,
          });
          setError(null);
        } else {
          setError(data.error);
        }
      })
      .catch((error) => setError(error));
  };

  if (loading) {
    return (
      <div style={{ height: "100%", alignContent: "center" }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!hackathon || hackathon === undefined) {
    return (
      <div style={{ height: "100%", alignContent: "center" }}>
        <p>Could not find the specified hackathon</p>
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
      <HackathonDescription hackathon={hackathon} />
      <h2>Join now!</h2>
      <JoinForm
        formData={formData}
        setFormData={setFormData}
        onSubmit={joinHackathon}
        showButton={!joined}
      />
      <div>{joined && <p>You joined successfully!</p>}</div>
      <div>{error && <p style={{ color: "red" }}>{error}</p>}</div>
    </div>
  );
}
