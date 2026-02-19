import AsterButton from "./AsterButton";
import "./SubmitCancelButtons.css";

export default function SubmitCancelButtons({ submitText = "Submit" }) {
  return (
    <div className="buttons-container">
      <AsterButton type="submit">{submitText}</AsterButton>
      <AsterButton type="secondary" to={-1}>
        Cancel
      </AsterButton>
    </div>
  );
}
