import { io } from "socket.io-client";

export const socket = io("https://chatapp-v2-0r6l.onrender.com", {
  withCredentials: true,
});
