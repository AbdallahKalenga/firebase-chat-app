import React from "react";

import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import useStore from "../../store/store";

const Navbar = () => {
  const { currentUser } = useStore();

  return (
    <div className="flex flex-col justify-between items-center w-full bg-slate-900 h-28 py-3">
      <span className="text-2xl font-bold"> Konnect </span>

      <div className="flex items-center gap-8 2xl:gap-4">
        <div className="flex items-center gap-4">
          <img
            src={currentUser?.photoURL}
            className="h-10 w-10 rounded-full bg-white object-cover"
          />
          <span> {currentUser?.displayName} </span>
        </div>

        <div>
          <button
            type="submit"
            className="bg-slate-700 px-3 py-1 rounded-sm hover:bg-slate-800 transition-all"
            onClick={() => signOut(auth)}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
