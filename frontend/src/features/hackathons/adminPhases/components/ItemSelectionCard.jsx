import AsterButton from "../../../../components/buttons/AsterButton";

export default function ItemSelectionCard({
  itemName,
  itemTitle,
  itemNumber,
  presentingItem,
  viewingItem,
  onView = () => {},
  onChangePresenting = () => {},
}) {
  const isPresenting = presentingItem === itemNumber;
  const isViewing = viewingItem === itemNumber;

  return (
    <div
      key={itemNumber}
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
        {itemName} {itemNumber}
      </p>
      <p
        style={{
          fontSize: "0.75rem",
          margin: "0 0 0.4rem",
          color: "#666",
        }}
      >
        {itemTitle}
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
