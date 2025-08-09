import { useState } from "react";
import { useParams } from "react-router";
import useFetcher from "../../utils/useFetcher";
import Loading from "../../components/messages/Loading";
import { useEffect } from "react";
import logoCatalog from "../../assets/logoCatalog.png";
import "./css/edition-details.css";
import Carousel from "../home/components/Carousel";

export default function EditionDetails() {
  const params = useParams();
  const [error, setError] = useState(null);
  const [edition, setEdition] = useState(null);
  const [loading, setLoading] = useState(true);

  const { fetcher } = useFetcher(error, setError);

  const fetchEdition = async () => {
    await fetcher({
      url: `editions/${params.editionId}`,
      onSuccess: (data) => {
        setEdition(data);
        console.log(data);
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
          )}{" "}
        </div>
        <p className="long-text">{edition?.longDescription}</p>
      </div>
    );
  };

  return (
    <div>
      <h1>{edition?.name}</h1>
      <EditionDescription />
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
    </div>
  );
}
