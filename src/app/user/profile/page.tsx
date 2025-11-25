'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import UserProfileForm from '@/components/features/member/UserProfileForm';

interface UserData {
  nickname: string;
  description: string;
  email: string;
  password: string;
}

export default function UserProfilePage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/users/me');
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'ユーザー情報の取得に失敗しました');
        }

        setUserData({
          nickname: result.data.nickname,
          description: result.data.description,
          email: result.data.email,
          password: '********', // パスワードは表示用にマスク
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'エラーが発生しました');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">読み込み中...</div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">{error || 'ユーザー情報が見つかりません'}</div>
      </div>
    );
  }

  const editButton = (
    <button
      onClick={() => router.push('/user/edit')}
      className="bg-white px-3 py-1.5 rounded border border-gray-900 text-sm font-normal text-gray-900 hover:bg-gray-50 transition-colors flex items-center gap-2"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
        />
      </svg>
      編集
    </button>
  );

  const actionButtons = (
    <>
      <button className="px-4 py-2.5 bg-white border-2 border-red-500 rounded-lg text-base font-normal text-red-500 hover:bg-red-50 transition-colors">
        ログアウト
      </button>
    </>
  );

  return (
    <UserProfileForm
      userData={userData}
      isEditing={false}
      title="プロフィール情報"
      headerButton={editButton}
      actionButtons={actionButtons}
    />
  );
}