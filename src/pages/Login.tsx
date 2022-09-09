import { collection, onSnapshot, query } from "firebase/firestore";
import React, { FormEvent, useEffect, useState } from "react";
import { BiErrorAlt } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/firebase";

import { signInWithEmailAndPassword } from "firebase/auth";
import useStore from "../store/store";

const inputStyle = `border-2 rounded-sm border-gray-200 p-2 text-sm focus:bg-gray-50 focus:outline-none focus:ring-0 transition-all`;

const Login = () => {
  const [err, setErr] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);

  const { currentUser } = useStore();

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement> | any) => {
    e.preventDefault();

    const email = (e.target[0] as HTMLInputElement).value;
    const password = (e.target[1] as HTMLInputElement).value;

    try {
      await signInWithEmailAndPassword(auth, email, password);

      navigate("/");
    } catch (err) {
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
      <div className="bg-[#fff] px-16 py-8 flex flex-col gap-3 items-center rounded-md shadow-xl">
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
            type="email"
            placeholder="E-mail address"
          />

          <input
            className={inputStyle}
            type="password"
            placeholder="Password"
          />

          <button
            type="submit"
            className="border-2 rounded-sm border-gray-200 p-2 hover:bg-gray-5 hover:border-gray-200 text-sm transition-all mt-2"
          >
            Login
          </button>

          <p className="self-center text-md mt-1">
            Don't have an account?
            <Link
              to="/register"
              className="text-slate-500 ml-1 hover:text-slate-600 transition-all"
            >
              Register!
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

export default Login;
