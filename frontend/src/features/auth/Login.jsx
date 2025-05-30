import React, { useState } from "react";
import tokenService from "../../utils/token.service";

export default function Login() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [error, setError] = useState(null);
  const jwt = "test";

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
        Authorization: `Bearer ${jwt}`,
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
      .catch((error) => console.error("Error logging in:", error));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div style={{ flex: 1, height: "100%" }}>
      <h1>Log in now</h1>
      <div>{error && <p style={{ color: "red" }}>{error}</p>}</div>
      <div style={{ flex: 1, padding: "10vh" }}>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column" }}
        >
          <textarea
            name="email"
            placeholder="Email"
            value={formData.email}
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
          <button type="submit">Log in!</button>
        </form>
      </div>
    </div>
  );
}
