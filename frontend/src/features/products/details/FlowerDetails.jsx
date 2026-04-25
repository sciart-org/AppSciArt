import { useEffect, useState } from "react";
import { useParams } from "react-router";
import useFetcher from "../../../utils/useFetcher";
import Loading from "../../../components/messages/Loading";
import AsterButton from "../../../components/buttons/AsterButton";
import Seed from "../../../components/sciartProducts/Seed";

import "./details.css";

export default function FlowerDetails() {
  const params = useParams();
  const [error, setError] = useState(null);
  const [flower, setFlower] = useState(null);
  const [loading, setLoading] = useState(true);

  const { fetcher } = useFetcher(error, setError);

  const fetchFlower = async () => {
    await fetcher({
      url: `flowers/${params.flowerId}`,
      onSuccess: (data) => {
        setFlower(data);
        console.log(data);
      },
    }).finally(() => {
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchFlower();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <h1 style={{ width: "70vw", marginInline: "auto" }}>{flower?.title}</h1>
      <div className="flower-details-container">
        <img src={flower?.mainImage} />
        <h3>Authors</h3>
        <ul>
          {flower?.authors?.map((a) => {
            return <li>{a?.name + " " + a?.surname}</li>;
          })}
        </ul>
        <h3>Inspiring Scientists</h3>
        <ul>
          {flower?.seed?.authors?.map((a) => {
            return <li>{a?.name + " " + a?.surname}</li>;
          })}
        </ul>
        {flower?.conceptualMap && (
          <>
            <h2>Conceptual map</h2>
            <img src={flower?.conceptualMap} />
          </>
        )}
        {flower?.concept && (
          <>
            <h2>Flower concept</h2>
            <p className="long-text">{flower?.concept}</p>
          </>
        )}
      </div>
      <hr style={{ width: "70vw" }} />
      <h2>More about this flower</h2>
      <div className="product-buttons-container">
        <AsterButton to={`/seeds/${flower?.seed?.id}`}>
          <div className="button-container">
            <Seed className="seed" />
            <div>
              <p>See seed</p>
              <p>"{flower?.seed?.title}"</p>
            </div>
          </div>
        </AsterButton>
      </div>
    </div>
  );
}
