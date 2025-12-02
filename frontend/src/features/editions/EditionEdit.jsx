import { CiEdit } from "react-icons/ci";
import EditionCollectionButtons from "./components/EditionCollectionButtons";
import "./css/edition-details.css";

export default function EditionEdit({ edition }) {
  const EditorWrapper = ({ children, field, title }) => {
    return (
      <div className="edition-wrapper">
        <div style={{ flex: 1, marginLeft: "2rem", textAlign: "start" }}>
          <h3>{title}</h3>
          {field ? children : <p>No content yet</p>}
        </div>
        <CiEdit size={"2rem"} style={{ flex: "1 1 1", margin: "0 2rem" }} />
      </div>
    );
  };

  return (
    <div>
      <h1>{edition?.name}</h1>
      <div
        className="edition-details-container"
        style={{
          border: "1px solid rgb(200, 200, 200)",
          borderRadius: "1rem",
        }}
      >
        <EditorWrapper
          field={edition?.shortDescription}
          title={"Short description"}
        >
          <p className="long-text">{edition?.shortDescription}</p>
        </EditorWrapper>
        <EditorWrapper
          field={edition?.longDescription}
          title={"Long description"}
        >
          <p className="long-text">{edition?.longDescription}</p>
        </EditorWrapper>
        <EditorWrapper field={edition?.location} title={"Location"}>
          <p className="long-text">{edition?.location}</p>
        </EditorWrapper>
        <EditorWrapper field={edition?.location} title={"Catalog link"}>
          <p className="long-text">{edition?.location}</p>
        </EditorWrapper>
      </div>
      <hr />
      <EditionCollectionButtons editionId={edition?.id} />
    </div>
  );
}
