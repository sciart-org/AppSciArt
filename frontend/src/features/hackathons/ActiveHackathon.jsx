import { useNavigate, useParams } from "react-router";
import useFetcher from "../../utils/useFetcher";
import { useEffect, useState } from "react";
import Loading from "../../components/messages/Loading";
import useWebSockets from "../../utils/useWebSockets";

export default function ActiveHackathon() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hackathon, setHackathon] = useState(null);

  const date = new Date(hackathon?.startDate);
  const rawDays = new Date() - date;

  const { fetcher } = useFetcher(error, setError);
  const params = useParams();
  const navigate = useNavigate();

  const socketCondition = !(
    !hackathon ||
    hackathon.state === "FINISHED" ||
    rawDays < 0
  );
  const { socket } = useWebSockets(socketCondition, params.hackathonId);

  useEffect(() => {
    fetcher({
      url: `hackathons/${params.hackathonId}`,
      onSuccess: (data) => {
        if (!data.isEnrolled) {
          navigate(`/unauthorized`);
        }
        setHackathon(data);
      },
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (hackathon.state === "FINISHED") {
    return <h2>This hackathon has finished. Thanks for coming!</h2>;
  }

  if (rawDays < 0) {
    return <h2>This hackathon has not started yet.</h2>;
  }

  return <h2>You are in the hackathon!</h2>;
}
