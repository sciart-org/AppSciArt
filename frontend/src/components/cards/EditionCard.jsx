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
  const forceNotStaff = props.forceNotStaff || false;

  const isStaff = !forceNotStaff && tokenService.getIsStaff();

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
            {isStaff && (
              <span className={`badge badge--${edition?.state?.toLowerCase()}`}>
                {parseEnumValue(edition?.state)}
              </span>
            )}
          </div>
          <p className="justified-text" style={{ margin: "auto" }}>
            {edition?.shortDescription}
          </p>
        </div>
        {isStaff ? (
          <AdminEditButton entityName="editions" entity={edition} />
        ) : (
          <AsterButton to={`/editions/${edition?.id}`}>Know more</AsterButton>
        )}
      </div>
    </div>
  );
}
