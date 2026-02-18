
import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessageInput from "./MessageInput";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";

const BACKEND_URL = "http://localhost:3000";

function ChatContainer() {
  const {
    selectedUser,
    getMessagesByUserId,
    messages,
    isMessagesLoading,
    subscribeToMessages,
    unsubscribeFromMessages,
    deleteMessage,
    setReplyMessage, // 👈 we’ll use this later
  } = useChatStore();

  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const [contextMsg, setContextMsg] = useState(null);

  useEffect(() => {
    if (!selectedUser?._id) return;

    getMessagesByUserId(selectedUser._id);
    subscribeToMessages();
    setContextMsg(null);

    return () => unsubscribeFromMessages();
  }, [selectedUser]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const resolveContent = (msg) => {
    if (msg.type === "sticker" && msg.content && !msg.content.startsWith("http")) {
      return `${BACKEND_URL}${msg.content}`;
    }
    return msg.content;
  };

  return (
    <>
      <ChatHeader />

      <div
        className="flex-1 px-6 overflow-y-auto py-8"
        onClick={() => setContextMsg(null)} // click outside closes menu
      >
        {messages.length && !isMessagesLoading ? (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg) => {
              const isMe = msg.senderId === authUser._id;

              if (msg.deletedFor?.includes(authUser._id)) return null;

              return (
                <div
                  key={msg._id}
                  className={`chat ${isMe ? "chat-end" : "chat-start"}`}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setContextMsg(msg); // ✅ allow for ALL messages
                  }}
                >
                  <div
                    className={`chat-bubble relative ${
                      isMe
                        ? "bg-cyan-600 text-white"
                        : "bg-slate-800 text-slate-200"
                    }`}
                  >
                    {msg.isDeleted ? (
                      <p className="italic text-sm opacity-70">
                        This message was deleted
                      </p>
                    ) : (
                      <>
                        {msg.type === "text" && <p>{msg.content}</p>}

                        {msg.type === "image" && (
                          <img
                            src={msg.content}
                            className="rounded-lg max-h-60"
                          />
                        )}

                        {msg.type === "sticker" && (
                          <video
                            src={resolveContent(msg)}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-32 h-32 object-contain"
                          />
                        )}
                      </>
                    )}

                    <p className="text-xs mt-1 opacity-70">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>

                    {/* CONTEXT MENU */}
                    {contextMsg?._id === msg._id && (
                      <div
                        className="absolute top-full right-0 mt-2 bg-slate-900 border border-slate-700 rounded-lg text-sm z-50"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* REPLY */}
                        <button
                          onClick={() => {
                            setReplyMessage(msg);
                            setContextMsg(null);
                          }}
                          className="block w-full px-4 py-2 hover:bg-slate-800 text-left"
                        >
                          Reply
                        </button>

                        {/* DELETE FOR ME */}
                        <button
                          onClick={() => {
                            deleteMessage(msg._id, "me");
                            setContextMsg(null);
                          }}
                          className="block w-full px-4 py-2 hover:bg-slate-800 text-left"
                        >
                          Delete for me
                        </button>

                        {/* DELETE FOR EVERYONE (only sender) */}
                        {isMe && (
                          <button
                            onClick={() => {
                              deleteMessage(msg._id, "everyone");
                              setContextMsg(null);
                            }}
                            className="block w-full px-4 py-2 hover:bg-slate-800 text-red-400 text-left"
                          >
                            Delete for everyone
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={messageEndRef} />
          </div>
        ) : isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : (
          <NoChatHistoryPlaceholder name={selectedUser.fullName} />
        )}
      </div>

      <MessageInput />
    </>
  );
}

export default ChatContainer;
