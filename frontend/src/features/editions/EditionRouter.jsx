import EditionDetails from "./EditionDetails";
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import useFetcher from "../../utils/useFetcher";
import Loading from "../../components/messages/Loading";
import EditionEdit from "./EditionEdit";
import tokenService from "../../utils/token.service";

export default function EditionRouter() {
  const params = useParams();
  const [error, setError] = useState(null);
  const [edition, setEdition] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = tokenService.getUser();
  const isAdmin = user?.roles.includes("administrator");

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

  if (!edition) {
    return (
      <div style={{ height: "100%", alignContent: "center" }}>
        <p>No edition found.</p>
      </div>
    );
  }

  if (isAdmin && edition && edition?.state !== "PUBLISHED") {
    return <EditionEdit edition={edition} />;
  }

  return <EditionDetails edition={edition} />;
}
