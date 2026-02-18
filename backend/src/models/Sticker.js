import mongoose from "mongoose";

const stickerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    fileName: { type: String, required: true }, // smile.tgs
    type: { type: String, enum: ["animated"], default: "animated" }
  },
  { timestamps: true }
);

export default mongoose.model("Sticker", stickerSchema);
