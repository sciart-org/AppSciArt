import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import tokenService from "./token.service";

export default function useWebSockets(connectCondition, room = null) {
  const API_URL = import.meta.env.VITE_API_URL;
  const [socket, setSocket] = useState(null);
  const jwt = tokenService.getLocalAccessToken();

  useEffect(() => {
    if (!connectCondition) return;

    const newSocket = io(API_URL, {
      autoConnect: true,
      extraHeaders: {
        authorization: `Bearer ${jwt}`,
      },
    });
    setSocket(newSocket);

    if (room) {
      newSocket.emit("join_room", room);
    }

    return () => {
      newSocket.disconnect();
    };
  }, [connectCondition, room]);

  return { socket, setSocket };
}
