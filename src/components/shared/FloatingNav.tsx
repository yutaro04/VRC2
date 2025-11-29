"use client";

import Link from "next/link";
import { Home, Search, Calendar, User, Plus, LogIn } from "lucide-react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { CldImage } from "next-cloudinary";
import ROUTES from "../../lib/routes";

interface UserStats {
  participating: number;
  hosting: number;
}

interface UserData {
  id: number;
  nickname: string;
  avatar_image_url?: string;
}

export function FloatingNav() {
  const [isAtTop, setIsAtTop] = useState(true);
  const [stats, setStats] = useState<UserStats>({ participating: 0, hosting: 0 });
  const [userData, setUserData] = useState<UserData | null>(null);
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const isLoggedIn = !!session;

  useEffect(() => {
    const handleScroll = () => {
      setIsAtTop(window.scrollY < 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      // Fetch user data
      fetch('/api/users/me')
        .then(res => res.json())
        .then(data => {
          if (data.data) {
            setUserData(data.data);
          }
        })
        .catch(err => console.error('Failed to fetch user data:', err));

      // Fetch user stats
      fetch('/api/users/me/stats')
        .then(res => res.json())
        .then(data => {
          if (data.data) {
            setStats(data.data);
          }
        })
        .catch(err => console.error('Failed to fetch user stats:', err));
    }
  }, [isLoggedIn]);

  return (
    <nav className="fixed bottom-0 left-0 right-0 lg:bottom-auto lg:top-6 lg:left-auto lg:right-6 z-50 px-4 pb-4 lg:p-0">
      <div className="bg-white border-2 border-gray-900 lg:rounded-2xl rounded-2xl shadow-lg px-2 py-3 lg:px-3 lg:py-2 flex flex-col items-center gap-3">
        {/* Top Section - Desktop: User + Nav, Mobile: Nav only */}
        <div className="flex items-center justify-around lg:justify-start w-full gap-1">
          {/* User Info Section - Desktop Only */}
          {!isLoading && (
            <>
              {isLoggedIn ? (
                <div className="hidden lg:flex items-center gap-2 pr-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-gray-900 overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {userData?.avatar_image_url ? (
                      // Cloudinaryの画像かどうかを判定
                      userData.avatar_image_url.startsWith('http') ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={userData.avatar_image_url}
                          alt={userData.nickname}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <CldImage
                          src={userData.avatar_image_url}
                          alt={userData.nickname}
                          width={32}
                          height={32}
                          crop="fill"
                          gravity="face"
                          className="w-full h-full object-cover"
                        />
                      )
                    ) : (
                      <User className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-900 whitespace-nowrap">
                      {userData?.nickname || "ユーザー"}
                    </span>
                  </div>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hidden lg:flex items-center gap-2 pr-2 px-3 py-1.5 rounded-lg bg-gray-900 hover:bg-gray-700 transition-colors"
                >
                  <LogIn className="w-4 h-4 text-white" />
                  <span className="text-xs text-white font-medium whitespace-nowrap">ログイン</span>
                </Link>
              )}
              <div className="hidden lg:block w-px h-8 bg-gray-300" />
            </>
          )}
          
          {/* Navigation Icons */}
          <div className="flex items-center justify-around lg:justify-start w-full lg:w-auto gap-0 lg:gap-1 lg:pl-1">
            <Link href={ROUTES.HOME} className="p-2.5 rounded-full hover:bg-gray-100 transition-colors flex flex-col items-center gap-1 lg:flex-row" aria-label="Home">
              <Home className="w-5 h-5 lg:w-4 lg:h-4 text-gray-900" />
              <span className="text-xs lg:hidden text-gray-900">ホーム</span>
            </Link>
            <Link href={ROUTES.EVENT_SEARCH} className="p-2.5 rounded-full hover:bg-gray-100 transition-colors flex flex-col items-center gap-1 lg:flex-row" aria-label="Search">
              <Search className="w-5 h-5 lg:w-4 lg:h-4 text-gray-900" />
              <span className="text-xs lg:hidden text-gray-900">検索</span>
            </Link>
            {isLoggedIn && (
              <Link href={ROUTES.USER_EVENTS} className="p-2.5 rounded-full hover:bg-gray-100 transition-colors flex flex-col items-center gap-1 lg:flex-row" aria-label="Events">
                <Calendar className="w-5 h-5 lg:w-4 lg:h-4 text-gray-900" />
                <span className="text-xs lg:hidden text-gray-900">イベント</span>
              </Link>
            )}
            {isLoggedIn ? (
              <Link href={ROUTES.USER_PROFILE} className="p-2.5 rounded-full hover:bg-gray-100 transition-colors flex flex-col items-center gap-1 lg:flex-row" aria-label="Profile">
                <User className="w-5 h-5 lg:w-4 lg:h-4 text-gray-900" />
                <span className="text-xs lg:hidden text-gray-900">プロフィール</span>
              </Link>
            ) : (
              <Link href="/login" className="p-2.5 rounded-full hover:bg-gray-100 transition-colors flex flex-col items-center gap-1 lg:flex-row" aria-label="Login">
                <LogIn className="w-5 h-5 lg:w-4 lg:h-4 text-gray-900" />
                <span className="text-xs lg:hidden text-gray-900">ログイン</span>
              </Link>
            )}
            
            <div className="hidden lg:block w-px h-6 bg-gray-300 mx-1" />
            
            <Link href={ROUTES.EVENT_CREATE} className="p-2.5 rounded-full bg-gray-900 hover:bg-gray-700 transition-colors flex flex-col items-center gap-1 lg:flex-row" aria-label="Create Event">
              <Plus className="w-5 h-5 lg:w-4 lg:h-4 text-white" />
              <span className="text-xs lg:hidden text-white">投稿</span>
            </Link>
          </div>
        </div>

        {/* Stats Section - Desktop */}
        {isAtTop && isLoggedIn && (
          <div className="hidden lg:flex w-full items-center gap-2 pt-2 border-t border-gray-200 transition-all duration-300">
            <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs text-gray-500">参加予定</span>
                <span className="font-bold text-sm text-gray-900">{stats.participating}件</span>
              </div>
            </div>
            <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
                <Plus className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs text-gray-500">開催予定</span>
                <span className="font-bold text-sm text-gray-900">{stats.hosting}件</span>
              </div>
            </div>
          </div>
        )}

        {/* Stats Section - Mobile Only */}
        {isLoggedIn && (
        <div className="lg:hidden w-full px-2 pt-2 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs text-gray-500">参加予定</span>
                <span className="font-bold text-sm text-gray-900">{stats.participating}件</span>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
                <Plus className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs text-gray-500">開催予定</span>
                <span className="font-bold text-sm text-gray-900">{stats.hosting}件</span>
              </div>
            </div>
          </div>
        </div>
        )}
      </div>
    </nav>
  );
}