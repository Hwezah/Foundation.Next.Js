import Link from "next/link";
import { HiOutlineBellAlert } from "react-icons/hi2";
export default function Notifications() {
  return (
    <div>
      <Link href="#">
        <HiOutlineBellAlert className="w-6 h-6" />
      </Link>
    </div>
  );
}
