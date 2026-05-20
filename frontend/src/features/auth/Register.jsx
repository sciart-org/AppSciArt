import React, { useContext, useState } from "react";
import Providers from "./components/Providers";
import RegistrationForm from "./components/RegistrationForm.jsx";
import { RegistrationContext } from "./context/RegistrationContext.jsx";
import tokenService from "../../utils/token.service.js";
import useFetcher from "../../utils/useFetcher.js";
import {
  itemsToUpperCase,
  toEnumValue,
  validateEmail,
} from "../../utils/commonUtils.js";
import AsterLink from "../../components/buttons/AsterLink.jsx";

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
    if (!validateEmail(formData.email)) {
      setError("Invalid email format");
      return;
    }
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
      <div style={{ margin: "2rem" }}>
        <h3 style={{ margin: 0 }}>Already a member of AppSciArt?</h3>
        <AsterLink to={"/signin"} style={{ margin: 0 }}>
          Log in
        </AsterLink>
      </div>
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
