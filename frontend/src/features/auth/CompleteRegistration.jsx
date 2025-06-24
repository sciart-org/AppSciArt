import React, { useContext, useState } from "react";
import RegistrationForm from "./components/RegistrationForm.jsx";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { RegistrationContext } from "./context/RegistrationContext.jsx";
import tokenService from "../../utils/token.service.js";
import { useEffect } from "react";

export default function CompleteRegistration(props) {
  const params = useParams();
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  const { refreshSession, setJustRegistered } = useContext(RegistrationContext);

  const [loading, setLoading] = useState(true);
  const [emailToRegister, setEmailToRegister] = useState(null);
  const [isProvider, setIsProvider] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    email: emailToRegister,
    password: null,
    name: null,
    surname: null,
    gender: null,
    ageRange: null,
    affiliations: null,
    areasOfInterest: null,
  });

  useEffect(() => {
    fetch(`${API_URL}/early-signups/${params.earlySignupId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setEmailToRegister(data.email);
        setIsProvider(data.isProvider);
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setFormData({ ...formData, email: emailToRegister });
  }, [emailToRegister]);

  function valid(email) {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  }

  const itemsToLowerCase = (list) => {
    if (list === null) return null;
    return list.map((v) => v.toLowerCase());
  };

  const signUp = () => {
    fetch(`${API_URL}/register/complete`, {
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
            email: emailToRegister,
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
          navigate("/signup");
        } else {
          setError(data.error);
        }
      })
      .catch((error) => setError(error));
  };

  if (loading)
    return (
      <div style={{ height: "100%", alignContent: "center" }}>
        <p>Loading...</p>
      </div>
    );

  if (emailToRegister === null || !valid(emailToRegister)) {
    return (
      <div style={{ height: "100%", alignContent: "center" }}>
        <p>No email found to complete your registration.</p>
        <p>Please, check your inbox to finish setting up your profile.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Complete your profile</h1>
      <div>{error && <p style={{ color: "red" }}>{error}</p>}</div>
      <RegistrationForm
        formData={formData}
        setFormData={setFormData}
        onSubmit={signUp}
        hasEmail={emailToRegister !== null}
        isProvider={isProvider}
      />
    </div>
  );
}
