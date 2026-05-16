import React, { useEffect, useState } from "react";
import useFetcher from "../../utils/useFetcher";
import Loading from "../../components/messages/Loading";
import EditionCard from "../../components/cards/EditionCard";
import AdminCreateButton from "../../components/buttons/AdminCreateButton";

export default function Editions() {
  const [editions, setEditions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const ongoingEditions = editions.filter((e) => e.state !== "PUBLISHED");
  const publishedEditions = editions.filter((e) => e.state === "PUBLISHED");

  const { fetcher } = useFetcher(error, setError);

  const fetchEditions = async () => {
    await fetcher({
      url: `editions`,
      onSuccess: (data) => {
        setEditions(data);
      },
    }).finally(() => {
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchEditions();
  }, []);

  const Header = () => <h1>Editions</h1>;

  if (loading) {
    return (
      <>
        <Header />
        <div>
          <Loading />
        </div>
      </>
    );
  }

  if (editions.length === 0) {
    return (
      <>
        <Header />
        <AdminCreateButton entity="Edition" />
        <p className="empty-search">No editions found.</p>
      </>
    );
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Header />
        <AdminCreateButton entity="Edition" />
        <h2 style={{ textAlign: "start", width: "70vw" }}>Ongoing editions</h2>

        {ongoingEditions.length > 0 ? (
          ongoingEditions.map((e) => (
            <EditionCard edition={e} style={{ marginBottom: "5vh" }} />
          ))
        ) : (
          <h3 style={{ fontWeight: "normal" }}>No ongoing editions found</h3>
        )}

        <h2 style={{ textAlign: "start", width: "70vw" }}>Previous editions</h2>

        {publishedEditions.length > 0 ? (
          publishedEditions.map((e) => {
            return <EditionCard edition={e} style={{ marginBottom: "5vh" }} />;
          })
        ) : (
          <h3 style={{ fontWeight: "normal" }}>No published editions found</h3>
        )}
      </div>
    </div>
  );
}
