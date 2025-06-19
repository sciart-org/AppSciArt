import React from "react";
import RegistrationForm from "./components/RegistrationForm.jsx";
import { useSearchParams } from "react-router";

export default function CompleteRegistration(props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const emailToRegister = searchParams.get("email");

  if (emailToRegister === null) {
    return (
      <div style={{ height: "100%", alignContent: "center" }}>
        <p>No email found to complete your registration.</p>
        <p>Please, check your inbox to finish setting up your profile.</p>
      </div>
    );
  }

  return (
    <div>
      <RegistrationForm email={emailToRegister} />
    </div>
  );
}
