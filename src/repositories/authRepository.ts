/**
 * 認証リポジトリ層
 * データアクセスを担当
 */

import type { User } from '@/types/user';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

/**
 * パスワードをハッシュ化
 */
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

/**
 * Prismaのユーザーオブジェクトをアプリケーション型に変換
 */
function mapPrismaUserToUser(prismaUser: {
  id: number;
  nickname: string;
  description: string | null;
  email: string | null;
  avatarImageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}): User {
  return {
    id: prismaUser.id,
    nickname: prismaUser.nickname,
    description: prismaUser.description ?? undefined,
    email: prismaUser.email ?? undefined,
    avatar_image_url: prismaUser.avatarImageUrl ?? undefined,
    created_at: prismaUser.createdAt.toISOString(),
    updated_at: prismaUser.updatedAt.toISOString(),
  };
}

export interface CreateUserData {
  nickname: string;
  password: string;
  email?: string;
  description?: string;
  avatar_image_url?: string;
}

/**
 * 新規ユーザーを作成
 */
export async function createUser(data: CreateUserData): Promise<User> {
  const passwordHash = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      nickname: data.nickname,
      passwordHash,
      email: data.email,
      description: data.description,
      avatarImageUrl: data.avatar_image_url,
    },
  });

  return mapPrismaUserToUser(user);
}

/**
 * ニックネームでユーザーを検索（パスワードハッシュ付き）
 */
export async function findUserByNicknameWithPassword(nickname: string): Promise<{
  user: User;
  passwordHash: string;
} | null> {
  const user = await prisma.user.findUnique({
    where: {
      nickname,
      deletedAt: null,
    },
  });

  if (!user || !user.passwordHash) {
    return null;
  }

  return {
    user: mapPrismaUserToUser(user),
    passwordHash: user.passwordHash,
  };
}

/**
 * パスワードを検証
 */
export async function verifyPassword(
  password: string,
  passwordHash: string
): Promise<boolean> {
  return await bcrypt.compare(password, passwordHash);
}

/**
 * ニックネームが既に使用されているか確認
 */
export async function isNicknameExists(nickname: string): Promise<boolean> {
  const count = await prisma.user.count({
    where: {
      nickname,
      deletedAt: null,
    },
  });

  return count > 0;
}
