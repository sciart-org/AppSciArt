import { useEffect, useState } from "react";
import HackathonCard from "../../components/HackathonCard";
import useFetcher from "../../utils/useFetcher";
import Loading from "../../components/messages/Loading";

export default function Hackathons() {
  const [hackathons, setHackathons] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const { fetcher } = useFetcher(error, setError);

  const fetchHackathons = async () => {
    const isAdmin = false;

    await fetcher({
      url: `hackathons?filter=${isAdmin ? "all" : "incoming"}`,
      onSuccess: (data) => {
        setHackathons(data);
      },
    }).finally(() => {
      setLoading(false);
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

  const Header = () => <h1>Next hackathons</h1>;

  if (loading) {
    return (
      <>
        <Header />
        <Loading />
      </>
    );
  }

  if (hackathons.length === 0) {
    return (
      <>
        <Header />
        <h2 style={{ fontWeight: "normal" }}>No incoming hackthons</h2>
      </>
    );
  }

  return (
    <div>
      <Header />
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
