import React, { useState } from "react";
import tokenService from "../../utils/token.service";
import Providers from "./components/Providers";
import AsterButton from "../../components/AsterButton";
import FormInput from "../../components/form/FormInput";

export default function Login() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${API_URL}/login`, {
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
            email: "",
            password: "",
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div>
      <h1>Log in now</h1>
      <div>{error && <p style={{ color: "red" }}>{error}</p>}</div>
      <div style={{ flex: 1 }}>
        <form onSubmit={handleSubmit} className="register-form">
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
          <AsterButton type="submit" style={{ width: "10rem" }}>
            <text>Log in</text>
          </AsterButton>
        </form>
        <Providers />
      </div>
    </div>
  );
}
