import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { useEffect, useRef, useState } from "react";

export default function ParticipantCard({ participant }) {
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
    </p>
  );
}
