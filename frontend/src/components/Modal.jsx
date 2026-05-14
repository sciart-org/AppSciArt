import useScrollLock from "../utils/useScrollLock";
import "./Modal.css";

export default function Modal(props) {
  useScrollLock(props.openCondition);

  if (!props.openCondition) return null;

  return (
    <div className="modal">
      <dialog open>{props.children}</dialog>
    </div>
  );
}
