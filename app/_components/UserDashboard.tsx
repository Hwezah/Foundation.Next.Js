"use client";
import { UserButton } from "@clerk/nextjs";
import Login from "./login";
import Link from "next/link";
import { HiOutlineBellAlert } from "react-icons/hi2";
import { FaHeart } from "react-icons/fa";
import { useUser } from "@clerk/nextjs";
export default function UserDashboard() {
  const { isSignedIn, user } = useUser();
  return (
    <div
      // className={`flex justify-between gap-4 ${
      //   showSearch ? "hidden sm:block" : "block"
      // } `}

      className="flex justify-between gap-4"
    >
      <div>
        <Link href="/donations" className="cursor-pointer">
          <FaHeart className="w-6 h-6 cursor-pointer" />
        </Link>
      </div>
      <Link href="/notifications">
        <HiOutlineBellAlert className="w-6 h-6 cursor-pointer" />
      </Link>
      <div className="hidden sm:block">
        {isSignedIn ? <UserButton /> : <Login />}
      </div>
    </div>
  );
}
