import React from "react";
import FormInput from "../../../components/form/FormInput.jsx";
import FormSelect from "../../../components/form/FormSelect.jsx";
import AsterButton from "../../../components/buttons/AsterButton.jsx";

export default function JoinForm(props) {
  const { onSubmit, formData, setFormData, showButton } = props;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="register-form">
      <div
        className="input-box-container"
        style={{ width: "70vw", gap: "5rem" }}
      >
        <FormSelect
          name={"What roles could you take on during the hackathon?"}
          options={["Artist", "Technologist", "Scientist", "Other"]}
          value={formData.roles}
          setValue={(v) => {
            setFormData({ ...formData, roles: v });
          }}
          required={true}
          multiple={true}
          placeholder={"Select roles..."}
          style={{ alignItems: "center", flex: 1 }}
        />
        <FormInput
          name={"Why are you interested in this hackathon?"}
          type={"text"}
          value={formData.interests || ""}
          onChange={(e) =>
            setFormData({ ...formData, interests: e.target.value })
          }
          placeholder={"Interests..."}
          multiline={true}
          style={{ alignItems: "center", flex: 1 }}
        />
      </div>
      {showButton && (
        <AsterButton type="submit" style={{ width: "10rem" }}>
          <text>Join</text>
        </AsterButton>
      )}
    </form>
  );
}
