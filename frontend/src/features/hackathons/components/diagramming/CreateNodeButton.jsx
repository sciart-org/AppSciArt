import AsterButton from "../../../../components/AsterButton";

export default function CreateNodeButton(props) {
  return (
    <AsterButton onClick={props.onClick} className={"create-node-button"}>
      {props.children}
    </AsterButton>
  );
}
