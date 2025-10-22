import { useEffect, useState } from "react";
import { useParams } from "react-router";
import useFetcher from "../../../utils/useFetcher";
import Loading from "../../../components/messages/Loading";
import SeedCreation from "./SeedCreation";
import SeedDetails from "./SeedDetails";

export default function SeedRouter() {
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

  if (seed?.state !== "PUBLISHED") {
    return <SeedCreation seed={seed} />;
  }

  return <SeedDetails seed={seed} setSeed={setSeed} />;
}
