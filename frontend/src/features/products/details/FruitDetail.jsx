import { useEffect, useState } from "react";
import { useParams } from "react-router";
import useFetcher from "../../../utils/useFetcher";
import Loading from "../../../components/messages/Loading";

import "./css/details.css";

export default function FruitDetails() {
  const params = useParams();
  const [error, setError] = useState(null);
  const [fruit, setFruit] = useState(null);
  const [loading, setLoading] = useState(true);

  const { fetcher } = useFetcher(error, setError);

  const fetchFruit = async () => {
    await fetcher({
      url: `fruits/${params.fruitId}`,
      onSuccess: (data) => {
        setFruit(data);
      },
    }).finally(() => {
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchFruit();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <h1>{fruit?.title}</h1>
      <div className="details-container"></div>
    </div>
  );
}
