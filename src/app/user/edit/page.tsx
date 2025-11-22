'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import UserProfileForm from '@/components/features/member/UserProfileForm';

export default function UserEditPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nickname: 'VRChatユーザー',
    bio: 'VRChatで色々なイベントに参加しています。音楽イベントやアート展示が好きです。よろしくお願いします！',
    email: 'user@example.com',
    password: '********',
  });

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    console.log('保存:', formData);
    router.push('/user/profile');
  };

  const actionButtons = (
    <>
      <button
        onClick={() => router.push('/userDetail')}
        className="px-4 py-2.5 bg-white border-2 border-gray-900 rounded-lg text-base font-normal text-gray-900 hover:bg-gray-50 transition-colors"
      >
        キャンセル
      </button>
      <button
        onClick={handleSave}
        className="px-4 py-2.5 bg-gray-900 border-2 border-gray-900 rounded-lg text-base font-normal text-white hover:bg-gray-800 transition-colors"
      >
        保存
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
