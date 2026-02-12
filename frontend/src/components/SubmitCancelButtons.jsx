import AsterButton from "./AsterButton";

export default function SubmitCancelButtons({ submitText = "Submit" }) {
  return (
    <div
      style={{
        marginTop: "1rem",
        gap: "5rem",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <AsterButton type="submit">{submitText}</AsterButton>
      <AsterButton type="secondary" to={-1}>
        Cancel
      </AsterButton>
    </div>
  );
}
