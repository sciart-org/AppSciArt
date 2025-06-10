import { useEffect, useState } from "react";
import HackathonCard from "../../components/HackathonCard";
import hackathonLogo from "../../assets/mockHackathonLogo.jpg";

const hackathonMockData = [
  {
    editionName: "GreenTech Berlin 2025",
    logo: hackathonLogo,
    startDate: new Date("2025-08-01"),
    endDate: new Date("2025-08-03"),
    type: "ON_SITE",
    location:
      "University of Arts Linz, Hauptplatz 8, Lecture Theater, 4th Floor (Altenberger Str. 69, 4040 Linz, Austria)",
    description: "A climate-focused hackathon driving green innovation.",
    isVisible: true,
    meetLink: null,
  },
  {
    editionName: "GreenTech Berlin 2025",
    logo: hackathonLogo,
    startDate: new Date("2025-09-15"),
    endDate: new Date("2025-09-17"),
    type: "ONLINE",
    location: "Virtual",
    description: "An online event exploring AI in biology.",
    isVisible: true,
    meetLink: "https://meet.example.com/biohack2025",
  },
  {
    editionName: "GreenTech Berlin 2025",
    logo: hackathonLogo,
    startDate: new Date("2025-10-10"),
    endDate: new Date("2025-10-12"),
    type: "HYBRID",
    location: "Paris, France / Online",
    description: "Reimagining the future of education through tech.",
    isVisible: false,
    meetLink: "https://meet.example.com/eduhack",
  },
  {
    editionName: "AgriTech Africa 2025",
    logo: hackathonLogo,
    startDate: new Date("2025-07-20"),
    endDate: new Date("2025-07-22"),
    type: "ON_SITE",
    location: "Nairobi, Kenya",
    description: "Building agri-tech solutions for local communities.",
    isVisible: true,
    meetLink: null,
  },
  {
    editionName: "HealthHack Virtual 2025",
    logo: hackathonLogo,
    startDate: new Date("2025-11-01"),
    endDate: new Date("2025-11-03"),
    type: "ONLINE",
    location: "Virtual",
    description: "Innovating digital health tools and platforms.",
    isVisible: false,
    meetLink: "https://meet.example.com/healthhack",
  },
];

export default function Hackathons() {
  const fetchHackathons = () => hackathonMockData;

  const [hackathons, setHackathons] = useState([]);

  const hackathonsByEdition = hackathons.reduce(
    (groupedHackathons, hackathon) => {
      if (!groupedHackathons[hackathon.editionName]) {
        groupedHackathons[hackathon.editionName] = [];
      }
      groupedHackathons[hackathon.editionName].push(hackathon);
      return groupedHackathons;
    },
    {}
  );

  useEffect(() => {
    const hackathons = fetchHackathons();
    setHackathons(hackathons);
  }, []);

  return (
    <div style={{ flex: 1, height: "100%" }}>
      <h1>Next hackathons</h1>
      {Object.entries(hackathonsByEdition).map(([editionName, hackathons]) => (
        <>
          <h2
            style={{ textAlign: "start", justifySelf: "center", width: "70vw" }}
          >
            {editionName.toUpperCase()}
          </h2>
          {hackathons.map((h) => (
            <HackathonCard hackathon={h} style={{ marginBottom: "5vh" }} />
          ))}
        </>
      ))}
    </div>
  );
}
