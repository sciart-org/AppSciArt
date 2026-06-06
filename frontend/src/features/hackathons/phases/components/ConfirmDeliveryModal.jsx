import AsterButton from "../../../../components/buttons/AsterButton";
import Modal from "../../../../components/Modal";

export default function ConfirmDeliveryModal({
  openCondition,
  itemToSubmit,
  onDeliver,
  onCancel,
  children = undefined,
}) {
  const itemLowerCase = itemToSubmit.toLowerCase();
  return (
    <Modal openCondition={openCondition}>
      <h3>Submit {itemLowerCase}</h3>
      <p>
        Are you sure you want to submit your {itemLowerCase}? {"\n"} This cannot
        be undone
      </p>
      {children}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        <AsterButton onClick={onDeliver}>Submit</AsterButton>
        <AsterButton onClick={onCancel}>Cancel</AsterButton>
      </div>
    </Modal>
  );
}
