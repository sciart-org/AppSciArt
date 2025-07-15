import { useEffect, useState } from "react";
import { useParams } from "react-router";
import HackathonCard from "../../components/HackathonCard.jsx";
import JoinForm from "./components/JoinForm.jsx";
import HackathonDescription from "./components/HackathonDescription.jsx";
import AsterButton from "../../components/AsterButton.jsx";
import JoinSuccess from "./components/JoinSuccess.jsx";
import useFetcher from "../../utils/useFetcher.js";
import { itemsToUpperCase } from "../../utils/commonUtils.js";
import Loading from "../../components/messages/Loading.jsx";

export default function JoinHackathon() {
  const [loading, setLoading] = useState(true);
  const [hackathon, setHackathon] = useState(null);
  const [error, setError] = useState(null);
  const [joined, setJoined] = useState(false);
  const [formData, setFormData] = useState({
    roles: null,
    interests: null,
  });

  const { fetcher } = useFetcher(error, setError);
  const params = useParams();

  useEffect(() => {
    fetcher({
      url: `hackathons/${params.hackathonId}`,
      onSuccess: (data) => {
        setHackathon(data);
      },
    }).finally(() => setLoading(false));
  }, []);

  const joinHackathon = () => {
    fetcher({
      url: `hackathons/${params.hackathonId}/participants/me`,
      method: "POST",
      body: {
        ...formData,
        roles: itemsToUpperCase(formData.roles),
      },
      onSuccess: () => {
        setJoined(true);
        setFormData({
          roles: null,
          interests: null,
        });
      },
    });
  };

  if (loading) {
    return <Loading />;
  }

  if (hackathon?.isEnrolled) {
    return (
      <div style={{ height: "100%", alignContent: "center" }}>
        <p>You are already enrolled to this hackathon</p>
        <AsterButton to={"/hackathons"}>Go back</AsterButton>
      </div>
    );
  }

  if (!hackathon || hackathon === undefined) {
    return (
      <div style={{ height: "100%", alignContent: "center" }}>
        <p>Could not find the specified hackathon</p>
      </div>
    );
  }

  if (joined) {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    return <JoinSuccess />;
  }

  return (
    <div>
      <h2>You are joining:</h2>
      <h1>{hackathon.editionName}</h1>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <HackathonCard
          hackathon={hackathon}
          style={{ border: "none" }}
          hideButton={true}
        />
        <HackathonDescription hackathon={hackathon} />
      </div>
      <h2>Join now!</h2>
      <JoinForm
        formData={formData}
        setFormData={setFormData}
        onSubmit={joinHackathon}
        showButton={!joined}
      />
      <div>{joined && <p>You joined successfully!</p>}</div>
    </div>
  );
}
