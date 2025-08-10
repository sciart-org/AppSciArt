import { useEffect } from "react";
import { showErrorMessage } from "../components/messages/Message";
import tokenService from "./token.service";
import { useNavigate } from "react-router";

export default function useFetcher(error, setError) {
    const API_URL = import.meta.env.VITE_API_URL;
    let jwt = tokenService.getLocalAccessToken()
    const navigate = useNavigate()

    useEffect(() => {
        if (error) {
            showErrorMessage(error, setError);
        }
    }, [error]);

    function refreshToken() {
        jwt = tokenService.getLocalAccessToken()
    }

    async function fetcher({ url, method = "GET", body = null, onSuccess = () => { }, onError = () => { } }) {
        if (method === "GET" && body) {
            setError("GET requests should not have a body");
            return
        }

        const authHeader = jwt ? {
            Authorization: `Bearer ${jwt}`,
        } : {}
        const requestBody = body ? {
            body: JSON.stringify(body)
        } : {}

        return await fetch(`${API_URL}/${url}`, {
            method,
            headers: {
                "Content-Type": "application/json",
                ...authHeader
            },
            ...requestBody,
        })
            .then((response) => {
                if (response.status === 401) {
                    navigate("/unauthorized")
                }
                if (response.status === 404) {
                    navigate("/not-found")
                }
                return response.json();
            })
            .then((data) => {
                if (!data || !data.error) {
                    setError(null);
                    onSuccess(data)
                } else {
                    setError(data.error);
                    onError(data)
                }
            })
            .catch((error) => {
                setError(error.message)
            });
    }

    return { fetcher, refreshToken }
} 