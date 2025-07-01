import { useEffect, useState } from "react";
import tokenService from "../../utils/token.service";
import useFetcher from "../../utils/useFetcher";

export default function AuthCallback() {
  const [error, setError] = useState(null);
  const { fetcher, refreshToken } = useFetcher(error, setError);

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get("access_token");
    tokenService.updateLocalAccessToken(accessToken);
    refreshToken();

    fetcher({
      url: "me",
      onSuccess: (data) => {
        tokenService.setUser(data);
        window.location.href = "/";
      },
      onError: () => {
        window.location.href = "/signup";
      },
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
