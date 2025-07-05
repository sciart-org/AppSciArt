import React, { useState } from "react";
import { useEffect } from "react";
import useFetcher from "../../utils/useFetcher";
import SeedCard from "./components/SeedCard";
import CollectionsPagination from "../../components/CollectionsPagination";
import tokenService from "../../utils/token.service";
import AsterButton from "../../components/AsterButton";
import EditionPicker from "./components/EditionPicker";
import "./css/collections.css";

export default function SeedCollection() {
  const jwt = tokenService.getLocalAccessToken();
  const [error, setError] = useState(null);
  const [seeds, setSeeds] = useState([]);
  const [allEditions, setAllEditions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEdition, setSelectedEdition] = useState(null);

  const { fetcher } = useFetcher(error, setError);

  useEffect(() => {
    fetcher({
      url: "editions?visibility=published",
      onSuccess: (data) => {
        setAllEditions(data);
        if (data.length > 0) {
          setSelectedEdition(data[0]);
        }
      },
      onError: () => {
        setAllEditions([]);
      },
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    if (!selectedEdition) {
      setSeeds([]);
      return;
    }
    fetcher({
      url: `seeds?editionId=${selectedEdition?.id}`,
      onSuccess: (data) => {
        setSeeds(data);
      },
    }).finally(() => setLoading(false));
  }, [selectedEdition]);

  const Header = () => {
    return (
      <>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h1>Seed Collection:</h1>
          <EditionPicker
            selectedEdition={selectedEdition}
            setSelectedEdition={setSelectedEdition}
            allEditions={allEditions}
          />
        </div>
        {!jwt && (
          <>
            <h2>You are not logged in! Want to get the full experience?</h2>
            <AsterButton to={"/signin"} style={{ marginBottom: "2rem" }}>
              Log in
            </AsterButton>
          </>
        )}
      </>
    );
  };

  if (loading) {
    return (
      <>
        <Header />
        <p>Loading...</p>
      </>
    );
  }

  return (
    <div>
      <Header />
      {seeds.length === 0 ? (
        <h2 style={{ fontWeight: "normal" }}>No seeds for this edition yet</h2>
      ) : (
        <CollectionsPagination
          items={seeds || []}
          itemsNumber={6}
          containerComponent={({ children }) => (
            <div className="collection-grid">{children}</div>
          )}
          itemComponent={SeedCard}
        />
      )}
    </div>
  );
}
