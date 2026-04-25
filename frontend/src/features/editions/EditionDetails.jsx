import { useNavigate } from "react-router";
import logoCatalog from "../../assets/logoCatalog.png";
import Carousel from "../home/components/Carousel";
import "./EditionDetails.css";
import EditionCollectionButtons from "./components/EditionCollectionButtons";
import ImageRenderer from "../../components/ImageRenderer";
import logoFlowerBlack from "../../assets/logoFlowerBlack.png";

export default function EditionDetails({ edition }) {
  const navigate = useNavigate();

  const EditionDescription = () => {
    return (
      <div className="edition-details-container">
        <div className="edition-logo-container">
          <ImageRenderer
            className="edition-logo"
            image={edition?.logo}
            placeholder={logoFlowerBlack}
          />
          {edition?.catalogLink && (
            <div style={{ textAlign: "center", marginLeft: "5rem" }}>
              <h2 style={{ marginBottom: 0 }}>
                Interested in the whole story?
              </h2>
              <p style={{ margin: 0 }}>Check it in our</p>
              <div
                className="catalog-logo-container"
                onClick={() => window.open(edition?.catalogLink, "_blank")}
              >
                <ImageRenderer
                  image={logoCatalog}
                  className="catalog-logo"
                  height={"auto"}
                  width={"20rem"}
                />
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
      <EditionCollectionButtons editionId={edition?.id} />
    </div>
  );
}
