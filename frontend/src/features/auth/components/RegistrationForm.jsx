import React, { useState } from "react";
import FormInput from "./FormInput";
import FormSelect from "./FormSelect";
import AsterButton from "../../../components/AsterButton";

export default function RegistrationForm(props) {
  const email = props.email || null;
  const [formData, setFormData] = useState({
    email: email ? email : null,
    password: null,
    name: null,
    surname: null,
    gender: null,
    ageRange: null,
    affiliations: null,
    areasOfInterest: null,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    signUp({ method: "complete" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <form onSubmit={handleSubmit} className="register-form">
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
        <FormInput
          name={"Email"}
          type={"text"}
          value={formData.email}
          onChange={handleInputChange}
          required={true}
          disabled={email !== null}
        />
        <FormInput
          name={"Password"}
          type={"password"}
          value={formData.password}
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
      <AsterButton type="submit" style={{ width: "10vw" }}>
        <text>Register</text>
      </AsterButton>
    </form>
  );
}
