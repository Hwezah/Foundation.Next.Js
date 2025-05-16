import {
  HiAdjustmentsHorizontal,
  HiOutlineUser,
  HiOutlineHome,
  HiOutlineRectangleStack,
  HiOutlineVideoCamera,
  HiMiniPlus,
} from "react-icons/hi2";
import Link from "next/link";
export default function Footer() {
  return (
    <nav className="sm:hidden p-3 bg-[#01212c] mt-auto">
      <ul className="flex justify-between items-center">
        <li>
          <Link href="/home">
            <HiOutlineHome className="w-6 h-6" />
            {/* <span>Home</span> */}
          </Link>
        </li>
        <li>
          <FilePicker />
        </li>

        <li>
          <HiOutlineVideoCamera className="w-6 h-6" />
          {/* <span>Cabins</span> */}
        </li>

        <li>
          <Link href="#">
            <HiOutlineRectangleStack className="w-6 h-6" />
            {/* <span>Cabins</span> */}
          </Link>
        </li>
        <li>
          <Link href="#">
            <HiAdjustmentsHorizontal className="w-6 h-6" />

            {/* <span>Users</span> */}
          </Link>
        </li>
        <li>
          <Link href="/user">
            <HiOutlineUser className="w-6 h-6" />
            {/* <span>Settings</span> */}
          </Link>
        </li>
      </ul>
    </nav>
  );
}

function FilePicker() {
  return (
    <label className="cursor-pointer inline-flex items-center">
      <HiMiniPlus className="w-6 h-6 " />
      <input
        type="file"
        accept="video/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files[0];
          console.log("Picked file:", file);
        }}
      />
    </label>
  );
}
