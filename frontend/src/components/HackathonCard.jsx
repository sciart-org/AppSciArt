import AsterButton from "./AsterButton";
import "./HackathonCard.css";

export default function HackathonCard(props) {
  var options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const hackathon = props.hackathon;

  const parseType = (type) => {
    return type.charAt(0) + type.slice(1).toLowerCase().replace("_", " ");
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
            {hackathon?.startDate.toLocaleDateString("en-US", options)}
            {" - "}
            {hackathon?.endDate.toLocaleDateString("en-US", options)}
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
          <AsterButton style={{ width: "45%" }}>
            <text>Join this hackathon!</text>
          </AsterButton>
        </div>
      </div>
    </div>
  );
}
