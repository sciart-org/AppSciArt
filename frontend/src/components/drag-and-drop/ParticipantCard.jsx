import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { useEffect, useRef, useState } from "react";
import HintIcon from "../messages/HintIcon";

export default function ParticipantCard({
  participant,
  isAssigned = false,
  checkboxValue = false,
  onToggleCheckbox = () => {},
}) {
  const ref = useRef(null);
  const [dragging, setDragging] = useState(false);

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
          <HintIcon message="Assistance not confirmed. Go to previous stage to modify this." />
        )}
        {isAssigned && onToggleCheckbox && (
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
              checked={checkboxValue}
              onChange={() => onToggleCheckbox(participant)}
            />
          </label>
        )}
      </div>
    </p>
  );
}
