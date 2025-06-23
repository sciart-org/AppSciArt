import React, { useContext, useState } from "react";
import Providers from "./components/Providers";
import RegistrationForm from "./components/RegistrationForm.jsx";
import { RegistrationContext } from "./context/RegistrationContext.jsx";
import tokenService from "../../utils/token.service.js";

export default function Register() {
  const API_URL = import.meta.env.VITE_API_URL;

  const { refreshSession, setJustRegistered } = useContext(RegistrationContext);

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

  const itemsToLowerCase = (list) => {
    if (list === null) return null;
    return list.map((v) => v.toLowerCase());
  };

  const signUp = () => {
    fetch(`${API_URL}/register?method=direct`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formData,
        gender: formData.gender.toLowerCase(),
        affiliations: itemsToLowerCase(formData.affiliations),
        areasOfInterest: itemsToLowerCase(formData.areasOfInterest),
      }),
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
          refreshSession();
          setJustRegistered(true);
        } else {
          setError(data.error);
        }
      })
      .catch((error) => setError(error));
  };

  return (
    <div>
      <h1>Register now</h1>
      <div>{error && <p style={{ color: "red" }}>{error}</p>}</div>
      <div style={{ flex: 1 }}>
        <RegistrationForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={signUp}
        />
        <Providers />
      </div>
    </div>
  );
}
