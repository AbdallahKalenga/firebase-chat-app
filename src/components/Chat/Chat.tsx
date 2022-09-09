import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";

import { AiOutlineUserAdd } from "react-icons/ai";
import { BsThreeDots } from "react-icons/bs";
import useStore, { chatStore } from "../../store/store";
import Input from "./Input";
import Messages from "./Messages";

const Chat = () => {
  const { currentUser } = useStore();
  const { user, chatId } = chatStore();

  return (
    <div className="flex flex-col basis-1/2">
      <div className="flex justify-between items-center w-full bg-slate-800 h-28 gap-6 px-10 text-white">
        <span className="text-xl">
          {user && Object.entries(user).length > 0 ? (
            user.displayName
          ) : (
            <p className="text-sm w-96 bg-slate-900 px-8 py-2 rounded-md">
              Start a conversation with another user by searching their name or
              selecting one of the users on the left!
            </p>
          )}
        </span>
        <div className="flex gap-6 text-xl">
          <AiOutlineUserAdd />
          <BsThreeDots />
        </div>
      </div>
      <Messages />
      <Input />
    </div>
  );
};

export default Chat;
