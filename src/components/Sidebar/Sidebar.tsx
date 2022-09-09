import React from "react";
import Chats from "./Chats";
import Navbar from "./Navbar";
import Search from "./Search";

const Sidebar = () => {
  return (
    <div className="flex flex-col basis-1/4 2xl:basis-1/6 bg-slate-800 text-white">
      <Navbar />
      <Search />
      <Chats />
    </div>
  );
};

export default Sidebar;
