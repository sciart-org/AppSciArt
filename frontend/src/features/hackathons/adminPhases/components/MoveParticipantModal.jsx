import AsterButton from "../../../../components/buttons/AsterButton";
import Modal from "../../../../components/Modal";

export default function MoveParticipantModal({
  changingParticipant,
  onConfirm,
  onCancel,
  changingSeedTitle,
  aggregationName,
  aggregationNumber,
}) {
  const lowerCaseName = aggregationName.toLowerCase();

  return (
    <Modal openCondition={!!changingParticipant}>
      <h3 style={{ textAlign: "center" }}>Are you sure?</h3>
      <p>
        {`${changingParticipant?.participant?.userProfile?.name} ${changingParticipant?.participant?.userProfile?.surname} `}
        is already in a {lowerCaseName}.
        {changingParticipant?.seedId
          ? " Do you want to move them to:"
          : ` Do you want to remove them from their current ${lowerCaseName}?`}
      </p>
      {changingParticipant?.seedId && (
        <p>
          {`${aggregationName} ${aggregationNumber} — ${changingSeedTitle}?`}
        </p>
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
