// import { useRef, useState } from "react";
// import { ImageIcon, SendIcon, XIcon, SmileIcon } from "lucide-react";
// import toast from "react-hot-toast";

// import useKeyboardSound from "../hooks/useKeyboardSound";
// import { useChatStore } from "../store/useChatStore";
// import StickerPicker from "./StickerPicker";

// function MessageInput() {
//   const { playRandomKeyStrokeSound } = useKeyboardSound();
//   const { sendMessage, isSoundEnabled } = useChatStore();

//   const [text, setText] = useState("");
//   const [imagePreview, setImagePreview] = useState(null);
//   const [isPickerOpen, setIsPickerOpen] = useState(false);

//   const fileInputRef = useRef(null);

//   /* ---------------- SEND TEXT / IMAGE ---------------- */
//   const handleSendMessage = (e) => {
//     e.preventDefault();

//     if (!text.trim() && !imagePreview) return;

//     isSoundEnabled && playRandomKeyStrokeSound();

//     sendMessage({
//       type: imagePreview ? "image" : "text",
//       content: imagePreview || text.trim(),
//     });

//     setText("");
//     setImagePreview(null);
//     setIsPickerOpen(false);
//     if (fileInputRef.current) fileInputRef.current.value = "";
//   };

//   /* ---------------- IMAGE ---------------- */
//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (!file || !file.type.startsWith("image/")) {
//       toast.error("Select a valid image");
//       return;
//     }

//     const reader = new FileReader();
//     reader.onloadend = () => setImagePreview(reader.result);
//     reader.readAsDataURL(file);
//   };

//   const removeImage = () => {
//     setImagePreview(null);
//     if (fileInputRef.current) fileInputRef.current.value = "";
//   };

//   return (
//     <div className="p-4 border-t border-slate-700/50 relative">
//       {/* IMAGE PREVIEW */}
//       {imagePreview && (
//         <div className="mb-3">
//           <div className="relative w-20">
//             <img
//               src={imagePreview}
//               alt="preview"
//               className="w-20 h-20 rounded-lg object-cover"
//             />
//             <button
//               type="button"
//               onClick={removeImage}
//               className="absolute -top-2 -right-2 bg-slate-800 rounded-full p-1"
//             >
//               <XIcon size={14} />
//             </button>
//           </div>
//         </div>
//       )}

//       <form onSubmit={handleSendMessage} className="flex items-center gap-3">
//         {/* TEXT */}
//         <input
//           value={text}
//           onChange={(e) => {
//             setText(e.target.value);
//             isSoundEnabled && playRandomKeyStrokeSound();
//           }}
//           placeholder="Type a message…"
//           className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2"
//         />

//         {/* STICKER */}
//         <button
//           type="button"
//           onClick={() => setIsPickerOpen((p) => !p)}
//           className="bg-slate-800 px-3 py-2 rounded-lg"
//         >
//           <SmileIcon className="w-5 h-5 text-slate-300" />
//         </button>

//         {isPickerOpen && (
//           <StickerPicker
//             onSelect={(sticker) => {
//               sendMessage({
//                 type: "sticker",
//                 content: `/uploads/stickers/animated/${sticker.fileName}`,
//               });
//               setIsPickerOpen(false);
//             }}
//           />
//         )}

//         {/* IMAGE */}
//         <input
//           type="file"
//           ref={fileInputRef}
//           accept="image/*"
//           onChange={handleImageChange}
//           className="hidden"
//         />

//         <button
//           type="button"
//           onClick={() => fileInputRef.current?.click()}
//           className="bg-slate-800 px-3 py-2 rounded-lg"
//         >
//           <ImageIcon className="w-5 h-5 text-slate-300" />
//         </button>

//         {/* SEND */}
//         <button
//           type="submit"
//           disabled={!text.trim() && !imagePreview}
//           className="bg-cyan-600 px-4 py-2 rounded-lg disabled:opacity-50"
//         >
//           <SendIcon className="w-5 h-5 text-white" />
//         </button>
//       </form>
//     </div>
//   );
// }

// export default MessageInput;








































































import { useState } from "react";
import { useChatStore } from "../store/useChatStore";

function MessageInput() {
  const [text, setText] = useState("");

  const {
    selectedUser,
    sendMessage,
    replyMessage,
    clearReplyMessage,
  } = useChatStore();

  const handleSend = () => {
    if (!text.trim()) return;

    sendMessage({
      receiverId: selectedUser._id,
      content: text,
      type: "text",
    });

    setText("");
  };

  return (
    <div className="border-t border-slate-800 px-4 py-3">
      {/* REPLY PREVIEW */}
      {replyMessage && (
        <div className="mb-2 p-2 bg-slate-900 border-l-4 border-cyan-500 rounded relative">
          <p className="text-xs text-slate-400">Replying to</p>
          <p className="text-sm truncate">
            {replyMessage.content || "Media message"}
          </p>

          <button
            onClick={clearReplyMessage}
            className="absolute top-1 right-2 text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      <div className="flex items-center gap-3">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message"
          className="flex-1 bg-slate-900 text-white px-4 py-2 rounded-lg outline-none"
        />

        <button
          onClick={handleSend}
          className="bg-cyan-600 px-4 py-2 rounded-lg text-white"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default MessageInput;
