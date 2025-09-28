import "./Modal.css";

export default function Modal(props) {
  if (!props.openCondition) {
    return <></>;
  }
  return (
    <div className="modal">
      <dialog open>{props.children}</dialog>;
    </div>
  );
}
