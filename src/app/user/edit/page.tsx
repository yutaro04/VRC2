'use client';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import { useUserUpdate } from '@/hooks/useUserUpdate';
import { useUserForm } from '@/hooks/useUserForm';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import { EditActions } from '@/components/features/member/EditActions';
import UserProfileForm from '@/components/features/member/UserProfileForm';
import type { UpdateUserRequest } from '@/types/user';

export default function UserEditPage() {
  const router = useRouter();
  const { user, isLoading, error: fetchError } = useUser();
  const { updateUserData, isUpdating, error: updateError } = useUserUpdate();
  const { formData, handleInputChange } = useUserForm({ initialUser: user });

  const handleSave = async () => {
    try {
      const updateData: UpdateUserRequest = {
        nickname: formData.nickname,
        description: formData.description,
        email: formData.email,
      };

      // パスワードが入力されている場合のみ送信
      if (formData.password && formData.password.trim() !== '') {
        updateData.password = formData.password;
      }

      await updateUserData(updateData);
      router.push('/user/profile');
    } catch (err) {
      // エラーはuseUserUpdateフックで管理される
      console.error('Failed to update user:', err);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (fetchError || !user) {
    return <ErrorMessage message={fetchError || 'ユーザー情報が見つかりません'} />;
  }

  const actionButtons = <EditActions onSave={handleSave} isSaving={isUpdating} error={updateError} />;

  return (
    <UserProfileForm
      userData={formData}
      isEditing={true}
      title="プロフィール情報編集"
      onInputChange={handleInputChange}
      actionButtons={actionButtons}
    />
  );
}
