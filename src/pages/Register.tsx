import React, { FormEvent, useEffect, useState } from "react";
import { TiTick } from "react-icons/ti";

import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../firebase/firebase";

import { BiErrorAlt } from "react-icons/bi";

import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  setDoc,
} from "firebase/firestore";

import { Link, useNavigate } from "react-router-dom";
import useStore from "../store/store";

const inputStyle = `border-2 rounded-sm border-gray-200 p-2 text-sm focus:bg-gray-50 focus:outline-none focus:ring-0 transition-all`;

const Register = () => {
  const [err, setErr] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);
  const [progress, setProgress] = useState(0);

  const { refreshUser } = useStore();

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement> | any) => {
    e.preventDefault();

    const displayName = (e.target[0] as HTMLInputElement).value;
    const email = (e.target[1] as HTMLInputElement).value;
    const password = (e.target[2] as HTMLInputElement).value;
    const file = e.target[3].files[0];

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      const storageRef = ref(storage, displayName);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const percent =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(percent);
        },
        (error) => {
          // Handle unsuccessful uploads
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateProfile(res.user, {
              displayName,
              photoURL: downloadURL,
            });

            // Add a new document in collection "cities"
            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              photoURL: downloadURL,
            });

            await setDoc(doc(db, "userChats", res.user.uid), {});

            await res.user.reload();

            refreshUser(auth.currentUser);

            if (progress === 100) {
              navigate("/");
            }
          });
        }
      );
    } catch (err) {
      console.log(err);
      setErr(true);
    }
  };

  useEffect(() => {
    const q = query(collection(db, "users"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const total = querySnapshot.size;
      setTotalUsers(total);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="flex flex-col items-center w-full justify-center">
      <div className="bg-[#fff] px-16 py-8 flex flex-col gap-3 items-center shadow-xl rounded-lg">
        <div className="flex flex-col">
          <h1 className="text-2xl text-gray-700 self-center"> Konnect </h1>
          <p className="text-[12px] text-gray-500 mt-1">
            Come and <span className="font-bold">konnect</span> with{" "}
            {totalUsers} other users!
          </p>
        </div>

        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <input
            className={inputStyle}
            type="text"
            placeholder="Display name"
          />

          <input
            className={inputStyle}
            type="email"
            placeholder="E-mail address"
          />

          <input
            className={inputStyle}
            type="password"
            placeholder="Password"
          />

          <input
            type="file"
            className="block w-full text-sm bg-gray-50 rounded-lg border border-gray-300 cursor-pointer focus:outline-none file:bg-zinc-800 file:text-white file:border-none file:font-['Outfit'] file:border-r-2 file:p-2 file:px-4 file:mr-3"
          />

          <button
            type="submit"
            className="border-2 rounded-sm border-gray-200 p-2 hover:bg-gray-5 hover:border-gray-200 text-sm transition-all mt-2"
          >
            Sign up
          </button>

          <p className="self-center text-md mt-1">
            Have an account?
            <Link
              to="/login"
              className="text-slate-500 ml-1 hover:text-slate-600 transition-all"
            >
              Login!
            </Link>
          </p>
        </form>
      </div>

      {err && (
        <div className="mt-5 flex bg-red-600 shadow-xl px-[7.4rem] py-6 rounded-md text-white gap-1 transition-all items-center">
          <BiErrorAlt className="text-xl" />
          <p className="text-sm"> Something went wrong! </p>
        </div>
      )}
    </div>
  );
};

export default Register;
