import Carousel from "./components/Carousel";
import ParticipantHome from "./ParticipantHome";
import Home from "./Home";
import { useEffect, useState } from "react";
import useFetcher from "../../utils/useFetcher";
import Loading from "../../components/messages/Loading";
import "./css/Home.css";

export default function HomeRouter() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeHackathon, setActiveHackathon] = useState(null);

  const { fetcher } = useFetcher(error, setError);

  useEffect(() => {
    fetcher({
      url: "hackathons?filter=active",
      onSuccess: (data) => {
        console.log(data)
        setActiveHackathon(data);
      },
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <Carousel mocked={true} />
      {activeHackathon ? (
        <ParticipantHome hackathon={activeHackathon} />
      ) : (
        <Home />
      )}
    </div>
  );
}
