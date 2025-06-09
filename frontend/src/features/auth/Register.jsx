import React, { useState } from "react";
import tokenService from "../../utils/token.service";
import AsterButton from "../../components/AsterButton";
import "./auth.css";
import FormInput from "./components/FormInput";
import FormSelect from "./components/FormSelect";
import Providers from "./components/Providers";

export default function Register() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    email: null,
    password: null,
    name: null,
    surname: null,
    gender: null,
    ageRange: null,
    affiliations: null,
    areasOfInterest: null,
  });

  const signUp = ({ method }) => {
    fetch(`${API_URL}/register?method=${method}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (!data.error) {
          setFormData({
            email: null,
            password: null,
            name: null,
            surname: null,
            gender: null,
            birthDate: null,
          });
          setError(null);
          tokenService.updateLocalAccessToken(data.jwt);
          tokenService.setUser(data);
          window.location.href = "/";
        } else {
          setError(data.error);
        }
      })
      .catch((error) => setError(error));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    signUp({ method: "complete" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div style={{ flex: 1, height: "100%" }}>
      <h1>Register now</h1>
      <div>{error && <p style={{ color: "red" }}>{error}</p>}</div>
      <div style={{ flex: 1 }}>
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
        <Providers />
      </div>
    </div>
  );
}
