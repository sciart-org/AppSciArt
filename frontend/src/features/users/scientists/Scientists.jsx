import { useEffect, useState } from "react";
import useFetcher from "../../../utils/useFetcher";
import Loading from "../../../components/messages/Loading";
import AsterButton from "../../../components/AsterButton";
import { CiEdit } from "react-icons/ci";
import "../users.css";

export default function Scientists() {
  const [scientists, setScientists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { fetcher } = useFetcher(error, setError);

  useEffect(() => {
    fetcher({
      url: "scientists",
      onSuccess: (data) => {
        setScientists(data);
      },
    }).finally(() => setLoading(false));
  }, []);

  const TableHeader = () => {
    return (
      <div className="table-row">
        <div>
          <h3>Name</h3>
        </div>
        <div>
          <h3>Email</h3>
        </div>
        <div style={{ flex: 2 }}>
          <h3>Editions</h3>
        </div>
        <div style={{ flex: 1 / 3 }}>
          <h3>Actions</h3>
        </div>
      </div>
    );
  };

  const Table = () => {
    if (scientists.length === 0) {
      return <p>No scientists found.</p>;
    }
    return (
      <div className="table">
        <TableHeader />
        {scientists.map((scientist) => (
          <div key={scientist?.id} className="table-row">
            <text>
              {scientist?.name} {scientist?.surname}
            </text>
            <text>{scientist?.email}</text>
            <div style={{ flex: 2 }}>
              <ul>
                {scientist?.editions.map((edition) => (
                  <li>{edition?.name}</li>
                ))}
              </ul>
            </div>
            <div
              style={{
                flex: 1 / 3,
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              <CiEdit size={"2rem"} style={{ cursor: "pointer" }} />
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <>
        <h1>Scientists</h1>
        <Loading />
      </>
    );
  }

  return (
    <div>
      <h1>Scientists</h1>
      <Table />
      <AsterButton style={{ marginTop: "2rem" }}>
        Create invitation link
      </AsterButton>
    </div>
  );
}
