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
      <ParticipantList
        participants={members || []}
        fontSize={"1vw"}
        gridNumber={3}
        className={"participant-icon"}
        style={{ flex: 1, marginTop: "1vw", paddingInline: "2rem" }}
      />
      <PhaseTitle>{children}</PhaseTitle>
      <ParticipantList
        participants={scientists || []}
        fontSize={"1vw"}
        className={"participant-icon"}
        style={{ flex: 1, marginTop: "1vw", paddingInline: "2rem" }}
      />
    </div>
  );
}
