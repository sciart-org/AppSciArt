import { EditionActionButton } from "../features/editions/components/EditionActionButton";
import tokenService from "../utils/token.service";
import AdminEditButton from "./AdminEditButton";
import AsterButton from "./AsterButton";
import "./Card.css";
import ImageRenderer from "./ImageRenderer";

export default function EditionCard(props) {
  const edition = props.edition;
  const isPublished = edition?.state === "PUBLISHED";
  const forceNotAdmin = props.forceNotAdmin || false;

  const isAdmin = !forceNotAdmin && tokenService.getIsAdmin();

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
        <AdminEditButton entityName="edition" entity={edition} />
        {!isAdmin && (
          <AsterButton to={`/editions/${edition?.id}`}>Know more</AsterButton>
        )}
      </div>
    </div>
  );
}
