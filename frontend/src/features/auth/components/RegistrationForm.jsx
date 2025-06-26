import React from "react";
import AsterButton from "../../../components/AsterButton.jsx";
import FormInput from "../../../components/form/FormInput.jsx";
import FormSelect from "../../../components/form/FormSelect.jsx";

export default function RegistrationForm(props) {
  const { formData, setFormData, onSubmit, hasEmail, isProvider } = props;

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
      <div className="input-box-container">
        <FormInput
          name={"Email"}
          type={"text"}
          value={formData.email}
          onChange={hasEmail ? () => {} : handleInputChange}
          required={true}
          disabled={hasEmail}
        />
        <FormInput
          name={"Password"}
          type={"password"}
          value={formData.password}
          onChange={isProvider ? () => {} : handleInputChange}
          required={!isProvider}
          disabled={isProvider}
        />
      </div>
      <div className="input-box-container">
        <FormInput
          name={"Name"}
          type={"text"}
          value={formData.name}
          onChange={handleInputChange}
          required={true}
        />
        <FormInput
          name={"Surname"}
          type={"text"}
          value={formData.surname}
          onChange={handleInputChange}
          required={true}
        />
      </div>
      <div className="input-box-container">
        <FormSelect
          name={"Affiliations"}
          options={[
            "University",
            "Company",
            "Association",
            "Freelance",
            "Other",
          ]}
          value={formData.affiliations}
          setValue={(v) => {
            setFormData({ ...formData, affiliations: v });
          }}
          required={false}
          multiple={true}
        />
        <FormSelect
          name={"Areas of Interest"}
          options={[
            "Art",
            "Pure sciences",
            "Science applications",
            "IT",
            "Others",
          ]}
          value={formData.areasOfInterest}
          setValue={(v) => {
            setFormData({ ...formData, areasOfInterest: v });
          }}
          required={false}
          multiple={true}
        />
      </div>
      <div className="input-box-container">
        <FormSelect
          name={"Gender"}
          options={["Male", "Female", "Other", "Prefer not to say"]}
          value={formData.gender}
          setValue={(v) => {
            setFormData({ ...formData, gender: v });
          }}
          required={false}
          multiple={false}
        />
        <FormSelect
          name={"Age range"}
          options={[
            "17 or less",
            "18-24",
            "25-34",
            "35-44",
            "45-54",
            "55-64",
            "65 or more",
          ]}
          value={formData.ageRange}
          setValue={(v) => {
            setFormData({ ...formData, ageRange: v });
          }}
          required={false}
          multiple={false}
        />
      </div>
      <AsterButton type="submit" style={{ width: "10rem" }}>
        <text>Register</text>
      </AsterButton>
    </form>
  );
}
