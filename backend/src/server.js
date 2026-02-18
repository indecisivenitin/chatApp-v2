import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import stickerRoutes from "./routes/sticker.route.js";

import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import { app, server } from "./lib/socket.js";

const __dirname = path.resolve();

const PORT = ENV.PORT || 3000;
app.set("trust proxy", 1);
app.use(express.json({ limit: "5mb" })); // req.body
app.use(cors({ origin: ["https://chat-app-v2-olive.vercel.app",
    "https://chat-app-v2-h7yd60nct-nitins-projects-e996c1dd.vercel.app"], credentials: true }));
app.use(cookieParser());
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);
app.use("/api/stickers", stickerRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);



server.listen(PORT, () => {
  console.log("Server running on port: " + PORT);
  connectDB();
});
