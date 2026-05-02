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
  const total = participants?.length || 0;
  const totalPages = Math.ceil(total / gridNumber);
  const showingParticipants = participants?.slice(
    page * gridNumber,
    (page + 1) * gridNumber,
  );
  const showButtons = total > gridNumber;

  const actualGrid = Math.min(gridNumber, showingParticipants?.length || 0);

  return (
    <div
      style={{ display: "flex", alignItems: "center", gap: "0.5rem", ...style }}
    >
      {showButtons && (
        <button onClick={() => setPage((p) => p - 1)} disabled={page === 0}>
          {"<"}
        </button>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${actualGrid}, 1fr)`,
          gap: "0.5rem",
          flex: 1,
        }}
      >
        {showingParticipants?.map((m) => (
          <div
            key={m.id}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              minWidth: 0,
            }}
          >
            <Participant style={participantStyle} className={className} />
            <p
              style={{
                fontSize: fontSize || "clamp(0.6rem, 1.2vw, 0.85rem)",
                marginBlock: "0.25rem 0",
                width: "100%",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                paddingInline: "0.25rem",
              }}
            >
              {m.name} {m.surname}
            </p>
            {isGroup && m?.isGroupVoice && (
              <span className="manage-groups-voice-badge">Group voice</span>
            )}
            {!isGroup && m?.isTeamSpeaker && (
              <span className="manage-groups-voice-badge">Team speaker</span>
            )}
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
