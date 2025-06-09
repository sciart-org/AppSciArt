import React, { useState } from "react";
import tokenService from "../../utils/token.service";
import AsterButton from "../../components/AsterButton";
import { FaGoogle } from "react-icons/fa";
import "./auth.css";
import FormInput from "./components/FormInput";
import FormSelect from "./components/FormSelect";

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

  const signUpProvider = ({ provider }) => {
    fetch(`${API_URL}/register?provider=${provider}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        window.location.href = data.url;
      })
      .catch((error) => console.error("Error creating user:", error));
  };

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
      .catch((error) => console.error("Error creating user:", error));
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
                "None",
                "Other",
              ]}
              value={formData.affiliations}
              onChange={handleInputChange}
              required={false}
              multiple={true}
            />
            {JSON.stringify(formData.affiliations)}
            <FormSelect
              name={"Areas of Interest"}
              options={[]}
              value={formData.areasOfInterest}
              onChange={handleInputChange}
              required={false}
              multiple={true}
            />
          </div>
          <div className="input-box-container">
            <FormSelect
              name={"Gender"}
              options={["Male", "Female", "Other", "Prefer not to say"]}
              value={formData.gender}
              onChange={handleInputChange}
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
              onChange={handleInputChange}
              required={false}
              multiple={false}
            />
          </div>
          <AsterButton type="submit">
            <text>Register</text>
          </AsterButton>
        </form>
        <p>or</p>
        <FaGoogle
          className="sign-up-icon"
          style={{ borderColor: "#DB4437", color: "#DB4437" }}
          onClick={() => {
            signUpProvider({ provider: "google" });
          }}
        />
      </div>
    </div>
  );
}
