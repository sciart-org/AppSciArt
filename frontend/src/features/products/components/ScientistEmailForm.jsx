import FormInput from "../../../components/form/FormInput";
import { validateEmail } from "../../../utils/commonUtils";

export default function ScientistEmailForm({
  submissionBody,
  setSubmissionBody,
  style,
}) {
  const handleChange = (attribute, e) => {
    const { _, value } = e.target;
    setSubmissionBody({ ...submissionBody, [attribute]: value });
  };

  return (
    <div>
      <FormInput
        name={"Add scientist email"}
        placeholder={"Enter scientist email"}
        value={submissionBody.addingEmail}
        onChange={(e) => handleChange("addingEmail", e)}
        style={style}
      />
      <text
        style={{
          cursor: "pointer",
          marginTop: "1.5rem",
          maxWidth: "3rem",
        }}
        onClick={() => {
          if (!submissionBody.addingEmail) return;
          if (!validateEmail(submissionBody.addingEmail)) {
            window.alert("Invalid email format");
            return;
          }
          setSubmissionBody({
            ...submissionBody,
            scientistsToInvite: Array.from(
              new Set([
                ...submissionBody.scientistsToInvite,
                submissionBody.addingEmail,
              ]),
            ),
            addingEmail: "",
          });
        }}
      >
        Add
      </text>
    </div>
  );
}
