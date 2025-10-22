import { useEffect, useState } from "react";
import AsterButton from "../../components/AsterButton";
import useFetcher from "../../utils/useFetcher";
import SeedCard from "../../components/SeedCard";

export default function ScientistHome({ edition }) {
  const [error, setError] = useState(null);
  const [seeds, setSeeds] = useState(null);

  const { fetcher } = useFetcher(error, setError);

  useEffect(() => {
    if (!edition?.id) return;
    fetcher({
      url: `scientists/me/editions/${edition?.id}/seeds`,
      onSuccess: (data) => {
        setSeeds(data || []);
      },
    });
  }, [edition]);

  return (
    <>
      <h1>Welcome!</h1>
      <h2>
        You have been invited to participate in {edition?.name} as an Inspiring
        Scientist!
      </h2>
      <h3>Your seeds:</h3>
      <p>
        {seeds
          ? seeds.length === 0
            ? "No seeds"
            : seeds.map((s) => <SeedCard seed={s} style={{ margin: "auto" }} />)
          : "Loading..."}
      </p>
      <AsterButton disabled={true} style={{ width: "10rem" }}>
        Create seed
      </AsterButton>
      <p>
        This feature is not yet available! Contact our team to create a new seed
      </p>
    </>
  );
}
