import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { useEffect, useRef, useState } from "react";
import { CiCircleQuestion } from "react-icons/ci";

export default function ParticipantCard({
  participant,
  seedId,
  onToggleGroupVoice,
}) {
  const ref = useRef(null);
  const [dragging, setDragging] = useState(false);

  const [tooltipPos, setTooltipPos] = useState(null);
  const hintRef = useRef(null);

  const handleMouseEnter = () => {
    const rect = hintRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    setTooltipPos({
      position: "fixed",
      top: spaceBelow > 80 ? rect.bottom + 6 : rect.top - 6 - 80,
      right: window.innerWidth - rect.right,
    });
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return draggable({
      element: el,
      getInitialData: () => ({ type: "participant", participant }),
      onDragStart: () => setDragging(true),
      onDrop: () => setDragging(false),
    });
  }, [participant]);

  return (
    <p
      ref={ref}
      className="group-box-item"
      style={{ opacity: dragging ? 0.4 : 1, cursor: "grab" }}
    >
      {participant.userProfile.name} {participant.userProfile.surname}
      {participant.roles ? " — " + participant.roles.join(", ") : null}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          marginLeft: "auto",
        }}
      >
        {!participant.hasConfirmedAssistance && (
          <span
            ref={hintRef}
            style={{ position: "relative" }}
            className="participant-card-hint"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={() => setTooltipPos(null)}
          >
            <CiCircleQuestion size={"1.5rem"} style={{ display: "block" }} />
            {tooltipPos && (
              <span
                className="participant-card-hint__tooltip"
                style={{
                  display: "block",
                  position: "fixed",
                  top: tooltipPos.top,
                  right: tooltipPos.right,
                }}
              >
                Assistance not confirmed. Go to previous stage to modify this.
              </span>
            )}
          </span>
        )}
        {onToggleGroupVoice && (
          <label
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
              cursor: "pointer",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="checkbox"
              checked={!!participant.isGroupVoice}
              onChange={() => onToggleGroupVoice(participant)}
            />
          </label>
        )}
      </div>
    </p>
  );
}
