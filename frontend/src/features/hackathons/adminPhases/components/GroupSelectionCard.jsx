import AsterButton from "../../../../components/buttons/AsterButton";

export default function GroupSelectionCard({
  group,
  presentingGroup,
  viewingGroup,
  onView = () => {},
  onChangePresenting = () => {},
}) {
  const isPresenting = presentingGroup === group.number;
  const isViewing = viewingGroup === group.number;

  return (
    <div
      key={group.id}
      onClick={onView}
      style={{
        padding: "0.5rem 1rem",
        cursor: "pointer",
        backgroundColor: isViewing ? "#f0f0f0" : "transparent",
        borderLeft: isPresenting ? "3px solid black" : "3px solid transparent",
        marginBottom: "0.25rem",
      }}
    >
      <p
        style={{
          margin: 0,
          fontWeight: isPresenting ? "bold" : "normal",
        }}
      >
        Group {group.number}
      </p>
      <p
        style={{
          fontSize: "0.75rem",
          margin: "0 0 0.4rem",
          color: "#666",
        }}
      >
        {group.seedTitle}
      </p>
      {isPresenting ? (
        <AsterButton
          style={{
            fontSize: "0.8rem",
            background: "#222",
            color: "#fff",
            width: "auto",
            height: "2rem",
            paddingBlock: 0,
            cursor: "default",
          }}
        >
          ▶ Now presenting
        </AsterButton>
      ) : (
        <AsterButton
          onClick={onChangePresenting}
          style={{
            fontSize: "0.8rem",
            width: "auto",
            height: "2rem",
            paddingBlock: 0,
          }}
        >
          Set as presenting
        </AsterButton>
      )}
    </div>
  );
}
