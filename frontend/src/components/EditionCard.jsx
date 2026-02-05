import { EditionActionButton } from "../features/editions/components/EditionActionButton";
import tokenService from "../utils/token.service";
import AsterButton from "./AsterButton";
import "./Card.css";
import ImageRenderer from "./ImageRenderer";

export default function EditionCard(props) {
  const edition = props.edition;
  const isPublished = edition?.state === "PUBLISHED";
  const user = tokenService.getUser();
  const forceNotAdmin = props.forceNotAdmin || false;

  const isAdmin = !forceNotAdmin && user?.roles.includes("administrator");

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
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              width: "100%",
            }}
          >
            <AsterButton
              to={`/editions/${edition?.id}`}
              style={{ width: "15rem" }}
            >
              Edit
            </AsterButton>
            <EditionActionButton style={{ width: "15rem" }} edition={edition} />
          </div>
        ) : (
          <AsterButton to={`/editions/${edition?.id}`}>Know more</AsterButton>
        )}
      </div>
    </div>
  );
}
