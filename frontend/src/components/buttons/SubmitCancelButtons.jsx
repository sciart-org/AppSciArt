import { useNavigate } from "react-router";
import AsterButton from "./AsterButton";
import "./SubmitCancelButtons.css";

export default function SubmitCancelButtons({
  submitText = "Submit",
  onCancel,
}) {
  return (
    <div className="buttons-container">
      <AsterButton type="submit">{submitText}</AsterButton>
      <AsterButton type="secondary" onClick={onCancel} to={-1}>
        Cancel
      </AsterButton>
    </div>
  );
}
