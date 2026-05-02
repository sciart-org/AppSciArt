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
  const actualGridNumber = total < gridNumber ? total : gridNumber;
  const totalPages = Math.ceil(total / actualGridNumber);
  const showingParticipants = participants?.slice(
    page * actualGridNumber,
    (page + 1) * actualGridNumber,
  );
  const showButtons = total > actualGridNumber;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
        ...style,
      }}
    >
      <button
        onClick={() => setPage((p) => p - 1)}
        disabled={page === 0}
        style={{ visibility: showButtons ? "visible" : "hidden" }}
      >
        {"<"}
      </button>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${actualGridNumber}, 8vw)`,
          gap: "1rem",
          width: "auto",
          justifyContent: "center",
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
            }}
          >
            <Participant style={participantStyle} className={className} />
            <p
              style={{
                fontSize: fontSize || "clamp(0.6rem, 1.2vw, 0.85rem)",
                marginBlock: "0.25rem 0",
                width: "100%",
                wordBreak: "break-word",
                paddingInline: "0.25rem",
                marginBottom: "0.5rem",
              }}
            >
              {m.name} {m.surname}
            </p>
            <span
              className="manage-groups-voice-badge"
              style={{
                visibility: (isGroup ? m?.isGroupVoice : m?.isTeamSpeaker)
                  ? "visible"
                  : "hidden",
              }}
            >
              {isGroup ? "Group voice" : "Team speaker"}
            </span>
          </div>
        ))}
      </div>

      <button
        onClick={() => setPage((p) => p + 1)}
        disabled={page === totalPages - 1}
        style={{ visibility: showButtons ? "visible" : "hidden" }}
      >
        {">"}
      </button>
    </div>
  );
}
