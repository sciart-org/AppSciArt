import tokenService from "../../utils/token.service";
import AdminEditButton from "../buttons/AdminEditButton";
import AsterButton from "../buttons/AsterButton";
import "./Card.css";
import ImageRenderer from "../ImageRenderer";
import { parseEnumValue } from "../../utils/commonUtils";
import logoFlowerBlack from "../../assets/logoFlowerBlack.png";

export default function EditionCard(props) {
  const edition = props.edition;
  const isPublished = edition?.state === "PUBLISHED";
  const forceNotAdmin = props.forceNotAdmin || false;

  const isAdmin = !forceNotAdmin && tokenService.getIsAdmin();

  const includeAutoHeight = isPublished ? {} : { height: "auto" };

  return (
    <div className="card" style={{ ...props.style, ...includeAutoHeight }}>
      <div style={includeAutoHeight}>
        <ImageRenderer
          image={edition?.logo}
          placeholder={logoFlowerBlack}
          width={"15rem"}
        />
      </div>
      <div style={includeAutoHeight}>
        <div
          style={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            flex: 1,
            width: "90%",
          }}
        >
          <h2 style={{ marginBottom: 0 }}>{edition?.name}</h2>
          <div className="card__meta">
            <h3 style={{ marginTop: 0, marginBottom: 0 }}>{edition?.year}</h3>
            {isAdmin && (
              <span className={`badge badge--${edition?.state?.toLowerCase()}`}>
                {parseEnumValue(edition?.state)}
              </span>
            )}
          </div>
          <p className="long-text" style={{ margin: "auto" }}>
            {edition?.shortDescription}
          </p>
        </div>
        {isAdmin ? (
          <AdminEditButton entityName="editions" entity={edition} />
        ) : (
          <AsterButton to={`/editions/${edition?.id}`}>Know more</AsterButton>
        )}
      </div>
    </div>
  );
}
