import AsterButton from "./AsterButton";
import "./Card.css";
import ImageRenderer from "./ImageRenderer";

export default function EditionCard(props) {
  const edition = props.edition;
  const isPublished = edition?.state === "PUBLISHED";

  const includeAutoHeight = isPublished ? {} : { height: "auto" };

  return (
    <div className="card" style={{ ...props.style, ...includeAutoHeight }}>
      {edition?.logo && (
        <div style={includeAutoHeight}>
          <ImageRenderer image={edition?.logo} />
        </div>
      )}
      <div style={includeAutoHeight}>
        <div style={{ width: "100%", textAlign: "center" }}>
          <h2 style={{ marginBottom: 0 }}>{edition?.name}</h2>
          <h3 style={{ marginTop: 0 }}>{edition?.year}</h3>
          <p className="long-text">{edition?.shortDescription}</p>
        </div>
        <AsterButton to={`/editions/${edition?.id}`}>
          {isPublished ? "Know more" : "Edit"}
        </AsterButton>
      </div>
    </div>
  );
}
