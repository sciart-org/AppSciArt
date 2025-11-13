import { useEffect } from "react";
import "./Modal.css";

export default function Modal(props) {
  useEffect(() => {
    if (props.openCondition) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [props.openCondition]);

  if (!props.openCondition) {
    return <></>;
  }
  return (
    <div className="modal">
      <dialog open>{props.children}</dialog>
    </div>
  );
}
