import mockHackathonLogo from "../assets/mockHackathonLogo.png";
import AsterButton from "./AsterButton";
import "./HackathonCard.css";

export default function HackathonCard(props) {
  var options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const mockHackathon = {
    id: 1,
    date: new Date(),
    logo: mockHackathonLogo,
    isOnline: false,
    shortDescription:
      "Explore the boundaries of art and science around the brain and cognition, developing new ways to understand the human mind",
    location:
      "Escuela Técnica Superior de Ingeniería Informática de la Universidad de Sevilla (Av. Reina Mercedes s/n, 41012 Sevilla, Spain)",
  };
  return (
    <div className="hackathon-card">
      <div>
        <img src={mockHackathon.logo} />
      </div>
      <div>
        <div>
          <h3>When?</h3>
          <text>{mockHackathon.date.toLocaleDateString("en-US", options)}</text>
          <h3>Where?</h3>
          <text>{mockHackathon.location}</text>
        </div>
        <div>
          <AsterButton>
            <text>Join this hackathon!</text>
          </AsterButton>
        </div>
      </div>
    </div>
  );
}
