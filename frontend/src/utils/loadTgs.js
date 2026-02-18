import pako from "pako";

export const loadTgs = async (url) => {
  const res = await fetch(url);
  const buffer = await res.arrayBuffer();

  // TGS is gzipped lottie json
  const inflated = pako.inflate(new Uint8Array(buffer), { to: "string" });

  return JSON.parse(inflated);
};
