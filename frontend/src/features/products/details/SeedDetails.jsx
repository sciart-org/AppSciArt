import { useEffect, useState } from "react";
import { useParams } from "react-router";
import useFetcher from "../../../utils/useFetcher";
import Loading from "../../../components/messages/Loading";

export default function SeedDetails() {
  const params = useParams();
  const [error, setError] = useState(null);
  const [seed, setSeed] = useState(null);
  const [loading, setLoading] = useState(true);

  const { fetcher } = useFetcher(error, setError);

  const fetchSeed = async () => {
    await fetcher({
      url: `seeds/${params.seedId}`,
      onSuccess: (data) => {
        setSeed(data);
      },
    }).finally(() => {
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchSeed();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <h1>{seed?.title}</h1>
    </div>
  );
}
