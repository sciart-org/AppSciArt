import { useState } from "react";
import AsterButton from "../../components/buttons/AsterButton";
import { IoChevronBack } from "react-icons/io5";
import HackathonCard from "../../components/cards/HackathonCard";

import hackathonLogo from "../../assets/mockHackathonLogo.jpg";
import CompleteRegistration from "./CompleteRegistration";
import Register from "./Register";
import { RegistrationContext } from "./context/RegistrationContext";
import "./auth.css";
import ClickableText from "../../components/buttons/ClickableText";
import { scrollToTop } from "../../utils/commonUtils";

const mockHackathon = {
  editionName: "GreenTech Berlin 2025",
  logo: hackathonLogo,
  startDate: new Date("2025-08-01"),
  endDate: new Date("2025-08-03"),
  type: "ON_SITE",
  location:
    "University of Arts Linz, Hauptplatz 8, Lecture Theater, 4th Floor (Altenberger Str. 69, 4040 Linz, Austria)",
  description:
    "Explore the boundaries of art and science around the brain and cognition, developing new ways to understand the human mind",
  isVisible: true,
  meetLink: null,
};

export default function RegistrationEntry(props) {
  const { isCompleting, refreshSession, justRegistered, setJustRegistered } =
    props;
  const [maybeLater, setMaybeLater] = useState(false);

  if (justRegistered && maybeLater) {
    scrollToTop(0);
    return (
      <div>
        <h1>You registered successfully</h1>
        <h2>What now?</h2>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            margin: "10vh",
          }}
        >
          <div>
            <h3>Looking for past examples?</h3>
            <AsterButton to={"/editions"}>
              <text>Our editions</text>
            </AsterButton>
          </div>
          <div>
            <h3>Need more information?</h3>
            <AsterButton to={"/about-the-hackathon"}>
              <text>Our format</text>
            </AsterButton>
          </div>
        </div>
        <ClickableText onClick={() => setMaybeLater(false)}>
          <IoChevronBack size={"3.25vh"} />
          <text style={{ fontSize: "larger" }}>Join a hackathon</text>
        </ClickableText>
        <ClickableText onClick={() => (window.location.href = "/")}>
          Home
        </ClickableText>
      </div>
    );
  }

  if (justRegistered) {
    return (
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div>
          <h1>You registered successfully</h1>
          <h2>Join one of our next hackathons!</h2>
          <AsterButton to={"/about-the-hackathon"}>
            <text>What is a hackathon?</text>
          </AsterButton>
        </div>
        <HackathonCard style={{ margin: "5vh" }} hackathon={mockHackathon} />
        <text
          className="clickable-text"
          onClick={() => setMaybeLater(true)}
          style={{ marginTop: "auto" }}
        >
          Maybe later
        </text>
      </div>
    );
  }

  return (
    <RegistrationContext value={{ refreshSession, setJustRegistered }}>
      {isCompleting ? <CompleteRegistration /> : <Register />}
    </RegistrationContext>
  );
}
