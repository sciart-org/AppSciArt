import React, { useState } from "react";
import tokenService from "../../../utils/token.service";
import FormInput from "../../../components/form/FormInput.jsx";
import FormSelect from "../../../components/form/FormSelect.jsx";
import AsterButton from "../../../components/AsterButton.jsx";

export default function JoinForm(props) {
  const { onSubmit } = props;
  const jwt = tokenService.getLocalAccessToken();

  const [formData, setFormData] = useState({
    roles: null,
    interests: null,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <form onSubmit={handleSubmit} className="register-form">
      <div className="input-box-container" style={{ width: "70vw" }}>
        <FormSelect
          name={"What roles could you take on during the hackathon?"}
          options={["Artist", "Technologist", "Scientist", "Others"]}
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
          value={formData.password}
          onChange={handleInputChange}
          placeholder={"Interests..."}
          multiline={true}
          style={{ alignItems: "center", flex: 1 }}
        />
      </div>
      <AsterButton type="submit" style={{ width: "10vw" }}>
        <text>Join</text>
      </AsterButton>
    </form>
  );
}
