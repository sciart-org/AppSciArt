import React, { useContext, useState } from "react";
import Providers from "./components/Providers";
import RegistrationForm from "./components/RegistrationForm.jsx";
import { RegistrationContext } from "./context/RegistrationContext.jsx";
import tokenService from "../../utils/token.service.js";
import useFetcher from "../../utils/useFetcher.js";

export default function Register() {
  const [error, setError] = useState(null);
  const initialFormData = {
    email: null,
    password: null,
    name: null,
    surname: null,
    gender: null,
    ageRange: null,
    affiliations: null,
    areasOfInterest: null,
  };
  const [formData, setFormData] = useState(initialFormData);

  const { fetcher } = useFetcher(error, setError);
  const { refreshSession, setJustRegistered } = useContext(RegistrationContext);

  const itemsToLowerCase = (list) => {
    if (list === null) return null;
    return list.map((v) => v.toLowerCase());
  };

  const signUp = () => {
    fetcher({
      url: "register?method=direct",
      method: "POST",
      body: {
        ...formData,
        gender: formData.gender?.toLowerCase(),
        affiliations: itemsToLowerCase(formData.affiliations),
        areasOfInterest: itemsToLowerCase(formData.areasOfInterest),
      },
      onSuccess: (data) => {
        setFormData(initialFormData);
        tokenService.updateLocalAccessToken(data.jwt);
        tokenService.setUser(data);
        refreshSession();
        setJustRegistered(true);
      },
    });
  };

  return (
    <div>
      <h1>Register now</h1>
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
