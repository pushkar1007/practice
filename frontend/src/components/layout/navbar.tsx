"use client"

import { IoSearchOutline } from "react-icons/io5";
import { GoHomeFill } from "react-icons/go";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

const Navbar = () => {

  const router = useRouter();

  return (
    <nav className="flex p-[10px] px-[24px] items-center justify-between">
      <img
        src="/spotify.svg"
        alt="spotify logo"
        className="w-[42px] h-[42px] cursor-pointer"
        onClick={() => router.replace("/")}
      />
      <div className="flex w-[38%] justify-between">
        <div
          className="w-[48px] h-[48px] bg-[#1e1e1e] rounded-full flex justify-center items-center cursor-pointer hover:bg-[#2f2f2f] transform transition-transform duration-200 hover:scale-104"
          onClick={() => router.replace("/")}
        >
          <GoHomeFill className="w-[24px] h-[24px]" />
        </div>
        <div className="flex w-[89%] relative">
          <label htmlFor="search" className="flex items-center">
            <IoSearchOutline className="w-[24px] h-[24px] absolute left-[10px]" />
          </label>
          <input
            type="text"
            className="border-[1px] bg-[#1e1e1e] w-full h-[48px] rounded-[500px] pl-[42px] pr-[12px] overflow-ellipsis"
            id="search"
            placeholder="What do you want to Play"
          />
        </div>
      </div>
      <Avatar className="w-[42px] h-[42px] cursor-pointer">
        <AvatarImage src="/images/profilepic.png" />
      </Avatar>
    </nav>
  );
};

export default Navbar;
