import Carousel from "./components/Carousel.jsx";
import AsterButton from "../../components/AsterButton.jsx";
import HackathonCard from "../../components/HackathonCard.jsx";
import InspiringScientist from "./components/InspiringScientist.jsx";
import Participant from "./components/Participant.jsx";
import SciArtProducts from "../../components/sciartProducts/SciArtProducts.jsx";
import "./css/Home.css";
import hackathonLogo from "../../assets/mockHackathonLogo.jpg";

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
          style={{ width: "30vw", padding: "5px" }}
        />
        <AsterButton style={{ marginLeft: "1vw", width: "10vw" }}>
          <text>Join now!</text>
        </AsterButton>
      </div>
      <text>Check your inbox for the next steps</text>
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
      <SciArtProducts />
      <Roles />
      <hr />
      <MoreInfoSection />
      <hr />
      <QuickRegisterSection />
      <NextEvent />
    </div>
  );
}
