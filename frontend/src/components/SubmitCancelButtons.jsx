import AsterButton from "./AsterButton";

export default function SubmitCancelButtons() {
  return (
    <div
      style={{
        marginTop: "1rem",
        gap: "5rem",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <AsterButton type="submit">Submit</AsterButton>
      <AsterButton type="secondary" to={-1}>
        Cancel
      </AsterButton>
    </div>
  );
}
