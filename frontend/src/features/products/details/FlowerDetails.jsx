import { useEffect, useState } from "react";
import { useParams } from "react-router";
import useFetcher from "../../../utils/useFetcher";
import Loading from "../../../components/messages/Loading";
import AsterButton from "../../../components/AsterButton";
import Seed from "../../../components/sciartProducts/Seed";

import "./css/details.css";

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
      <h1>{flower?.title}</h1>
      <div className="flower-details-container">
        <img src={flower?.mainImage} />
      </div>
      <hr style={{ width: "70vw" }} />
      <h2>More about this flower</h2>
      <div className="buttons-container">
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
