import AsterButton from "../../../../components/buttons/AsterButton";

export default function DeliverButton({
  isVisible,
  itemToSubmit,
  style,
  onClick,
}) {
  if (isVisible) {
    return <></>;
  }

  return (
    <AsterButton style={style} onClick={onClick}>
      Deliver {itemToSubmit.toLowerCase()}
    </AsterButton>
  );
}
