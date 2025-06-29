import { FcGoogle } from "react-icons/fc";
import "../auth.css";
import { useState } from "react";
import ErrorMessage from "../../../components/messages/ErrorMessage";

export default function Providers() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [error, setError] = useState(null);

  const signUpProvider = ({ provider }) => {
    fetch(`${API_URL}/register?provider=${provider}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        window.location.href = data.url;
      })
      .catch((error) => setError(error));
  };

  return (
    <>
      <ErrorMessage errorMessage={error} setErrorMessage={setError} />
      <p>or</p>
      <FcGoogle
        className="sign-up-icon"
        onClick={() => {
          signUpProvider({ provider: "google" });
        }}
      />
    </>
  );
}
