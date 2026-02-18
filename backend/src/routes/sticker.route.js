import express from "express";
import Sticker from "../models/Sticker.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const stickers = await Sticker.find();
  res.json(stickers);
});

export default router;
