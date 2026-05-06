import { useState } from "react";
import { useRef } from "react";
import { CiCircleQuestion } from "react-icons/ci";

export default function HintIcon({ message }) {
  const hintRef = useRef(null);
  const [tooltipPos, setTooltipPos] = useState(null);

  const handleMouseEnter = () => {
    const rect = hintRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    setTooltipPos({
      position: "fixed",
      top: spaceBelow > 80 ? rect.bottom + 6 : rect.top - 6 - 80,
      right: window.innerWidth - rect.right,
    });
  };

  return (
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
          {message}
        </span>
      )}
    </span>
  );
}
