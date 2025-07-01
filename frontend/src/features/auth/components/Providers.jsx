import { FcGoogle } from "react-icons/fc";
import "../auth.css";
import { useState } from "react";
import useFetcher from "../../../utils/useFetcher";

export default function Providers() {
  const [error, setError] = useState(null);
  const { fetcher } = useFetcher(error, setError);

  const signUpProvider = ({ provider }) => {
    fetcher({
      url: `register?provider=${provider}`,
      onSuccess: (data) => {
        window.location.href = data.url;
      },
    });
  };

  return (
    <>
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
