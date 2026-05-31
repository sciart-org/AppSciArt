import { useEffect, useState } from "react";
import AsterButton from "../../../components/buttons/AsterButton";
import Clickable from "../../../components/buttons/Clickable";
import useFetcher from "../../../utils/useFetcher";
import Carousel from "../../home/components/Carousel";
import Loading from "../../../components/messages/Loading";
import { useNavigate } from "react-router";

export default function JoinSuccess({ hackathonId }) {
  const [error, setError] = useState(null);
  const [hackathonSeeds, setHackathonSeeds] = useState([]);
  const [loading, setLoading] = useState(true);

  const { fetcher } = useFetcher(error, setError);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetcher({
      url: `seeds?hackathonId=${hackathonId}`,
      onSuccess: (data) => {
        setHackathonSeeds(data);
      },
    }).finally(() => setLoading(false));
  }, [hackathonId]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <div>
        <h2>You have joined successfully</h2>
        <p> Updates will be sent to your email</p>
      </div>
      <div style={{ marginTop: "10vh" }}>
        <h3>Curious to see what you will be working on?</h3>
        <AsterButton to="/seeds">Seed collection</AsterButton>
      </div>
      <div>
        <p>See an example here</p>
        <Carousel
          small={true}
          allItems={hackathonSeeds.map((s) => {
            return { id: s.id, image: s.mainImage, text: s.title };
          })}
          onClickItem={(o) => navigate(`/seeds/${o.id}`)}
        />
      </div>
      <Clickable
        onClick={() => (window.location.href = "/")}
        style={{ marginTop: "5vh" }}
      >
        Home
      </Clickable>
    </div>
  );
}
