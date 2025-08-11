import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function useWebSockets(connectCondition, room = null) {
    const API_URL = import.meta.env.VITE_API_URL;
    const [socket, setSocket] = useState(null)

    useEffect(() => {
        if (!connectCondition) return;

        const newSocket = io(API_URL, {
            autoConnect: true,
        });
        setSocket(newSocket)

        if(room) {
            newSocket.emit("join_room", room);
        }

        return () => {
            newSocket.disconnect();
        };
    }, [connectCondition, room]);

    return { socket, setSocket }
} 