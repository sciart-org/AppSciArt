import { useState } from "react";
import Participant from "../../../components/roles/Participant";

export default function ParticipantList({
  participants,
  participantStyle,
  fontSize,
  className,
  gridNumber = 4,
  isGroup,
  style,
}) {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil((participants?.length || 0) / gridNumber);
  const current = participants?.slice(
    page * gridNumber,
    (page + 1) * gridNumber,
  );
  const showButtons = (participants?.length || 0) > gridNumber;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        ...style,
      }}
    >
      {showButtons && (
        <button onClick={() => setPage((p) => p - 1)} disabled={page === 0}>
          {"<"}
        </button>
      )}
      <div style={{ display: "flex", justifyContent: "center", flex: 1 }}>
        {current?.map((m) => (
          <div key={m.id} style={{ textAlign: "center" }}>
            <Participant style={participantStyle} className={className} />
            <p style={{ fontSize: fontSize || "1rem", marginBottom: 0 }}>
              {m.name} {m.surname}
            </p>
            <p style={{ fontSize: fontSize || "1rem", marginTop: 0 }}>
              {isGroup && m?.isGroupVoice && <>(Group voice)</>}
              {!isGroup && m?.isTeamSpeaker && <>(Team speaker)</>}
            </p>
          </div>
        ))}
      </div>
      {showButtons && (
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={page === totalPages - 1}
        >
          {">"}
        </button>
      )}
    </div>
  );
}
