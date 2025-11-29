import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { SignInButton } from "@/components/auth/SignInButton";
import ROUTES from "@/lib/routes";

export default async function LoginPage() {
  const session = await auth();

  // すでにログイン済みの場合はホームにリダイレクト
  if (session) {
    redirect(ROUTES.HOME);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white border-2 border-gray-900 rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              VRChat Calendar
            </h1>
            <p className="text-gray-600">
              イベントを探して、楽しい時間を過ごしましょう
            </p>
          </div>

          <div className="space-y-4">
            <SignInButton />

            <div className="text-center text-sm text-gray-500 mt-6">
              ログインすることで、利用規約とプライバシーポリシーに同意したものとみなされます。
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
