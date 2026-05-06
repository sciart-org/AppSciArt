import AsterButton from "../../../../components/buttons/AsterButton";
import Modal from "../../../../components/Modal";

export default function MoveParticipantModal({
  changingParticipant,
  onConfirm,
  onCancel,
  changingSeedTitle,
}) {
  return (
    <Modal openCondition={!!changingParticipant}>
      <h3 style={{ textAlign: "center" }}>Are you sure?</h3>
      <p>
        {`${changingParticipant?.participant?.userProfile?.name} ${changingParticipant?.participant?.userProfile?.surname} `}
        is already in a group.
        {changingParticipant?.seedId
          ? " Do you want to move them to:"
          : " Do you want to remove them from their current group?"}
      </p>
      {changingParticipant?.seedId && (
        <p>
          {`Group ${changingParticipant?.group?.number} — ${changingSeedTitle}?`}
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
