import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { socket } from "../lib/socket";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  /* ===================== UI STATE ===================== */
  activeTab: "chats",
  setActiveTab: (tab) => set({ activeTab: tab }),

  /* ===================== CHAT STATE ===================== */
  selectedUser: null,
  messages: [],
  allContacts: [],
  chatPartners: [],

  isMessagesLoading: false,
  isUsersLoading: false,

  replyMessage: null,

  /* ===================== HELPERS ===================== */
  setSelectedUser: (user) => set({ selectedUser: user }),

  setReplyMessage: (msg) => set({ replyMessage: msg }),
  clearReplyMessage: () => set({ replyMessage: null }),

  /* ===================== CONTACTS ===================== */
  getAllContacts: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/contacts");
      set({ allContacts: Array.isArray(res.data) ? res.data : [] });
    } catch (err) {
      console.error("getAllContacts error:", err);
      set({ allContacts: [] });
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getChatPartners: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/chats");
      set({ chatPartners: Array.isArray(res.data) ? res.data : [] });
    } catch (err) {
      console.error("getChatPartners error:", err);
      set({ chatPartners: [] });
    } finally {
      set({ isUsersLoading: false });
    }
  },

  /* ===================== MESSAGES ===================== */
  getMessagesByUserId: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: Array.isArray(res.data) ? res.data : [] });
    } catch (err) {
      console.error("Get messages error:", err);
      set({ messages: [] });
    } finally {
      set({ isMessagesLoading: false });
    }
  },
sendMessage: async ({ receiverId, content, type }) => {
  const { replyMessage } = get();
  const authUser = useAuthStore.getState().authUser;

  if (!authUser) return;

  const tempMessage = {
    _id: crypto.randomUUID(),
    senderId: authUser._id,
    receiverId,
    content,
    type,
    replyTo: replyMessage?._id || null,
    createdAt: new Date().toISOString(),
    isDeleted: false,
    pending: true,
  };

  set((state) => ({
    messages: [...state.messages, tempMessage],
    replyMessage: null,
  }));

  try {
    await axiosInstance.post(`/messages/send/${receiverId}`, {
      content,
      type,
      replyTo: replyMessage?._id || null,
    });
  } catch (err) {
    console.error("Send message error:", err);
  }
},


  // 🔥 OPTIMISTIC UI UPDATE
  set((state) => ({
    messages: [...state.messages, tempMessage],
    replyMessage: null,
  }));

  try {
    await axiosInstance.post(`/messages/send/${receiverId}`, {
      content,
      type,
      replyTo: replyMessage?._id || null,
    });
  } catch (err) {
    console.error("Send message error:", err);
  }
},


 deleteMessage: async (messageId, mode) => {
  // 🔥 OPTIMISTIC DELETE
  set((state) => ({
    messages: state.messages.map((m) =>
      m._id === messageId
        ? mode === "everyone"
          ? { ...m, isDeleted: true, content: "" }
          : m
        : m
    ),
  }));

  try {
    await axiosInstance.delete(`/messages/${messageId}`, {
      data: { mode },
    });
  } catch (err) {
    console.error("Delete message error:", err);
  }
},


  /* ===================== SOCKET ===================== */
subscribeToMessages: () => {
  socket.off("newMessage");
  socket.off("messageDeleted");

  socket.on("newMessage", (message) => {
    set((state) => ({
      messages: [...state.messages, message],
    }));
  });

  socket.on("messageDeleted", ({ messageId, mode }) => {
    set((state) => ({
      messages: state.messages.map((m) =>
        m._id === messageId
          ? mode === "everyone"
            ? { ...m, isDeleted: true, content: "" }
            : m
          : m
      ),
    }));
  });
},


  unsubscribeFromMessages: () => {
    socket.off("newMessage");
    socket.off("messageDeleted");
  },
}));
