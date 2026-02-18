import { io } from "socket.io-client";

export const socket = io(
  import.meta.env.MODE === "development"
    ? "http://localhost:3000"
    : "/",
  {
    withCredentials: true,
    autoConnect: true,
  }
);
