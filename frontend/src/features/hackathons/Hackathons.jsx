import { useEffect, useState } from "react";
import HackathonCard from "../../components/HackathonCard";
import useFetcher from "../../utils/useFetcher";

export default function Hackathons() {
  const [hackathons, setHackathons] = useState([]);
  const [error, setError] = useState(null);
  const { fetcher } = useFetcher(error, setError);

  const fetchHackathons = async () => {
    const isAdmin = false;

    await fetcher({
      url: `hackathons?filter=${isAdmin ? "all" : "incoming"}`,
      onSuccess: (data) => {
        setHackathons(data);
      },
    });
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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {Object.entries(hackathonsByEdition).map(
          ([editionName, hackathons]) => (
            <>
              <h2
                style={{
                  textAlign: "start",
                  justifySelf: "center",
                  width: "70vw",
                }}
              >
                {editionName.toUpperCase()}
              </h2>
              {hackathons.map((h) => (
                <HackathonCard hackathon={h} style={{ marginBottom: "5vh" }} />
              ))}
            </>
          )
        )}
      </div>
    </div>
  );
}
