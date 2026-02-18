// import mongoose from "mongoose";

// const messageSchema = new mongoose.Schema(
//   {
//     senderId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true
//     },
//     receiverId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true
//     },

//     type: {
//       type: String,
//       enum: ["text", "image", "sticker", "emoji"],
//       required: true
//     },

//     content: {
//       type: String,
//       required: true
//     },

//     replyTo: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Message",
//       default: null,
//     },

//     isDeleted: {
//       type: Boolean,
//       default: false,
//     },

//     deletedFor: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//       },
//     ]
//     },  
//   { timestamps: true }
// );

// export default mongoose.model("Message", messageSchema);



































import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["text", "image", "sticker", "emoji"],
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    /* 🔁 REPLY SUPPORT */
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },

    /* 🗑 DELETE */
    isDeleted: {
      type: Boolean,
      default: false,
    },

    deletedFor: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
