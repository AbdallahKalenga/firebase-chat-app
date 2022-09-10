import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebase";
import useStore, { chatStore } from "../../store/store";
import Message from "./Message";

import { BsFillChatLeftFill } from "react-icons/bs";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { user, chatId } = chatStore();
  const { currentUser } = useStore();

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "chats", chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
    });

    return () => unsub();
  }, [chatId]);

  return (
    <div className="px-10 py-8 h-[calc(100vh-176px)] overflow-scroll">
      {messages.length > 0
        ? messages.map((message, index) => (
            <Message message={message} key={index} />
          ))
        : user && (
            <div>
              <div className={"flex gap-4"}>
                <div className="flex flex-col items-center gap-1">
                  <BsFillChatLeftFill className="w-10 h-10 rounded-md text-slate-800" />
                  <span className="text-xs text-gray-500 font-bold mb-3 flex flex-col items-center">
                    Just now
                  </span>
                </div>

                <div className="max-w-[80%] flex flex-col gap-8 content mt-16">
                  <p className="bg-slate-800 text-white px-6 py-4 rounded-tr-md rounded-br-md rounded-bl-md text-sm max-w-prose break-all">
                    {user.displayName
                      ? `You and ${user.displayName} haven't talked before, start konnecting with them!`
                      : `Start konnecting with somebody! Search for users on the left to start!`}
                  </p>
                </div>
              </div>
            </div>
          )}
    </div>
  );
};

export default Messages;
