import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { io } from "socket.io-client";
import { showErrorMessage } from "../components/messages/Message";
import tokenService from "./token.service";

const SESSION_EXPIRED_MESSAGE =
  "Your session has expired. Please, log in again.";
const MESSAGE_AFTER_NAVIGATION_MS = 100;

export default function useWebSockets(connectCondition, hackathonId) {
  const API_URL = import.meta.env.VITE_API_URL;
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!connectCondition) return;

    const newSocket = io(API_URL, {
      autoConnect: true,
      auth: (sendAuth) =>
        sendAuth({ token: tokenService.getLocalAccessToken() }),
    });
    newSocket.on("connect", () => {
      newSocket.emit("join_hackathon_rooms", hackathonId, () =>
        setSocket(newSocket),
      );
    });

    newSocket.on("session_expired", () => {
      tokenService.removeUser();
      setTimeout(
        () => showErrorMessage(SESSION_EXPIRED_MESSAGE, () => {}),
        MESSAGE_AFTER_NAVIGATION_MS,
      );
      navigate("/signin");
    });

    return () => {
      newSocket.disconnect();
      setSocket(null);
    };
  }, [connectCondition, hackathonId]);

  return { socket, setSocket };
}
