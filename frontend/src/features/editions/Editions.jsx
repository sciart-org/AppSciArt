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

  const { fetcher } = useFetcher(error, setError);
  const navigate = useNavigate();
  const user = tokenService.getUser();

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
    if (!user || !user.roles.includes("administrator")) return null;
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

  const AdminEditions = () => {
    if (!user || !user.roles.includes("administrator")) return null;
    return (
      <>
        <AdminCreateButton />
        {ongoingEditions.length > 0 && (
          <>
            <h2 style={{ textAlign: "start", width: "70vw" }}>
              Ongoing editions
            </h2>
            {ongoingEditions.map((e) => (
              <EditionCard edition={e} style={{ marginBottom: "5vh" }} />
            ))}
          </>
        )}
        <h2 style={{ textAlign: "start", width: "70vw" }}>Previous editions</h2>
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
        <Header />
        <AdminEditions />
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
