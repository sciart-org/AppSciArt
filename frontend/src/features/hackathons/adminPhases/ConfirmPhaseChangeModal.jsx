import AsterButton from "../../../components/buttons/AsterButton";
import Modal from "../../../components/Modal";

export default function ConfirmPhaseChangeModal({
  openCondition,
  onConfirm,
  onCancel,
  children,
}) {
  return (
    <Modal openCondition={openCondition}>
      <h3 style={{ textAlign: "center" }}>
        Are you sure you want to continue to the next phase?
      </h3>
      {children ?? (
        <p>All participants will be redirected to the next phase.</p>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "1rem",
        }}
      >
        <AsterButton onClick={onConfirm}>Confirm</AsterButton>
        <AsterButton variant="secondary" onClick={onCancel}>
          Cancel
        </AsterButton>
      </div>
    </Modal>
  );
}
