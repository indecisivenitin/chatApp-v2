import { useEffect, useState } from "react";

const BACKEND_URL = "http://localhost:3000";

function StickerPicker({ onSelect }) {
  const [stickers, setStickers] = useState([]);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/stickers`)
      .then((res) => res.json())
      .then(setStickers)
      .catch(console.error);
  }, []);

  return (
    <div className="absolute bottom-14 right-0 w-80 bg-slate-900 border border-slate-700 rounded-xl z-50">
      <div className="grid grid-cols-4 gap-2 p-3 max-h-72 overflow-y-auto">
        {stickers.map((sticker) => {
          const stickerUrl = `${BACKEND_URL}/uploads/stickers/animated/${sticker.fileName}`;

          return (
            <button
              key={sticker._id}
              onClick={() =>
                onSelect({
                  ...sticker,
                  content: stickerUrl, // 🔑 ABSOLUTE URL
                })
              }
              className="hover:bg-slate-800 rounded-lg p-1"
            >
              <video
                src={stickerUrl}
                autoPlay
                loop
                muted
                playsInline
                className="w-16 h-16 object-contain"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default StickerPicker;
