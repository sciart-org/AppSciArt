import AsterButton from "../../components/AsterButton";
import HackathonAccess from "./components/HackathonAccess";

export default function ParticipantHome({ hackathon }) {
  const date = new Date(hackathon.startDate);
  const rawDays = new Date() - date;
  const days = rawDays / (1000 * 60 * 60 * 24);

  const localHours = date.getHours();
  const localTime = (localHours % 12 || 12) + (localHours >= 12 ? "pm" : "am");

  return (
    <div className="participant-home">
      <h1>The day has arrived!</h1>
      <h2>
        {hackathon.editionName} - Day {Math.ceil(days)}
      </h2>
      <HackathonAccess hackathon={hackathon} localTime={localTime} />
      <AsterButton
        onClick={() => window.open(`hackathons/${hackathon.id}`, "_blank")}
      >
        Click here when you are ready
      </AsterButton>
    </div>
  );
}
