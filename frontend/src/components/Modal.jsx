import { useEffect } from "react";
import "./Modal.css";

export default function Modal(props) {
  useEffect(() => {
    const body = document.body;

    if (props.openCondition) {
      const scrollBarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      body.style.overflow = "hidden";
      body.style.paddingRight = `${scrollBarWidth}px`;
    } else {
      body.style.overflow = "";
      body.style.paddingRight = "";
    }

    return () => {
      body.style.overflow = "";
      body.style.paddingRight = "";
    };
  }, [props.openCondition]);

  if (!props.openCondition) return null;

  return (
    <div className="modal">
      <dialog open>{props.children}</dialog>
    </div>
  );
}
