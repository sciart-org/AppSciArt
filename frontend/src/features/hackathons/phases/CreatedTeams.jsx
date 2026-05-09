import { useContext, useEffect, useState } from "react";
import ParticipantList from "../components/ParticipantList";
import AsterButton from "../../../components/buttons/AsterButton";
import "./phases.css";
import SeedResources from "../../products/components/SeedResources";
import { DiagramGallery } from "../components/diagramming/DiagramGallery";
import CreationProcessHeader from "../../../components/CreationProcessHeader";
import { HackathonContext } from "../components/HackathonContext";
import RenderUrl from "../../../components/RenderUrl";

export default function CreatedTeams() {
  const { hackathon, participation } = useContext(HackathonContext);

  const isPhaseActive = hackathon?.phase === "TEAM_WORK";

  const [justEntered, setJustEntered] = useState(true);
  const [showMap, setShowMap] = useState(false);

  const seed = participation?.teamFlower?.seed;

  if (!isPhaseActive) {
    return <h2>This phase is not active</h2>;
  }

  if (justEntered) {
    return (
      <>
        <h2 style={{ whiteSpace: "pre-line" }}>
          You will be assigned a team based on you ratings!
          {"\n"}These will be as interdisciplinary as possible.
        </h2>
        <h3
          style={{
            marginBottom: "1rem",
            marginTop: "2rem",
            whiteSpace: "pre-line",
          }}
        >
          Co-creation teams have been created!
          {"\n"}Your team will help this seed flourish:
        </h3>
        <h3 style={{ marginBlock: 0 }}>{seed?.title}</h3>
        <ParticipantList
          participants={participation?.teamMembers}
          participantStyle={{ margin: "2vw 4vw 0 4vw", width: "6vw" }}
          gridNumber={5}
          style={{
            width: "75%",
            margin: "auto",
            justifyContent: "center",
          }}
        />
        <AsterButton
          style={{ marginTop: "2rem" }}
          onClick={() => {
            setJustEntered(false);
          }}
        >
          <p>Enter co-creation team</p>
        </AsterButton>
      </>
    );
  }

  return (
    <div>
      <CreationProcessHeader
        members={participation?.teamMembers}
        scientists={seed?.authors}
      >
        Co-creation team
      </CreationProcessHeader>
      <RenderUrl
        url={participation?.teamFlower?.template}
        style={{
          height: "90vh",
          border: "solid 1px rgba(191, 191, 191, 255)",
          borderRadius: "1rem",
          marginTop: "1rem",
          width: "90vw",
        }}
      />
      <h3>Additional information</h3>
      <p>Seed: {seed?.title}</p>
      <SeedResources seed={seed} isHorizontal includePdf />
      <AsterButton
        onClick={() => setShowMap(!showMap)}
        style={{ margin: "1rem", width: "10rem" }}
      >
        {showMap ? "Hide" : "Show"} maps
      </AsterButton>
      <DiagramGallery
        showMap={showMap}
        seedId={participation?.teamFlower?.seed?.id}
      />
    </div>
  );
}
