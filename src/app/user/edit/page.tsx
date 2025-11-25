'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import UserProfileForm from '@/components/features/member/UserProfileForm';

interface UserData {
  nickname: string;
  description: string;
  email: string;
  password: string;
}

export default function UserEditPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<UserData>({
    nickname: '',
    description: '',
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/users/me');
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'ユーザー情報の取得に失敗しました');
        }

        setFormData({
          nickname: result.data.nickname,
          description: result.data.description,
          email: result.data.email,
          password: '', // 編集画面ではパスワードを空にする
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'エラーが発生しました');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (field: keyof UserData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const updateData: Partial<UserData> = {
        nickname: formData.nickname,
        description: formData.description,
        email: formData.email,
      };

      // パスワードが入力されている場合のみ送信
      if (formData.password && formData.password.trim() !== '') {
        updateData.password = formData.password;
      }

      const response = await fetch('/api/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.errors && Array.isArray(result.errors)) {
          const errorMessages = result.errors.map((err: { field: string; message: string }) => err.message).join('\n');
          throw new Error(errorMessages);
        }
        throw new Error(result.message || 'ユーザー情報の更新に失敗しました');
      }

      router.push('/user/profile');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">読み込み中...</div>
      </div>
    );
  }

  if (error && !formData.nickname) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  const actionButtons = (
    <>
      {error && (
        <div className="w-full text-red-600 text-sm mb-2">
          {error}
        </div>
      )}
      <button
        onClick={() => router.push('/user/profile')}
        className="px-4 py-2.5 bg-white border-2 border-gray-900 rounded-lg text-base font-normal text-gray-900 hover:bg-gray-50 transition-colors disabled:opacity-50"
        disabled={isSaving}
      >
        キャンセル
      </button>
      <button
        onClick={handleSave}
        className="px-4 py-2.5 bg-gray-900 border-2 border-gray-900 rounded-lg text-base font-normal text-white hover:bg-gray-800 transition-colors disabled:opacity-50"
        disabled={isSaving}
      >
        {isSaving ? '保存中...' : '保存'}
      </button>
    </>
  );

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
