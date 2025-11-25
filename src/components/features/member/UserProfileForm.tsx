'use client';
import React from 'react';
import Image from 'next/image';

interface UserData {
  nickname: string;
  description: string;
  email: string;
  password: string;
}

interface UserProfileFormProps {
  userData: UserData;
  isEditing?: boolean;
  title?: string;
  onInputChange?: (field: keyof UserData, value: string) => void;
  headerButton?: React.ReactNode;
  actionButtons?: React.ReactNode;
}

const UserProfileForm: React.FC<UserProfileFormProps> = ({
  userData,
  isEditing = false,
  title = 'プロフィール情報',
  onInputChange,
  headerButton,
  actionButtons,
}) => {
  const handleInputChange = (field: keyof UserData, value: string) => {
    if (onInputChange) {
      onInputChange(field, value);
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="text-xs text-black absolute" style={{ transform: 'rotate(15deg)', top: '30%', left: '5%' }}>
          01001000 01000101 01001100 01001100 01001111
        </div>
        <div className="text-xs text-black absolute" style={{ transform: 'rotate(-10deg)', top: '60%', right: '10%' }}>
          01010110 01001001 01010010 01010100 01010101 01000001 01001100
        </div>
        <div className="text-xs text-black absolute" style={{ transform: 'rotate(5deg)', bottom: '20%', left: '15%' }}>
          01000101 01010110 01000101 01001110 01010100
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-8 py-32">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="mb-6">
            <h1 className="text-2xl font-medium text-gray-900 mb-1">{isEditing ? 'アカウント設定' : '会員詳細'}</h1>
            <p className="text-gray-600 text-base">
              {isEditing ? 'プロフィール情報の編集ができます' : 'プロフィール情報の確認と編集ができます'}
            </p>
          </div>

          {/* Profile Card */}
          <div className="bg-white border-2 border-gray-900 rounded-lg overflow-hidden">
            {/* Profile Header */}
            <div className="bg-gray-900 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <h2 className="text-white text-xl font-medium">{title}</h2>
              </div>
              {headerButton && headerButton}
            </div>

            {/* Profile Content */}
            <div className="p-6">
              {/* Avatar and Nickname Row */}
              <div className="flex items-center gap-6 border-b-2 border-gray-200 pb-6 mb-4">
                <div className="w-20 h-20 bg-gray-200 rounded-full border-4 border-gray-900 overflow-hidden flex-shrink-0">
                  <Image
                    src="/api/placeholder/80/80"
                    alt="プロフィール写真"
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-normal text-gray-600 mb-1">ニックネーム</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={userData.nickname}
                      onChange={e => handleInputChange('nickname', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border-2 border-gray-200 rounded text-base text-gray-900 focus:outline-none focus:border-gray-900"
                    />
                  ) : (
                    <div className="px-3.5 py-2.5 bg-gray-50 border-2 border-gray-200 rounded text-base text-gray-900">
                      {userData.nickname}
                    </div>
                  )}
                </div>
              </div>

              {/* Description Section */}
              <div className="mb-4">
                <label className="block text-sm font-normal text-gray-600 mb-1">自己紹介文</label>
                {isEditing ? (
                  <textarea
                    rows={3}
                    value={userData.description}
                    onChange={e => handleInputChange('description', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border-2 border-gray-200 rounded text-base text-gray-900 focus:outline-none focus:border-gray-900 resize-none"
                  />
                ) : (
                  <div className="px-3.5 py-2.5 bg-gray-50 border-2 border-gray-200 rounded text-base text-gray-900">
                    {userData.description}
                  </div>
                )}
              </div>

              {/* Email and Password Grid */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-normal text-gray-600 mb-1 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    メールアドレス
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={userData.email}
                      onChange={e => handleInputChange('email', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border-2 border-gray-200 rounded text-base text-gray-900 focus:outline-none focus:border-gray-900"
                    />
                  ) : (
                    <div className="px-3.5 py-2.5 bg-gray-50 border-2 border-gray-200 rounded text-base text-gray-900">
                      {userData.email}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-normal text-gray-600 mb-1 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    パスワード
                  </label>
                  {isEditing ? (
                    <input
                      type="password"
                      value={userData.password}
                      onChange={e => handleInputChange('password', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border-2 border-gray-200 rounded text-base text-gray-900 focus:outline-none focus:border-gray-900"
                    />
                  ) : (
                    <div className="px-3.5 py-2.5 bg-gray-50 border-2 border-gray-200 rounded text-base text-gray-900">
                      {userData.password}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {actionButtons && <div className="flex justify-end gap-4 mt-4">{actionButtons}</div>}
        </div>
      </div>
    </div>
  );
};

export default UserProfileForm;
