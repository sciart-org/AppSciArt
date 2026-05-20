import { FcGoogle } from "react-icons/fc";
import "../auth.css";
import { useState } from "react";
import useFetcher from "../../../utils/useFetcher";

const HalfHr = () => {
  return (
    <div
      style={{
        flex: 3,
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <hr style={{ width: "100%", margin: 0 }} />
    </div>
  );
};

const OrUseGoogleText = () => {
  return (
    <div
      style={{
        display: "flex",
        width: "90vw",
        margin: "1rem auto",
      }}
    >
      <HalfHr />
      <p
        style={{
          flex: 1,
          color: "var(--aster-dark-gray)",
          margin: "auto 0",
        }}
      >
        or use Google
      </p>
      <HalfHr />
    </div>
  );
};

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
      <OrUseGoogleText />
      <button
        tabIndex={0}
        className="sign-up-icon-button"
        onClick={() => signUpProvider({ provider: "google" })}
        aria-label="Sign up with Google"
      >
        <FcGoogle className="sign-up-icon" />
      </button>
    </>
  );
}
