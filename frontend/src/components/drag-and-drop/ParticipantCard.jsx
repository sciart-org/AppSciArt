import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { useEffect, useRef, useState } from "react";
import HintIcon from "../messages/HintIcon";
import CollapsibleButton from "../buttons/CollapsibleButton";
import useCollapsible from "../../utils/useCollapsible";
import CollapsibleWrapper from "../buttons/CollapsibleWrapper";
import "./ParticipantCard.css";

export default function ParticipantCard({
  participant,
  isAssigned = false,
  checkboxValue = false,
  onToggleCheckbox = () => {},
  children,
  style,
}) {
  const ref = useRef(null);
  const [dragging, setDragging] = useState(false);
  const { collapsed, toggle } = useCollapsible();

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

  const styleWithChildren =
    children && !collapsed
      ? {
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          marginBottom: 0,
        }
      : {};

  return (
    <div style={{ padding: "1rem 1rem 0 1rem", ...style }}>
      <div
        ref={ref}
        className="group-box-item"
        style={{
          opacity: dragging ? 0.4 : 1,
          cursor: "grab",
          ...styleWithChildren,
        }}
      >
        {participant.userProfile.name} {participant.userProfile.surname}
        {participant.roles ? " — " + participant.roles.join(", ") : null}
        <div className="participant-icons-container">
          {!participant.hasConfirmedAssistance && (
            <HintIcon message="Assistance not confirmed. Go to previous stage to modify this." />
          )}
          {isAssigned && onToggleCheckbox && (
            <label className="" onClick={(e) => e.stopPropagation()}>
              <input
                type="checkbox"
                checked={checkboxValue}
                onChange={() => onToggleCheckbox(participant)}
              />
            </label>
          )}
          {children && (
            <CollapsibleButton collapsed={collapsed} toggle={toggle} />
          )}
        </div>
      </div>
      {children && (
        <CollapsibleWrapper collapsed={collapsed}>
          <div className="group-box-item participant-card-children">
            {children}
          </div>
        </CollapsibleWrapper>
      )}
    </div>
  );
}
