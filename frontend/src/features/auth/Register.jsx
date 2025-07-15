import React, { useContext, useState } from "react";
import Providers from "./components/Providers";
import RegistrationForm from "./components/RegistrationForm.jsx";
import { RegistrationContext } from "./context/RegistrationContext.jsx";
import tokenService from "../../utils/token.service.js";
import useFetcher from "../../utils/useFetcher.js";
import { itemsToUpperCase, toEnumValue } from "../../utils/commonUtils.js";

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

  const signUp = async () => {
    await fetcher({
      url: "register?method=direct",
      method: "POST",
      body: {
        ...formData,
        gender: toEnumValue(formData.gender),
        affiliations: itemsToUpperCase(formData.affiliations),
        areasOfInterest: itemsToUpperCase(formData.areasOfInterest),
        ageRange: toEnumValue(formData.ageRange),
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
