import Carousel from "./components/Carousel";
import ParticipantHome from "./ParticipantHome";
import Home from "./Home";
import { useEffect, useState } from "react";
import useFetcher from "../../utils/useFetcher";
import Loading from "../../components/messages/Loading";
import tokenService from "../../utils/token.service";
import "./Home.css";
import ScientistHome from "./ScientistHome";
import { useNavigate } from "react-router";

export default function HomeRouter() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeHackathon, setActiveHackathon] = useState(null);
  const [scientistEdition, setScientistEdition] = useState(null);
  const [editions, setEditions] = useState([]);
  const [loadingEditions, setLoadingEditions] = useState(true);

  const user = tokenService.getUser();

  const { fetcher } = useFetcher(error, setError);
  const navigate = useNavigate();

  useEffect(() => {
    fetcher({
      url: "editions",
      onSuccess: (data) => {
        setEditions(data);
      },
    }).finally(() => setLoadingEditions(false));
  }, []);

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
      <Carousel
        allItems={editions}
        loading={loadingEditions}
        onClickItem={(o) => navigate(`editions/${o?.id}`)}
      />
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
