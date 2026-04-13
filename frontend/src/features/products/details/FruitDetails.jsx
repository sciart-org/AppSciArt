import { useEffect, useState } from "react";
import { useParams } from "react-router";
import useFetcher from "../../../utils/useFetcher";
import Loading from "../../../components/messages/Loading";
import AsterButton from "../../../components/buttons/AsterButton";
import Seed from "../../../components/sciartProducts/Seed";
import Flower from "../../../components/sciartProducts/Flower";

import "./css/details.css";

export default function FruitDetails() {
  const params = useParams();
  const [error, setError] = useState(null);
  const [fruit, setFruit] = useState(null);
  const [loading, setLoading] = useState(true);

  const { fetcher } = useFetcher(error, setError);

  const fetchFruit = async () => {
    await fetcher({
      url: `fruits/${params.fruitId}`,
      onSuccess: (data) => {
        setFruit(data);
      },
    }).finally(() => {
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchFruit();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <h1 style={{ width: "70vw", marginInline: "auto" }}>{fruit?.title}</h1>
      <div className="fruit-details-container">
        <img src={fruit?.mainImage} />
        <h3>Authors</h3>
        <ul>
          {fruit?.authors?.map((a) => {
            return <li>{a?.name + " " + a?.surname}</li>;
          })}
        </ul>
        <h3>Inspiring Scientists</h3>
        <ul>
          {fruit?.seed?.authors?.map((a) => {
            return <li>{a?.name + " " + a?.surname}</li>;
          })}
        </ul>
        {fruit?.seed?.description && (
          <>
            <h2>Scientific seed</h2>
            <p className="long-text">{fruit?.seed?.description}</p>
          </>
        )}
        {fruit?.authorVision && (
          <>
            <h2>Authors' vision</h2>
            <p className="long-text">{fruit?.authorVision}</p>
          </>
        )}
        {fruit?.curatorVision && (
          <>
            <h2>Curator's vision</h2>
            <p className="long-text">{fruit?.curatorVision}</p>
          </>
        )}
      </div>
      <hr style={{ width: "70vw" }} />
      <h2>More about this fruit</h2>
      <div className="product-buttons-container">
        <AsterButton to={`/seeds/${fruit?.seed?.id}`}>
          <div className="button-container">
            <Seed className="seed" />
            <div>
              <p>See seed</p>
              <p>"{fruit?.seed?.title}"</p>
            </div>
          </div>
        </AsterButton>
        <AsterButton to={`/flowers/${fruit?.flower?.id}`}>
          <div className="button-container">
            <Flower className="seed" />
            <div>
              <p>See flower</p>
              <p>"{fruit?.flower?.title}"</p>
            </div>
          </div>
        </AsterButton>
      </div>
    </div>
  );
}
