import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import { useAuthStore } from "../store/useAuthStore";

function ContactList() {
  const chatStore = useChatStore();
  const { onlineUsers = [] } = useAuthStore();

  const {
    allContacts = [],
    isUsersLoading,
    setSelectedUser,
  } = chatStore;

  useEffect(() => {
  chatStore.getAllContacts();
}, []);


  if (isUsersLoading) {
    return <UsersLoadingSkeleton />;
  }

  if (!allContacts.length) {
    return (
      <p className="text-center text-slate-400 mt-4">
        No contacts found
      </p>
    );
  }

  return (
    <>
      {allContacts.map((contact) => {
        const isOnline = onlineUsers.includes(contact._id);

        return (
          <div
            key={contact._id}
            onClick={() => setSelectedUser(contact)}
            className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className={`avatar ${isOnline ? "online" : "offline"}`}>
                <div className="size-12 rounded-full">
                  <img
                    src={contact.profilePic || "/avatar.png"}
                    alt={contact.fullName}
                  />
                </div>
              </div>

              <h4 className="text-slate-200 font-medium">
                {contact.fullName}
              </h4>
            </div>
          </div>
        );
      })}
    </>
  );
}

export default ContactList;
