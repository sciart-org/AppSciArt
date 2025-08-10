import { useNavigate, useParams } from "react-router";
import useFetcher from "../../utils/useFetcher";
import { useEffect, useState } from "react";
import Loading from "../../components/messages/Loading";

export default function ActiveHackathon() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hackathon, setHackathon] = useState(null);

  const { fetcher } = useFetcher(error, setError);
  const params = useParams();
  const navigate = useNavigate();

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

  return <div></div>;
}
