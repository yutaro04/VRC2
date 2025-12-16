"use client";

import { signIn } from "next-auth/react";

interface SignInDiscordButtonProps {
  callbackUrl?: string;
  className?: string;
}

export function SignInDiscordButton({
  callbackUrl = "/",
  className = "",
}: SignInDiscordButtonProps) {
  const handleSignIn = async () => {
    await signIn("discord", { callbackUrl });
  };

  return (
    <button
      onClick={handleSignIn}
      className={`w-full flex items-center justify-center gap-3 bg-[#5865F2] text-white rounded-lg px-6 py-3 font-medium hover:opacity-90 transition-colors ${className}`}
      aria-label="Discordでログイン"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <path fill="currentColor" d="M20.317 4.369a19.791 19.791 0 00-4.885-1.515.07.07 0 00-.074.037c-.211.375-.444.864-.608 1.249-1.844-.276-3.68-.276-5.486 0-.163-.391-.405-.874-.617-1.249a.07.07 0 00-.074-.037A19.736 19.736 0 003.68 4.369a.061.061 0 00-.028.021C.533 9.045-.32 13.579.066 18.057a.082.082 0 00.031.053 19.9 19.9 0 006.065 3.087.077.077 0 00.084-.027c.468-.644.888-1.323 1.248-2.038a.076.076 0 00-.041-.105 13.14 13.14 0 01-1.872-.891.073.073 0 01-.007-.118c.126-.094.252-.19.372-.291a.074.074 0 01.079-.01c3.927 1.81 8.18 1.809 12.061 0a.073.073 0 01.081.01c.12.101.246.197.373.291a.073.073 0 01-.006.118c-.592.385-1.222.72-1.873.892a.077.077 0 00-.04.106c.36.715.78 1.394 1.249 2.038a.077.077 0 00.084.027 19.902 19.902 0 006.064-3.087.077.077 0 00.032-.053c.5-5.177-.838-9.577-3.548-13.667a.061.061 0 00-.03-.02zM8.02 15.331c-1.182 0-2.157-1.085-2.157-2.419 0-1.333.955-2.418 2.157-2.418 1.22 0 2.195 1.096 2.157 2.419 0 1.333-.955 2.418-2.157 2.418zm7.974 0c-1.182 0-2.157-1.085-2.157-2.419 0-1.333.955-2.418 2.157-2.418 1.22 0 2.195 1.096 2.157 2.419 0 1.333-.937 2.418-2.157 2.418z" />
      </svg>
      <span>Discordでログイン</span>
    </button>
  );
}
