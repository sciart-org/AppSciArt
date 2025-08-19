import { useNavigate, useParams } from "react-router";
import useFetcher from "../../utils/useFetcher";
import { useEffect, useState } from "react";
import Loading from "../../components/messages/Loading";
import useWebSockets from "../../utils/useWebSockets";
import CreatedGroups from "./components/phases/CreatedGroups";
import CreatingGroups from "./components/phases/CreatingGroups";
import PreparingHackathon from "./components/phases/PreparingHackathon";

export default function ActiveHackathon() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hackathon, setHackathon] = useState(null);
  const [participation, setParticipation] = useState(null);

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

  useEffect(() => {
    if (hackathon?.phase !== "GROUP_WORK") return;
    fetcher({
      url: `hackathons/${params.hackathonId}/participants/me`,
      onSuccess: (data) => {
        setParticipation(data);
      },
    });
  }, [hackathon?.phase]);

  if (loading || !hackathon) {
    return <Loading />;
  }

  if (hackathon.state === "FINISHED") {
    return <h2>This hackathon has finished. Thanks for coming!</h2>;
  }

  if (rawDays < 0) {
    return <h2>This hackathon has not started yet.</h2>;
  }

  if (hackathon.phase === "PREPARING") {
    return <PreparingHackathon hackathon={hackathon} />;
  } else if (hackathon.phase === "GROUP_CREATION") {
    return <CreatingGroups />;
  } else if (hackathon.phase === "GROUP_WORK") {
    return <CreatedGroups participation={participation} />;
  }
}
