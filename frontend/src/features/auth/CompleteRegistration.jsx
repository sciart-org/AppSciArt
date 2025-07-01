import React, { useContext, useState, useEffect } from "react";
import RegistrationForm from "./components/RegistrationForm.jsx";
import { useNavigate, useParams } from "react-router";
import { RegistrationContext } from "./context/RegistrationContext.jsx";
import tokenService from "../../utils/token.service.js";
import { jwtDecode } from "jwt-decode";
import useFetcher from "../../utils/useFetcher.js";

export default function CompleteRegistration() {
  const [loading, setLoading] = useState(true);
  const [emailToRegister, setEmailToRegister] = useState(null);
  const [isProvider, setIsProvider] = useState(false);
  const [error, setError] = useState(null);
  const initialFormData = {
    email: emailToRegister,
    password: null,
    name: null,
    surname: null,
    gender: null,
    ageRange: null,
    affiliations: null,
    areasOfInterest: null,
  };
  const [formData, setFormData] = useState(initialFormData);

  const params = useParams();
  const navigate = useNavigate();
  const { refreshSession, setJustRegistered } = useContext(RegistrationContext);
  const { fetcher } = useFetcher(error, setError);
  const jwt = tokenService.getLocalAccessToken();

  useEffect(() => {
    fetcher({
      url: `early-signups/${params.earlySignupId}`,
      onSuccess: (data) => {
        setEmailToRegister(data.email);
        setIsProvider(data.isProvider);
      },
    }).finally(() => setLoading(false));
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
    fetcher({
      url: "register/complete",
      method: "POST",
      body: {
        ...formData,
        gender: formData.gender?.toLowerCase(),
        affiliations: itemsToLowerCase(formData.affiliations),
        areasOfInterest: itemsToLowerCase(formData.areasOfInterest),
      },
      onSuccess: (data) => {
        setFormData(initialFormData);
        if (!isProvider) {
          tokenService.updateLocalAccessToken(data.jwt);
          tokenService.setUser(data);
        }
        refreshSession();
        setJustRegistered(true);
        navigate("/signup");
      },
    });
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

  if (jwt && emailToRegister !== jwtDecode(jwt).email) {
    return (
      <div style={{ height: "100%", alignContent: "center" }}>
        <p>This is not your email. Sign out to continue.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Complete your profile</h1>
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
