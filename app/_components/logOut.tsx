"use client";

import { SignOutButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  return (
    <SignOutButton>
      <Button>Logout</Button>
    </SignOutButton>
  );
}
