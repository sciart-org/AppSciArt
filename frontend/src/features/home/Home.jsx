import Carousel from "./components/Carousel.jsx";
import AsterButton from "../../components/AsterButton.jsx";
import HackathonCard from "../../components/HackathonCard.jsx";
import InspiringScientist from "./components/InspiringScientist.jsx";
import Participant from "./components/Participant.jsx";
import SciArtProducts from "../../components/sciartProducts/SciArtProducts.jsx";
import "./css/Home.css";
import hackathonLogo from "../../assets/mockHackathonLogo.jpg";
import { useState } from "react";

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

function Roles() {
  return (
    <div className="roles-container">
      <div>
        <InspiringScientist />
        <h3>Inspiring Scientists</h3>
      </div>
      <div>
        <Participant />
        <h3>Participants</h3>
      </div>
    </div>
  );
}

function MoreInfoSection() {
  return (
    <>
      <h2>Want to dive deeper into the process?</h2>
      <div>
        <AsterButton to={"/about-the-hackathon"}>
          <text>Find all the details here</text>
        </AsterButton>
      </div>
    </>
  );
}

function QuickRegisterSection() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [successfullySent, setSuccessfullySent] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  const handleInputChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = () => {
    if (email === "") {
      setError("Please, provide an email address");
      return;
    }
    fetch(`${API_URL}/register?method=quick`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (!data.error) {
          setEmail("");
          setError(null);
          setSuccessfullySent(true);
        } else {
          setSuccessfullySent(false);
          setError(data.error);
        }
      })
      .catch((error) => setError(error));
  };

  return (
    <div>
      <h2>
        Do you want to participate and create science-inspired art,
        collaborating with minds from diverse disciplines to bring innovative
        ideas to life?
      </h2>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <input
          placeholder="Enter your email here..."
          type={"text"}
          style={{ width: "30rem", padding: "0.5rem" }}
          value={email}
          onChange={handleInputChange}
        />
        <AsterButton
          style={{ marginLeft: "1rem", width: "9rem" }}
          onClick={handleSubmit}
        >
          <text>Join now!</text>
        </AsterButton>
      </div>
      <div>
        {error === null && successfullySent ? (
          <>
            <p style={{ marginBlockEnd: "0.5em" }}>
              Pre-registered successfully!
            </p>
            <p style={{ marginBlock: 0 }}>
              Check your inbox for the next steps
            </p>
          </>
        ) : (
          <text style={{ color: "red" }}>{error}</text>
        )}
      </div>
    </div>
  );
}

function NextEvent() {
  return (
    <div style={{ justifyItems: "center", display: "inline-block" }}>
      <h2 style={{ textAlign: "start" }}>Next event</h2>
      <HackathonCard hackathon={mockHackathon} />
    </div>
  );
}

export default function Home() {
  return (
    <div>
      <Carousel />
      <h1 style={{ marginTop: 0 }}>This is SciArt</h1>
      <SciArtProducts fixed={true} />
      <Roles />
      <hr />
      <MoreInfoSection />
      <hr />
      <QuickRegisterSection />
      <NextEvent />
    </div>
  );
}
