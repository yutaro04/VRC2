'use client';
import { useUser } from '@/hooks/useUser';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import { ProfileActions } from '@/components/features/member/ProfileActions';
import UserProfileForm from '@/components/features/member/UserProfileForm';
import { SignOutButton } from '@/components/auth/SignOutButton';
import type { UserFormData } from '@/types/user';

export default function UserProfilePage() {
  const { user, isLoading, error } = useUser();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !user) {
    return <ErrorMessage message={error || 'ユーザー情報が見つかりません'} />;
  }

  const userData: UserFormData = {
    nickname: user.nickname,
    description: user.description ?? '',
    email: user.email ?? '',
    password: '********', // パスワードは表示用にマスク
    avatar_image_url: user.avatar_image_url,
  };

  const { headerButton } = ProfileActions({});

  return (
    <UserProfileForm
      userData={userData}
      isEditing={false}
      title="プロフィール情報"
      headerButton={headerButton}
      actionButtons={
        <SignOutButton className="w-full px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors border-2 border-gray-900">
          ログアウト
        </SignOutButton>
      }
    />
  );
}
