"use client";

import { signOut } from "next-auth/react";

interface SignOutButtonProps {
  children?: React.ReactNode;
  className?: string;
  callbackUrl?: string;
}

export function SignOutButton({
  children,
  className,
  callbackUrl = "/"
}: SignOutButtonProps) {
  const handleSignOut = async () => {
    await signOut({ callbackUrl });
  };

  return (
    <button onClick={handleSignOut} className={className}>
      {children || "ログアウト"}
    </button>
  );
}
