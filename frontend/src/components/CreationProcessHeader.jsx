import ParticipantList from "../features/hackathons/components/ParticipantList";
import PhaseTitle from "../features/hackathons/components/PhaseTitle";

export default function CreationProcessHeader({
  members,
  scientists,
  children,
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div style={{ flex: 1, marginTop: "1vw" }}>
        <ParticipantList
          participants={members || []}
          fontSize={"1vw"}
          className={"participant-icon"}
        />
      </div>
      <PhaseTitle>{children}</PhaseTitle>
      <div style={{ flex: 1, marginTop: "1vw" }}>
        <ParticipantList
          participants={scientists || []}
          fontSize={"1vw"}
          className={"participant-icon"}
        />
      </div>
    </div>
  );
}
