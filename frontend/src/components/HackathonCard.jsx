import tokenService from "../utils/token.service";
import AsterButton from "./AsterButton";
import "./HackathonCard.css";

export default function HackathonCard(props) {
  const jwt = tokenService.getLocalAccessToken();

  var options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const hackathon = props.hackathon;
  const hideButton = props.hideButton;

  const parseType = (type) => {
    return type?.charAt(0) + type?.slice(1).toLowerCase().replace("_", " ");
  };

  return (
    <div className="hackathon-card" style={{ ...props.style }}>
      <div>
        <img src={hackathon?.logo} />
      </div>
      <div>
        <div style={{ width: "100%" }}>
          <h3>When?</h3>
          <text>
            {new Date(hackathon?.startDate).toLocaleDateString(
              "en-US",
              options
            )}
            {" - "}
            {new Date(hackathon?.endDate).toLocaleDateString("en-US", options)}
          </text>
          <h3>Where?</h3>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <text>{parseType(hackathon?.type)}</text>
            <text>{hackathon?.location}</text>
          </div>
          <div style={{ marginTop: "3vh" }}>
            <text>{hackathon?.description}</text>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          {!hideButton && hackathon.isEnrolled ? (
            <p>You are already enrolled to this hackathon!</p>
          ) : (
            <AsterButton
              to={jwt ? `/hackathons/${hackathon.id}/join` : undefined}
              disabled={!jwt}
            >
              <text>Join this hackathon!</text>
            </AsterButton>
          )}
        </div>
      </div>
    </div>
  );
}
