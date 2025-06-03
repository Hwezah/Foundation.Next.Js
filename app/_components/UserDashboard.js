"use client";
import { HiOutlineUser } from "react-icons/hi";
import Link from "next/link";
import { MdOutlineCast } from "react-icons/md";
import { HiAdjustmentsHorizontal, HiOutlineBellAlert } from "react-icons/hi2";
import { FaHeart } from "react-icons/fa";

export default function UserDashboard() {
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
      <div>
        <Link href="/cast">
          <MdOutlineCast className="w-6 h-6 cursor-pointer" />
        </Link>
      </div>
      <Link href="/notifications">
        <HiOutlineBellAlert className="w-6 h-6 cursor-pointer" />
      </Link>
      <div className="hidden sm:block">
        <Link href="/user">
          <HiOutlineUser className="w-6 h-6 cursor-pointer" />
        </Link>
      </div>
      <div className="hidden sm:block">
        <Link href="/settings">
          <HiAdjustmentsHorizontal className="w-6 h-6 cursor-pointer" />
        </Link>
      </div>
    </div>
  );
}
