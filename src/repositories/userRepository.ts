/**
 * ユーザーリポジトリ層
 * データアクセスを担当（実際のDBとの接続部分）
 */

import type { User } from '@/types/user';
import { prisma } from '@/lib/prisma';

export interface UpdateUserData {
  nickname?: string;
  description?: string;
  email?: string;
  password?: string;
  avatar_image_url?: string;
}

/**
 * Prismaのユーザーオブジェクトをアプリケーション型に変換
 */
function mapPrismaUserToUser(prismaUser: {
  id: number;
  nickname: string;
  description: string | null;
  email: string | null;
  avatarUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}): User {
  return {
    id: prismaUser.id,
    nickname: prismaUser.nickname,
    description: prismaUser.description ?? undefined,
    email: prismaUser.email ?? undefined,
    avatar_image_url: prismaUser.avatarUrl ?? undefined,
    created_at: prismaUser.createdAt.toISOString(),
    updated_at: prismaUser.updatedAt.toISOString(),
  };
}

/**
 * ユーザーIDでユーザーを取得
 */
export async function findUserById(userId: number): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
      deletedAt: null, // 論理削除されていないユーザーのみ
    },
  });

  if (!user) {
    return null;
  }

  return mapPrismaUserToUser(user);
}

/**
 * ニックネームでユーザーを検索
 */
export async function findUserByNickname(nickname: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: {
      nickname,
      deletedAt: null, // 論理削除されていないユーザーのみ
    },
  });

  if (!user) {
    return null;
  }

  return mapPrismaUserToUser(user);
}

/**
 * ユーザー情報を更新
 */
export async function updateUserById(
  userId: number,
  data: UpdateUserData
): Promise<User> {
  const updateData: {
    nickname?: string;
    description?: string;
    email?: string;
    passwordHash?: string;
    avatarUrl?: string;
  } = {};

  if (data.nickname !== undefined) updateData.nickname = data.nickname;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.email !== undefined) updateData.email = data.email;
  if (data.password !== undefined) updateData.passwordHash = data.password;
  if (data.avatar_image_url !== undefined) updateData.avatarUrl = data.avatar_image_url;

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: updateData,
  });

  return mapPrismaUserToUser(updatedUser);
}
