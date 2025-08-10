import GoogleMaps from "../components/GoogleMaps";

export default function HackathonAccess({ hackathon, localTime }) {
  const OnSitePlace = () => {
    return (
      <>
        <h3>We will be waiting for you at {localTime} in:</h3>
        <GoogleMaps location={hackathon.location} />
        <p>{hackathon.location}</p>
      </>
    );
  };

  const OnlineMeeting = () => {
    return (
      <>
        <h3>The hackathon will start online at {localTime}</h3>
      </>
    );
  };

  const HybridHackathon = () => {
    return (
      <>
        <OnSitePlace />
        <h3>Or you can join us online</h3>
      </>
    );
  };

  if (hackathon.type === "ON_SITE") {
    return <OnSitePlace />;
  }
  if (hackathon.type === "ONLINE") {
    return <OnlineMeeting />;
  }
  return <HybridHackathon />;
}
