import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import NoChatsFound from "./NoChatsFound";
import { useAuthStore } from "../store/useAuthStore";

function ChatsList() {
  const {
    getChatPartners,
    chatPartners,
    isUsersLoading,
    setSelectedUser,
  } = useChatStore();

  const { onlineUsers = [] } = useAuthStore();

  useEffect(() => {
    getChatPartners();
  }, []);

  if (isUsersLoading) return <UsersLoadingSkeleton />;

  if (!chatPartners.length) return <NoChatsFound />;

  return (
    <>
      {chatPartners.map((chat) => {
        const isOnline = onlineUsers.includes(chat._id);

        return (
          <div
            key={chat._id}
            onClick={() => setSelectedUser(chat)}
            className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className={`avatar ${isOnline ? "online" : "offline"}`}>
                <div className="size-12 rounded-full">
                  <img
                    src={chat.profilePic || "/avatar.png"}
                    alt={chat.fullName}
                  />
                </div>
              </div>

              <h4 className="text-slate-200 font-medium truncate">
                {chat.fullName}
              </h4>
            </div>
          </div>
        );
      })}
    </>
  );
}

export default ChatsList;
