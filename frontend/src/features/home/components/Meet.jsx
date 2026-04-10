import meetSvg from "../../../assets/meet.svg";
import AsterButton from "../../../components/buttons/AsterButton";
import { HackathonContext } from "../../hackathons/components/HackathonContext";
import { useContext } from "react";
import "../css/Meet.css";

export default function Meet() {
  const { hackathon } = useContext(HackathonContext);

  if (!hackathon.meetLink) return null;

  return (
    <>
      <AsterButton
        className="meet-button"
        onClick={() => window.open(hackathon.meetLink, "_blank")}
      >
        <img src={meetSvg} className="meet-button__icon" alt="Google Meet" />
        <span>Join with Google Meet</span>
      </AsterButton>
    </>
  );
}
