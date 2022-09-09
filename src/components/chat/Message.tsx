import React from "react";
import useStore, { chatStore } from "../../store/store";

const Message = ({ message }: any) => {
  const { currentUser } = useStore();
  const { user } = chatStore();

  const getDate =
    message.date.toDate().getUTCDate() +
    "/" +
    message.date.toDate().getUTCMonth() +
    "/" +
    message.date.toDate().getUTCFullYear();

  const getTime =
    message.date.toDate().getHours() +
    ":" +
    message.date.toDate().getMinutes() +
    ":" +
    message.date.toDate().getSeconds();

  return (
    <div>
      <div
        className={
          message.senderId === currentUser.uid
            ? "flex gap-4 owner"
            : "flex gap-4"
        }
      >
        <div className="flex flex-col items-center gap-1">
          <img
            src={
              message.senderId === currentUser.uid
                ? currentUser.photoURL
                : user.photoURL
            }
            className="w-10 h-10 object-cover rounded-full"
          />
          <span className="text-xs text-gray-500 font-bold mb-3 flex flex-col items-center">
            <div>{getDate}</div>
            <div className="text-slate-800 time">{getTime}</div>
          </span>
        </div>

        <div className="max-w-[80%] flex flex-col gap-8 content mt-16">
          <p className="bg-slate-800 text-white px-6 py-4 rounded-tr-md rounded-br-md rounded-bl-md text-sm max-w-prose break-all">
            {message.text && message.text}
          </p>
          {message.img && (
            <img
              src={message.img}
              className="border-2 border-slate-800 w-52 h-52 rounded-tr-md rounded-br-md rounded-bl-md"
              alt="Image"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
