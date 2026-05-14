import AsterButton from "../../../../components/buttons/AsterButton";

export default function CreateNodeButton(props) {
  return (
    <AsterButton
      onClick={props.onClick}
      className={"create-node-button"}
      style={props.style}
    >
      {props.children}
    </AsterButton>
  );
}
