import tokenService from "../utils/token.service";
import AsterButton from "./AsterButton";
import "./Card.css";
import ImageRenderer from "./ImageRenderer";

const AdminEditionButtons = ({ edition }) => {
  const buttonStyle = { width: "15rem" };
  const ExtraButton = () => {
    switch (edition?.state) {
      case "PLANNED":
        return (
          <AsterButton
            style={buttonStyle}
            onClick={() => console.log("Announce")}
          >
            Announce
          </AsterButton>
        );

      case "ACTIVE":
        return (
          <AsterButton style={buttonStyle} onClick={() => console.log("Close")}>
            Close
          </AsterButton>
        );

      case "CLOSED":
        return (
          <AsterButton
            style={buttonStyle}
            onClick={() => console.log("Publish")}
          >
            Publish
          </AsterButton>
        );

      default:
        return null;
    }
  };
  return (
    <div
      style={{ display: "flex", justifyContent: "space-around", width: "100%" }}
    >
      <AsterButton to={`/editions/${edition?.id}`} style={buttonStyle}>
        Edit
      </AsterButton>
      <ExtraButton />
    </div>
  );
};
export default function EditionCard(props) {
  const edition = props.edition;
  const isPublished = edition?.state === "PUBLISHED";
  const user = tokenService.getUser();
  const isAdmin = user.roles.includes("administrator");

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
        {isAdmin ? (
          <AdminEditionButtons edition={edition} />
        ) : (
          <AsterButton to={`/editions/${edition?.id}`}>Know more</AsterButton>
        )}
      </div>
    </div>
  );
}
