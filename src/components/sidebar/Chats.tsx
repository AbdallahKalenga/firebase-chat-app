import { doc, DocumentData, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase/firebase";
import useStore, { chatStore } from "../../store/store";

const Chats = () => {
  const { currentUser } = useStore();
  const { user, changeUser } = chatStore();

  const [chats, setChats] = useState<DocumentData>();

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data());
      });

      return () => unsub();
    };

    currentUser.uid && getChats();
  }, [currentUser.uid]);

  const handleSelect = (data: any, chatId: string) => {
    const newChatId =
      currentUser.uid > chatId
        ? currentUser.uid + chatId
        : chatId + currentUser.uid;

    changeUser(data, newChatId);
  };

  return (
    <div className="flex flex-col gap-4 px-4 py-8">
      {chats && Object.entries(chats).length > 0 ? (
        Object.entries(chats)
          ?.sort((a, b) => b[1]?.date - a[1]?.date)
          .map((chat: any, index: number) => (
            <div
              className="flex items-center gap-4 cursor-pointer hover:bg-slate-900 px-4 py-2 rounded-md transition-all"
              key={index}
              onClick={() =>
                handleSelect(chat[1]?.userInfo, chat[1]?.userInfo.uid)
              }
            >
              <img
                src={chat[1]?.userInfo.photoURL}
                className="w-10 h-10 object-cover rounded-full"
              />

              <div>
                <span> {chat[1]?.userInfo.displayName} </span>
                <p className="text-xs text-gray-200/[0.5] w-[48] break-all">
                  {chat[1].lastMessage
                    ? chat[1].lastMessage?.text.substr(0, 60) + "..."
                    : "Konnect with this user!"}
                </p>
              </div>
            </div>
          ))
      ) : (
        <p className="text-sm w-62 bg-slate-900 px-8 py-4 rounded-md break-all">
          You don't have any chats! Search for a user to konnect!
        </p>
      )}
    </div>
  );
};

export default Chats;
