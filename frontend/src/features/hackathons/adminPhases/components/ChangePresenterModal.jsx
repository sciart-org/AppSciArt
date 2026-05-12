import AsterButton from "../../../../components/buttons/AsterButton";
import Modal from "../../../../components/Modal";

export default function ChangePresenterModal({
  openCondition,
  itemName,
  itemNumber,
  onChange,
  onCancel,
}) {
  const itemNameLower = itemName.toLowerCase();
  return (
    <Modal openCondition={openCondition}>
      <h3>Change presenting {itemNameLower}</h3>
      <p>
        {itemName} {itemNumber} will be set as the presenting {itemNameLower}.
      </p>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "1rem",
        }}
      >
        <AsterButton onClick={onChange}>Confirm</AsterButton>
        <AsterButton variant="secondary" onClick={onCancel}>
          Cancel
        </AsterButton>
      </div>
    </Modal>
  );
}
