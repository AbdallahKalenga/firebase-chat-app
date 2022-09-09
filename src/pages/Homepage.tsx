import React, { useEffect } from "react";
import { Chat } from "../components/chat";
import { Sidebar } from "../components/sidebar";
import useStore from "../store/store";

const Homepage = () => {
  return (
    <div className="h-screen min-w-screen">
      <div className="h-screen w-screen flex">
        <Sidebar />

        <div className="h-full w-full">
          <Chat />
        </div>
      </div>
    </div>
  );
};

export default Homepage;
