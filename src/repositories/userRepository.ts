/**
 * ユーザーリポジトリ層
 * データアクセスを担当（実際のDBとの接続部分）
 */

import type { User } from '@/types/user';

// 仮のデータベース（実装時は実際のDBに接続）
const mockUser: User = {
  id: 1,
  nickname: 'VRChatユーザー(APIから呼び出し)',
  description: 'VRChatで色々なイベントに参加しています。音楽イベントやアート展示が好きです。よろしくお願いします！',
  email: 'user@example.com',
  avatar_image_url: '/api/placeholder/80/80',
  created_at: '2025-01-01T00:00:00+09:00',
  updated_at: '2025-01-01T00:00:00+09:00',
};

export interface UpdateUserData {
  nickname?: string;
  description?: string;
  email?: string;
  password?: string;
  avatar_image_url?: string;
}

/**
 * ユーザーIDでユーザーを取得
 */
export async function findUserById(userId: number): Promise<User | null> {
  // TODO: 実際のDB問い合わせに置き換え
  // const user = await db.user.findUnique({ where: { id: userId } });

  if (userId === mockUser.id) {
    return mockUser;
  }
  return null;
}

/**
 * ニックネームでユーザーを検索
 */
export async function findUserByNickname(nickname: string): Promise<User | null> {
  // TODO: 実際のDB問い合わせに置き換え
  // const user = await db.user.findUnique({ where: { nickname } });

  if (nickname === mockUser.nickname) {
    return mockUser;
  }
  return null;
}

/**
 * ユーザー情報を更新
 */
export async function updateUserById(
  userId: number,
  data: UpdateUserData
): Promise<User> {
  // TODO: 実際のDB更新処理に置き換え
  // const updatedUser = await db.user.update({
  //   where: { id: userId },
  //   data,
  // });

  const updatedUser: User = {
    ...mockUser,
    nickname: data.nickname ?? mockUser.nickname,
    description: data.description ?? mockUser.description,
    email: data.email ?? mockUser.email,
    avatar_image_url: data.avatar_image_url ?? mockUser.avatar_image_url,
    updated_at: new Date().toISOString(),
  };

  // モックデータを更新（実際のDBでは不要）
  Object.assign(mockUser, updatedUser);

  return updatedUser;
}

/**
 * パスワードをハッシュ化
 */
export async function hashPassword(password: string): Promise<string> {
  // TODO: 実際のハッシュ化処理に置き換え
  // const bcrypt = require('bcrypt');
  // return await bcrypt.hash(password, 10);

  // 仮実装
  return `hashed_${password}`;
}
