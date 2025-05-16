import Notifications from "./Notifications";
import { HiOutlineUser } from "react-icons/hi";
import Link from "next/link";
import { MdOutlineCast } from "react-icons/md";
import { HiAdjustmentsHorizontal } from "react-icons/hi2";

// export default function UserDashboard() {
//   return (
//     <div className="flex justify-between gap-4 hidden">
//       <Notifications />
//       <User />
//       <Settings />
//     </div>
//   );
// }

export default function UserDashboard() {
  return (
    <div
      // className={`flex justify-between gap-4 ${
      //   showSearch ? "hidden sm:block" : "block"
      // } `}

      className="flex justify-between gap-4"
    >
      <div>
        <Link href="/user">
          <MdOutlineCast className="w-6 h-6" />
        </Link>
      </div>
      <Notifications />
      <div className="hidden sm:block">
        <Link href="/user">
          <HiOutlineUser className="w-6 h-6" />
        </Link>
      </div>
      <div className="hidden sm:block">
        <Link href="/user">
          <HiAdjustmentsHorizontal className="w-6 h-6" />
        </Link>
      </div>
    </div>
  );
}
