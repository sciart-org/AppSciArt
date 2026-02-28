import { useEffect, useState } from "react";
import tokenService from "../../utils/token.service";
import ActiveHackathon from "./ActiveHackathon";
import Loading from "../../components/messages/Loading";
import { useNavigate, useParams } from "react-router";
import useFetcher from "../../utils/useFetcher";
import HackathonEdit from "./HackathonEdit";

export default function HackathonRouter() {
  const isAdmin = tokenService.getIsAdmin();

  const [loading, setLoading] = useState(true);
  const [hackathon, setHackathon] = useState(null);
  const [error, setError] = useState(null);

  const { fetcher } = useFetcher(error, setError);

  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    fetcher({
      url: `hackathons/${params.hackathonId}`,
      onSuccess: (data) => {
        if (!isAdmin && !data.isEnrolled) {
          navigate(`/unauthorized`);
        }
        setHackathon(data);
      },
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (isAdmin) {
    return <HackathonEdit/>
  }

  return <ActiveHackathon hackathon={hackathon} />;
}
