import AsterButton from "../../components/AsterButton.jsx";
import HackathonCard from "../../components/HackathonCard.jsx";
import SciArtProducts from "../../components/sciartProducts/SciArtProducts.jsx";
import QuickRegisterBar from "./components/QuickRegisterBar.jsx";
import { useEffect, useState } from "react";
import useFetcher from "../../utils/useFetcher.js";
import tokenService from "../../utils/token.service.js";
import InspiringScientist from "../../components/roles/InspiringScientist.jsx";
import Participant from "../../components/roles/Participant.jsx";

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

function NextEvent() {
  const [error, setError] = useState(null);
  const { fetcher } = useFetcher(error, setError);
  const [hackathon, setHackathon] = useState(null);

  useEffect(() => {
    fetcher({
      url: "hackathons?filter=closest",
      onSuccess: (data) => {
        setHackathon(data);
      },
    });
  }, []);

  if (!hackathon) {
    return <></>;
  }

  return (
    <div style={{ justifyItems: "center", display: "inline-block" }}>
      <h2 style={{ textAlign: "start" }}>Next event</h2>
      <HackathonCard hackathon={hackathon} />
    </div>
  );
}

export default function Home() {
  const jwt = tokenService.getLocalAccessToken();
  return (
    <>
      <h1 style={{ marginTop: 0 }}>This is SciArt</h1>
      <SciArtProducts fixed={true} />
      <Roles />
      <hr />
      <MoreInfoSection />
      {!jwt && (
        <>
          <hr />
          <QuickRegisterBar />
        </>
      )}
      <NextEvent />
    </>
  );
}
