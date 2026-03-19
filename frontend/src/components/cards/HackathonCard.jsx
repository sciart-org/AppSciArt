import { Link } from "react-router";
import tokenService from "../../utils/token.service";
import AsterButton from "../buttons/AsterButton";
import "./Card.css";
import ImageRenderer from "../ImageRenderer";
import AdminEditButton from "../buttons/AdminEditButton";
import { formatReadableDate, parseEnumValue } from "../../utils/commonUtils";

export default function HackathonCard({ hackathon, hideButton, ...props }) {
  const jwt = tokenService.getLocalAccessToken();
  const forceNotAdmin = props.forceNotAdmin || false;

  const isAdmin = !forceNotAdmin && tokenService.getIsAdmin();

  if (!hackathon) {
    return <></>;
  }

  const JoinButton = () => {
    if (hackathon?.isEnrolled) {
      return <p>You are already enrolled to this hackathon!</p>;
    }

    if (hideButton) {
      return <></>;
    }

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
        }}
      >
        <AsterButton to={`/hackathons/${hackathon.id}/join`} disabled={!jwt}>
          <text>Join this hackathon!</text>
        </AsterButton>
        {!jwt && (
          <Link
            to={"/signin"}
            style={{ marginTop: "-1vh", marginBottom: "1vh" }}
          >
            Log in
          </Link>
        )}
      </div>
    );
  };

  return (
    <div className="card" style={{ ...props.style }}>
      <ImageRenderer image={hackathon?.logo} />
      <div>
        <div style={{ width: "100%" }}>
          <h3>When?</h3>
          <text>
            {formatReadableDate(hackathon?.startDate)}
            {" - "}
            {formatReadableDate(hackathon?.endDate)}
          </text>
          <h3>Where?</h3>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <text>{parseEnumValue(hackathon?.type)}</text>
            <text>{hackathon?.location}</text>
          </div>
          <div style={{ marginTop: "3vh" }}>
            <text>{hackathon?.description}</text>
          </div>
        </div>
        {isAdmin ? (
          <AdminEditButton entityName="hackathons" entity={hackathon} />
        ) : (
          <JoinButton />
        )}
      </div>
    </div>
  );
}
