import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import Sticker from "../src/models/Sticker.js";
import { connectDB } from "../src/lib/db.js";

const STICKER_DIR = path.join(
  process.cwd(),
  "uploads",
  "stickers",
  "animated"
);

async function seedStickers() {
  await connectDB();

  // read actual sticker files
  const files = fs
    .readdirSync(STICKER_DIR)
    .filter(file => file.endsWith(".webm"));

  if (!files.length) {
    console.error("❌ No WEBM stickers found in uploads folder");
    process.exit(1);
  }

  // wipe old records
  await Sticker.deleteMany({});
  console.log("🧹 Old stickers removed");

  // prepare docs
  const stickers = files.map(file => ({
    name: path.parse(file).name,
    fileName: file,
    type: "animated"
  }));

  await Sticker.insertMany(stickers);

  console.log(`✅ Seeded ${stickers.length} WEBM stickers`);
  process.exit(0);
}

seedStickers().catch(err => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
