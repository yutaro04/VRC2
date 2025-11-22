'use client';
import { useRouter } from 'next/navigation';
import UserProfileForm from '@/components/features/member/UserProfileForm';

export default function UserProfilePage() {
  const router = useRouter();
  const userData = {
    nickname: 'VRChatユーザー',
    bio: 'VRChatで色々なイベントに参加しています。音楽イベントやアート展示が好きです。よろしくお願いします！',
    email: 'user@example.com',
    password: '********',
  };

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