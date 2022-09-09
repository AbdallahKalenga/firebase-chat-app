import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { FormEvent, useState } from "react";
import { BiErrorAlt } from "react-icons/bi";
import { db } from "../../firebase/firebase";
import useStore, { chatStore } from "../../store/store";

const Search = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState<any>({});
  const [err, setErr] = useState(false);

  const { currentUser } = useStore();
  const { changeUser } = chatStore();

  const [selfSearch, setSelfSearch] = useState(false);

  const handleSearch = async () => {
    const q = query(
      collection(db, "users"),
      where("displayName", "==", username)
    );

    try {
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
    } catch (err) {
      setErr(true);
    }
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code === "Enter" && username === "") {
      setSelfSearch(false);
      setUser({});
      return;
    }

    if (
      e.code === "Enter" &&
      username.toLowerCase() === currentUser.displayName.toLowerCase()
    ) {
      setSelfSearch(true);
      setUser({});
      return;
    }

    if (e.code === "Enter" && username !== "") {
      setSelfSearch(false);
      handleSearch();
    }
  };

  const handleSelect = async (data: any) => {
    // Check if the chat between 2 users exists in firestore, if it doesnt, create a new one.

    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;

    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        // Create chat in the chats collection
        await setDoc(doc(db, "chats", combinedId), {
          messages: [],
        });

        // Create user chats
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        // Same thing for the other user

        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
    } catch (err) {
      setErr(true);
    }

    // Create user chats between 2 users
  };

  return (
    <div className="flex flex-col gap-4 px-8 py-8 border-b border-slate-500">
      <div>
        <input
          type="text"
          className="bg-slate-900 px-4 py-2 rounded-md focus:outline-none"
          placeholder="Find a user"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleKey}
        />
      </div>

      {err && (
        <div className="flex bg-red-500 shadow-xl items-center justify-center py-3 rounded-md text-white gap-1 transition-all items-center">
          <BiErrorAlt className="text-xl" />
          <p className="text-sm">
            Something went wrong Please try again later!
          </p>
        </div>
      )}

      {selfSearch && (
        <div className="flex bg-[#FF922E] shadow-xl items-center justify-center py-3 rounded-md text-white gap-1 transition-all items-center">
          <p className="text-sm">You can't search for yourself silly!</p>
        </div>
      )}

      {Object.keys(user).length > 0 && (
        <div
          className="flex items-center gap-4 cursor-pointer hover:bg-slate-900 rounded-full transition-all"
          onClick={() => handleSelect(user.userInfo)}
        >
          <img
            src={user.photoURL}
            className="w-10 h-10 object-cover rounded-full"
          />

          <div>
            <span> {user.displayName} </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
