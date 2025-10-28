import EditionDetails from "./EditionDetails";
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import useFetcher from "../../utils/useFetcher";
import Loading from "../../components/messages/Loading";
import EditionCreation from "./css/EditionCreation";

export default function EditionRouter() {
  const params = useParams();
  const [error, setError] = useState(null);
  const [edition, setEdition] = useState(null);
  const [loading, setLoading] = useState(true);

  const { fetcher } = useFetcher(error, setError);

  const fetchEdition = async () => {
    await fetcher({
      url: `editions/${params.editionId}`,
      onSuccess: (data) => {
        setEdition(data);
      },
    }).finally(() => {
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchEdition();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (edition?.state !== "PUBLISHED") {
    return <EditionCreation edition={edition} />;
  }

  return <EditionDetails edition={edition} />;
}
