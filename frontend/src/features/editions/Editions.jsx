import React, { useEffect, useState } from "react";
import useFetcher from "../../utils/useFetcher";
import Loading from "../../components/messages/Loading";
import EditionCard from "../../components/cards/EditionCard";
import AdminCreateButton from "../../components/buttons/AdminCreateButton";
import "./Editions.css";

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
      <div className="edition-list">
        <Header />
        <AdminCreateButton entity="Edition" />
        <h2>Ongoing editions</h2>

        {ongoingEditions.length > 0 ? (
          ongoingEditions.map((e) => <EditionCard edition={e} />)
        ) : (
          <p className="empty-search">No editions found.</p>
        )}

        <h2>Previous editions</h2>

        {publishedEditions.length > 0 ? (
          publishedEditions.map((e) => <EditionCard edition={e} />)
        ) : (
          <p className="empty-search">No editions found.</p>
        )}
      </div>
    </div>
  );
}
