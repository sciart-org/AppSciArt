import React, { useEffect, useState } from "react";
import useFetcher from "../../utils/useFetcher";
import Loading from "../../components/messages/Loading";
import EditionCard from "../../components/EditionCard";

export default function Editions() {
  const [editions, setEditions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const Header = () => <h1>Previous editions</h1>;

  if (loading) {
    return (
      <>
        <Header />
        <Loading />
      </>
    );
  }

  if (editions.length === 0) {
    return (
      <>
        <Header />
        <h2 style={{ fontWeight: "normal" }}>No editions found</h2>
      </>
    );
  }

  const AdminEditions = () => {
    const ongoingEditions = editions.filter((e) => e.state !== "PUBLISHED");
    if (!ongoingEditions || ongoingEditions.length === 0) return;
    return (
      <>
        <h1>Ongoing editions</h1>
        {ongoingEditions.map((e) => (
          <EditionCard edition={e} style={{ marginBottom: "5vh" }} />
        ))}
      </>
    );
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <AdminEditions />
        <Header />
        {editions.map((e) => {
          return (
            e.state === "PUBLISHED" && (
              <EditionCard edition={e} style={{ marginBottom: "5vh" }} />
            )
          );
        })}
      </div>
    </div>
  );
}
