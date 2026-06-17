import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL;

export default function useSocket(onAiResponse) {
  const socketRef = useRef(null);
  const callbackRef = useRef(onAiResponse);

  useEffect(() => {
    callbackRef.current = onAiResponse;
  }, [onAiResponse]);

  useEffect(() => {
    if (!SOCKET_URL) {
      console.error("VITE_API_URL is missing");
      return;
    }

    const socket = io(SOCKET_URL, {
      withCredentials: true,

      transports: ["polling", "websocket"],

      reconnection: true,

      reconnectionAttempts: 5,

      timeout: 20000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("connect_error", (error) => {
      console.log("Socket error:", error.message);
    });

    socket.on("ai-response", (...args) => {
      callbackRef.current(...args);
    });

    return () => {
      socket.off("ai-response");

      socket.disconnect();

      socketRef.current = null;
    };
  }, []);

  const sendMessage = (chatId, content) => {
    if (!socketRef.current) {
      console.log("Socket not connected");

      return;
    }

    socketRef.current.emit("ai-message", {
      chat: chatId,
      content,
    });
  };

  return {
    sendMessage,
  };
}
