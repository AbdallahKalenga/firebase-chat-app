import React from "react";

const inputStyle = `border-2 rounded-sm border-gray-200 p-2 text-sm focus:bg-gray-50 focus:outline-none focus:ring-0 transition-all`;

const Register = () => {
  return (
    <div className="flex items-center w-full justify-center">
      <div className="bg-[#fff] px-16 py-8 flex flex-col gap-3 items-center rounded-md shadow-xl">
        <div className="flex flex-col">
          <h1 className="text-2xl text-gray-700 self-center"> Konnect </h1>
          <p className="text-[12px] text-gray-500">
            Register to talk to 23 other users!
          </p>
        </div>

        <form className="flex flex-col gap-3">
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
            className="block w-full text-sm bg-gray-50 rounded-lg border border-gray-300 cursor-pointer focus:outline-none file:bg-zinc-800 file:text-white file:border-none file:font-['Outfit'] file:border-r-2 file:p-2 file:px-4 file:mr-5"
          />

          <button
            type="submit"
            className="border-2 rounded-sm border-gray-200 p-2 hover:bg-gray-5 hover:border-gray-200 text-sm transition-all mt-2"
          >
            Sign up!
          </button>

          <p className="self-center text-md mt-1">
            Do you have an account? <span>Login</span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
