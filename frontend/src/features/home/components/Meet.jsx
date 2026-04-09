import AsterButton from "../../../components/buttons/AsterButton";
import meetSvg from "../../../assets/meet.svg";
import { HackathonContext } from "../../hackathons/components/HackathonContext";
import { useContext } from "react";

export default function Meet() {
  const { hackathon } = useContext(HackathonContext);

  if (!hackathon.meetLink) {
    return <></>;
  }

  const MeetButton = () => {
    return (
      <AsterButton onClick={() => window.open(hackathon.meetLink, "_blank")}>
        <img
          src={meetSvg}
          style={{ width: "15rem", height: "15rem", margin: "auto" }}
        />
      </AsterButton>
    );
  };

  return (
    <>
      <h3>Join the meeting here</h3>
      <MeetButton />
    </>
  );
}
