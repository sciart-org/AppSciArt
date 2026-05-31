import { useEffect, useState } from "react";
import AsterButton from "../../components/buttons/AsterButton";
import useFetcher from "../../utils/useFetcher";
import ScientistSeedCard from "../../components/cards/ScientistSeedCard.jsx";

export default function ScientistHome({ editions }) {
  const [error, setError] = useState(null);
  const [editionSeeds, setEditionSeeds] = useState(null);
  const { fetcher } = useFetcher(error, setError);

  useEffect(() => {
    if (!editions?.length) return;
    Promise.all(
      editions.map((edition) =>
        fetcher({
          url: `scientists/me/editions/${edition.id}/seeds`,
          onSuccess: (data) => {
            setEditionSeeds((prev) => ({ ...prev, [edition.id]: data }));
          },
        }),
      ),
    );
  }, [editions]);

  return (
    <div style={{ margin: "0 auto" }}>
      <h1>Welcome!</h1>
      {editions?.length === 1 ? (
        <h2>
          You have been invited to participate in {editions[0].name} as an
          Inspiring Scientist!
        </h2>
      ) : (
        <h2>You have been invited to participate as an Inspiring Scientist!</h2>
      )}

      {editions?.map((edition) => (
        <div
          key={edition.id}
          style={{
            width: "70vw",
            marginInline: "auto",
            marginBlock: "1rem",
          }}
        >
          {editions.length > 1 && <h2>{edition.name}</h2>}

          <div style={{ display: "flex", justifyContent: "center" }}>
            {!editionSeeds ? (
              <p>Loading...</p>
            ) : editionSeeds[edition.id]?.length === 0 ? (
              <p className="empty-search">No seeds</p>
            ) : (
              editionSeeds[edition.id]?.map((s) => (
                <ScientistSeedCard key={s.id} seed={s} />
              ))
            )}
          </div>
        </div>
      ))}

      <div style={{ marginTop: "2rem" }}>
        <AsterButton style={{ width: "10rem" }} to="/seeds/create">
          Create seed
        </AsterButton>
      </div>
    </div>
  );
}
