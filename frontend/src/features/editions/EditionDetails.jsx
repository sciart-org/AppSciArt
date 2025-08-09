import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import useFetcher from "../../utils/useFetcher";
import Loading from "../../components/messages/Loading";
import logoCatalog from "../../assets/logoCatalog.png";
import Carousel from "../home/components/Carousel";
import Seed from "../../components/sciartProducts/Seed";
import Flower from "../../components/sciartProducts/Flower";
import Fruit from "../../components/sciartProducts/Fruit";
import AsterButton from "../../components/AsterButton";
import "./css/edition-details.css";

export default function EditionDetails() {
  const params = useParams();
  const [error, setError] = useState(null);
  const [edition, setEdition] = useState(null);
  const [loading, setLoading] = useState(true);

  const { fetcher } = useFetcher(error, setError);
  const navigate = useNavigate();

  const fetchEdition = async () => {
    await fetcher({
      url: `editions/${params.editionId}`,
      onSuccess: (data) => {
        setEdition(data);
      },
    }).finally(() => {
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchEdition();
  }, []);

  if (loading) {
    return <Loading />;
  }

  const EditionDescription = () => {
    return (
      <div className="edition-details-container">
        <div className="edition-logo-container">
          <img className="edition-logo" src={edition?.logo} />
          {edition?.catalogLink && (
            <div style={{ textAlign: "center", flex: 1 }}>
              <h2 style={{ marginBottom: 0 }}>
                Interested in the whole story?
              </h2>
              <p style={{ margin: 0 }}>Check it in our</p>
              <div
                className="catalog-logo-container"
                onClick={() => window.open(edition?.catalogLink, "_blank")}
              >
                <img className="catalog-logo" src={logoCatalog} />
              </div>
            </div>
          )}
        </div>
        <p className="long-text">{edition?.longDescription}</p>
      </div>
    );
  };

  return (
    <div>
      <h1>{edition?.name}</h1>
      <EditionDescription />
      {edition?.fruits?.length > 0 && (
        <>
          <hr />
          <div>
            <h2>Take a look at what we achieved!</h2>
            <Carousel
              small={true}
              allItems={edition?.fruits?.map((f) => {
                return { id: f.id, image: f.mainImage, text: f.title };
              })}
              onClickIem={(o) => navigate(`/fruits/${o.id}`)}
            />
          </div>
        </>
      )}
      <hr />
      <h2>Explore all collections</h2>
      <div className="edition-collections-container">
        <AsterButton to={`/collections/seeds?editionId=${edition?.id}`}>
          <Seed style={{ width: "10rem" }} />
          <p>Seeds</p>
        </AsterButton>
        <AsterButton to={`/collections/flowers?editionId=${edition?.id}`}>
          <Flower style={{ width: "10rem" }} />
          <p>Flowers</p>
        </AsterButton>
        <AsterButton to={`/collections/fruits?editionId=${edition?.id}`}>
          <Fruit style={{ width: "10rem" }} />
          <p>Fruits</p>
        </AsterButton>
      </div>
    </div>
  );
}
