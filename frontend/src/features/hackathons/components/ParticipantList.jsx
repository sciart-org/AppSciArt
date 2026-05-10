import { useState } from "react";
import Participant from "../../../components/roles/Participant";
import "./ParticipantList.css";

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
    <div className="participant-list-parent" style={style}>
      <button
        onClick={() => setPage((p) => p - 1)}
        disabled={page === 0}
        style={{ visibility: showButtons ? "visible" : "hidden" }}
        className="participant-list-button"
      >
        {"<"}
      </button>

      <div
        className="participant-list-container"
        style={{
          gridTemplateColumns: `repeat(${actualGridNumber}, 8vw)`,
        }}
      >
        {showingParticipants?.map((m) => (
          <div key={m.id} className="participant-container">
            <Participant style={participantStyle} className={className} />
            <p
              style={{ fontSize: fontSize || "clamp(0.6rem, 1.2vw, 0.85rem)" }}
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
        className="participant-list-button"
      >
        {">"}
      </button>
    </div>
  );
}
