import Carousel from "./components/Carousel";
import ParticipantHome from "./ParticipantHome";
import Home from "./Home";
import { useEffect, useState } from "react";
import useFetcher from "../../utils/useFetcher";
import Loading from "../../components/messages/Loading";
import tokenService from "../../utils/token.service";
import "./css/Home.css";
import ScientistHome from "./ScientistHome";

export default function HomeRouter() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeHackathon, setActiveHackathon] = useState(null);
  const [scientistEdition, setScientistEdition] = useState(null);
  const user = tokenService.getUser();

  const { fetcher } = useFetcher(error, setError);

  useEffect(() => {
    fetcher({
      url: "hackathons?filter=active",
      onSuccess: (data) => {
        setActiveHackathon(data);
      },
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!!activeHackathon || !user?.roles?.includes("inspiring_scientist"))
      return;
    fetcher({
      url: "scientists/me/editions",
      onSuccess: (data) => {
        if (data.length > 1) {
          //Not yet implemented
          return;
        }
        setScientistEdition(data[0] || null);
      },
    });
  }, [activeHackathon]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <Carousel mocked={true} />
      {activeHackathon ? (
        <ParticipantHome hackathon={activeHackathon} />
      ) : scientistEdition ? (
        <ScientistHome edition={scientistEdition} />
      ) : (
        <Home />
      )}
    </div>
  );
}
