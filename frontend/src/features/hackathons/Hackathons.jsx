import { useEffect, useState } from "react";
import HackathonCard from "../../components/HackathonCard";
import tokenService from "../../utils/token.service";

export default function Hackathons() {
  const API_URL = import.meta.env.VITE_API_URL;
  const user = tokenService.getUser();
  const jwt = tokenService.getLocalAccessToken();
  const [hackathons, setHackathons] = useState([]);
  const [error, setError] = useState(null);

  const fetchHackathons = async () => {
    const isAdmin = false;

    await fetch(
      `${API_URL}/hackathons?filter=${isAdmin ? "all" : "incoming"}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      }
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (!data.error) {
          setError(null);
          setHackathons(data);
        } else {
          setError(data.error);
        }
      })
      .catch((error) => setError(error));
  };

  useEffect(() => {
    fetchHackathons();
  }, []);

  const hackathonsByEdition = hackathons?.reduce(
    (groupedHackathons, hackathon) => {
      if (!groupedHackathons[hackathon.editionName]) {
        groupedHackathons[hackathon.editionName] = [];
      }
      groupedHackathons[hackathon.editionName].push(hackathon);
      return groupedHackathons;
    },
    {}
  );

  return (
    <div>
      <h1>Next hackathons</h1>
      {Object.entries(hackathonsByEdition).map(([editionName, hackathons]) => (
        <>
          <h2
            style={{ textAlign: "start", justifySelf: "center", width: "70vw" }}
          >
            {editionName.toUpperCase()}
          </h2>
          {hackathons.map((h) => (
            <HackathonCard hackathon={h} style={{ marginBottom: "5vh" }} />
          ))}
        </>
      ))}
    </div>
  );
}
