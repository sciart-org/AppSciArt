import React, { useState } from "react";
import tokenService from "../../utils/token.service";
import AsterButton from "../../components/AsterButton";

export default function Register() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [error, setError] = useState(null);
  const jwt = "test";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    surname: "",
    gender: "",
    birthDate: "",
  });

  const signUpProvider = ({ provider }) => {
    fetch(`${API_URL}/register?provider=${provider}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      }
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        window.location.href = data.url;
      })
      .catch((error) => console.error("Error creating user:", error));
  }

  const signUp = ({ method }) => {
    fetch(`${API_URL}/register?method=${method}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(formData)
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (!data.error) {
          setFormData({
            email: "",
            password: "",
            name: "",
            surname: "",
            gender: "",
            birthDate: "",
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
  }

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
      <div style={{ flex: 1, padding: "10vh" }}>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column" }}
        >
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="surname"
            placeholder="Surname"
            value={formData.surname}
            onChange={handleInputChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          <textarea
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <textarea
            name="gender"
            placeholder="Gender"
            value={formData.gender}
            onChange={handleInputChange}
            required
          />
          <input
            type="date"
            name="birthDate"
            placeholder="Birth date"
            value={formData.birthDate}
            onChange={handleInputChange}
            required
          />
          <button type="submit">Register!</button>
        </form>
        <AsterButton onClick={() => {
          signUpProvider({ provider: "google" });
        }}>
          Sign up with Google
        </AsterButton>
      </div>
    </div>
  );
}
