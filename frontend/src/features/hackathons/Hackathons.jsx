import { useEffect, useState } from "react";
import HackathonCard from "../../components/cards/HackathonCard";
import useFetcher from "../../utils/useFetcher";
import Loading from "../../components/messages/Loading";
import AdminCreateButton from "../../components/buttons/AdminCreateButton";
import tokenService from "../../utils/token.service";
import "./hackathons.css";

export default function Hackathons() {
  const [hackathons, setHackathons] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { fetcher } = useFetcher(error, setError);

  const fetchHackathons = async () => {
    const isAdmin = tokenService.getIsAdmin();
    await fetcher({
      url: `hackathons${isAdmin ? "" : "?filter=incoming"}`,
      onSuccess: (data) => setHackathons(data),
    }).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchHackathons();
  }, []);

  const groupByEdition = (list) =>
    list?.reduce((groups, hackathon) => {
      if (!groups[hackathon.editionName]) groups[hackathon.editionName] = [];
      groups[hackathon.editionName].push(hackathon);
      return groups;
    }, {});

  const now = new Date();
  const hackathonSections = [
    {
      title: "Ongoing Hackathons",
      hackathons: groupByEdition(
        hackathons.filter(
          (h) => new Date(h.startDate) <= now && new Date(h.endDate) >= now,
        ),
      ),
    },
    {
      title: "Upcoming Hackathons",
      hackathons: groupByEdition(
        hackathons.filter((h) => new Date(h.startDate) > now),
      ),
    },
    {
      title: "Past Hackathons",
      hackathons: groupByEdition(
        hackathons.filter((h) => new Date(h.endDate) < now),
      ),
    },
  ];

  if (loading) {
    return (
      <>
        <h1>Hackathons</h1>
        <div>
          <Loading />
        </div>
      </>
    );
  }

  if (hackathons.length === 0)
    return (
      <>
        <h1>Hackathons</h1>
        <AdminCreateButton entity="Hackathon" />
        <p className="empty-search">No hackathons found.</p>
      </>
    );

  return (
    <div>
      <h1>Hackathons</h1>
      <AdminCreateButton entity="Hackathon" />
      {hackathonSections.map(({ title, hackathons }) => (
        <div key={title} className="hackathon-list-group">
          <h2>{title}</h2>
          {Object.keys(hackathons).length === 0 ? (
            <p className="empty-search">No hackathons found.</p>
          ) : (
            Object.entries(hackathons).map(([editionName, hackathonList]) => (
              <div key={editionName} className="hackathon-edition-group">
                <h3>{editionName.toUpperCase()}</h3>
                {hackathonList.map((h) => (
                  <HackathonCard
                    key={h.id}
                    hackathon={h}
                    style={{ marginBottom: "1rem" }}
                  />
                ))}
              </div>
            ))
          )}
        </div>
      ))}
    </div>
  );
}
