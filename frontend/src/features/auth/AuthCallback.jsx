import { useEffect } from "react";
import tokenService from "../../utils/token.service";

export default function AuthCallback() {
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get("access_token");
    tokenService.updateLocalAccessToken(accessToken);
    fetch(`${API_URL}/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (!data.error) {
          tokenService.setUser(data);
          window.location.href = "/";
        } else {
          window.location.href = "/signup";
        }
      });
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "white",
        zIndex: 9999,
      }}
    />
  );
}
