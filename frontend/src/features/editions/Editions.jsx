import React, { useEffect, useState } from "react";
import useFetcher from "../../utils/useFetcher";
import Loading from "../../components/messages/Loading";
import EditionCard from "../../components/EditionCard";
import AsterButton from "../../components/AsterButton";
import { useNavigate } from "react-router";
import tokenService from "../../utils/token.service";

export default function Editions() {
  const [editions, setEditions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const ongoingEditions = editions.filter((e) => e.state !== "PUBLISHED");
  const publishedEditions = editions.filter((e) => e.state === "PUBLISHED");

  const { fetcher } = useFetcher(error, setError);
  const navigate = useNavigate();
  const user = tokenService.getUser();
  const isAdmin = user?.roles.includes("administrator");

  const fetchEditions = async () => {
    await fetcher({
      url: `editions`,
      onSuccess: (data) => {
        if (isAdmin) {
          setEditions(data);
          return;
        }
        setEditions(data.filter((edition) => edition.state !== "PLANNED"));
      },
    }).finally(() => {
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchEditions();
  }, []);

  const Header = () => <h1 style={{ marginBottom: "5vh" }}>Editions</h1>;

  if (loading) {
    return (
      <>
        <Header />
        <Loading />
      </>
    );
  }

  const AdminCreateButton = () => {
    if (!isAdmin) return null;
    return (
      <AsterButton
        style={{ width: "20rem" }}
        onClick={() => navigate("create")}
      >
        Create Edition
      </AsterButton>
    );
  };

  if (editions.length === 0) {
    return (
      <>
        <Header />
        <AdminCreateButton />
        <h2 style={{ fontWeight: "normal" }}>No editions found</h2>
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
        <AdminCreateButton />
        <h2 style={{ textAlign: "start", width: "70vw" }}>Ongoing editions</h2>

        {ongoingEditions.length > 0 ? ongoingEditions.map((e) => (
          <EditionCard edition={e} style={{ marginBottom: "5vh" }} />
        )) : <h3 style={{ fontWeight: "normal" }}>No ongoing editions found</h3>}
        
        <h2 style={{ textAlign: "start", width: "70vw" }}>Previous editions</h2>

        {publishedEditions.length > 0 ? publishedEditions.map((e) => {
          return <EditionCard edition={e} style={{ marginBottom: "5vh" }} />;
        }) : <h3 style={{ fontWeight: "normal" }}>No published editions found</h3>}
      </div>
    </div>
  );
}
