"use client";

import { LogIn } from "lucide-react";
import { SignInButton } from "@clerk/nextjs";

export default function Login() {
  return (
    <SignInButton mode="modal">
      <div className="flex items-center gap-2 cursor-pointer">
        <LogIn size={24} strokeWidth={2} />
        <span className="cursor-pointer">Login</span>
      </div>
    </SignInButton>
  );
}
