import ParticipantList from "../features/hackathons/components/ParticipantList";
import PhaseTitle from "../features/hackathons/components/PhaseTitle";

export default function CreationProcessHeader({
  members,
  scientists,
  children,
  isGroup = false,
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
      }}
    >
      <div style={{ width: "30vw", marginTop: "1rem", marginLeft: "1rem" }}>
        <ParticipantList
          participants={members || []}
          gridNumber={3}
          className="participant-icon"
          isGroup={isGroup}
        />
      </div>

      <PhaseTitle style={{ flexShrink: 0 }}>{children}</PhaseTitle>

      <div style={{ width: "30vw", marginTop: "1rem", marginRight: "1rem" }}>
        <ParticipantList
          participants={scientists || []}
          gridNumber={3}
          className="participant-icon"
        />
      </div>
    </div>
  );
}
