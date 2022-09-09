import React, { FormEvent, useEffect, useState } from "react";
import useStore, { chatStore } from "../../store/store";

import {
  AiOutlinePaperClip,
  AiOutlinePicture,
  AiOutlineSend,
} from "react-icons/ai";

import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../../firebase/firebase";

import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { updateProfile } from "firebase/auth";

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState<File>();

  const { currentUser } = useStore();
  const { user, chatId } = chatStore();

  const [users, setUsers] = useState([]);

  const imageSet = (event: React.FormEvent) => {
    const images = (event.target as HTMLInputElement).files;

    if (images && images.length > 0) {
      setImg(images[0]);
    }
  };

  const handleSend = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (img) {
      const storageRef = ref(storage, uuid());

      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          // Handle unsuccessful uploads
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, "chats", chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
              }),
            });
          });
        }
      );
    } else {
      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }

    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [chatId + ".lastMessage"]: {
        text,
      },
      [chatId + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userChats", user.uid), {
      [chatId + ".lastMessage"]: {
        text,
      },
      [chatId + ".date"]: serverTimestamp(),
    });

    setText("");
    setImg(undefined);
  };

  useEffect(() => {
    setUsers(user);
  }, []);

  return (
    <form onSubmit={handleSend} className="bg-slate-900 text-white h-16 flex">
      {user && Object.entries(user).length > 1 ? (
        <input
          type="text"
          className="w-full bg-slate-900 px-10 focus:outline-none"
          placeholder={`Send a message to ${user.displayName}...`}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      ) : (
        <input
          type="text"
          className="w-full bg-slate-900 px-10 focus:outline-none"
          placeholder="You need to start a conversation with another user!"
          disabled
        />
      )}
      <div className="flex items-center gap-5 px-8">
        <AiOutlinePaperClip className="text-2xl hover:text-gray-400 transition-all cursor-pointer" />

        <input type="file" className="hidden" id="file" onChange={imageSet} />

        <label htmlFor="file">
          <AiOutlinePicture className="text-2xl hover:text-gray-400 transition-all cursor-pointer" />
        </label>

        <button className="bg-slate-700 px-4 py-2 rounded-sm hover:bg-slate-800 transition-all">
          <AiOutlineSend />
        </button>
      </div>
    </form>
  );
};

export default Input;
