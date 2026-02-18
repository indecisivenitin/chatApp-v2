

import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import Message from "../models/Message.js";
import User from "../models/User.js";

/* ===================== CONTACTS ===================== */

export const getAllContacts = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const users = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(users);
  } catch (error) {
    console.error("getAllContacts error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===================== GET MESSAGES ===================== */

export const getMessagesByUserId = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: otherUserId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: myId },
      ],
    })
      .populate({
        path: "replyTo",
        select: "type content senderId isDeleted",
      })
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("getMessagesByUserId error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* ===================== SEND MESSAGE ===================== */

export const sendMessage = async (req, res) => {
  try {
    const { type, content, replyTo } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    if (!type || !content) {
      return res
        .status(400)
        .json({ message: "Message type and content are required" });
    }

    if (senderId.equals(receiverId)) {
      return res
        .status(400)
        .json({ message: "Cannot send message to yourself" });
    }

    const receiverExists = await User.exists({ _id: receiverId });
    if (!receiverExists) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    /* 🧠 validate reply target */
    let replyMessage = null;
    if (replyTo) {
      replyMessage = await Message.findById(replyTo);
      if (!replyMessage) {
        return res.status(400).json({ message: "Reply message not found" });
      }
    }

    /* 🖼 IMAGE */
    let finalContent = content;
    if (type === "image") {
      const upload = await cloudinary.uploader.upload(content, {
        folder: "chat-images",
      });
      finalContent = upload.secure_url;
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      type,
      content: finalContent,
      replyTo: replyMessage?._id || null,
    });

    const populatedMessage = await Message.findById(newMessage._id).populate({
      path: "replyTo",
      select: "type content senderId isDeleted",
    });

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", populatedMessage);
    }

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error("sendMessage error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* ===================== CHAT PARTNERS ===================== */

export const getChatPartners = async (req, res) => {
  try {
    const userId = req.user._id;

    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    });

    const partnerIds = [
      ...new Set(
        messages.map((m) =>
          m.senderId.equals(userId) ? m.receiverId : m.senderId
        )
      ),
    ];

    const partners = await User.find({
      _id: { $in: partnerIds },
    }).select("-password");

    res.status(200).json(partners);
  } catch (error) {
    console.error("getChatPartners error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* ===================== DELETE MESSAGE ===================== */

export const deleteMessage = async (req, res) => {
  try {
    const userId = req.user._id;
    const { messageId } = req.params;
    const { mode } = req.body;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (mode === "everyone" && !message.senderId.equals(userId)) {
      return res.status(403).json({ message: "Not allowed" });
    }

    if (mode === "me") {
      if (!message.deletedFor.includes(userId)) {
        message.deletedFor.push(userId);
      }
    }

    if (mode === "everyone") {
      message.isDeleted = true;
      message.content = "";
    }

    await message.save();

    const receiverSocketId = getReceiverSocketId(
      message.senderId.equals(userId)
        ? message.receiverId
        : message.senderId
    );

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("messageDeleted", {
        messageId,
        mode,
      });
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Delete message error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
