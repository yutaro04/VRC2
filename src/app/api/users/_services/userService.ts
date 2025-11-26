/**
 * ユーザーサービス層
 * ビジネスロジックを担当
 */

import type { User } from '@/types/user';
import * as userRepository from '@/repositories/userRepository';
import * as authRepository from '@/repositories/authRepository';
import type { UpdateUserData } from '@/repositories/userRepository';
import { validateUpdateUserData } from '@/lib/validators/userValidator';
import type { ValidationError } from '@/lib/validators/userValidator';

/**
 * カスタムエラークラス
 */
export class ValidationException extends Error {
  constructor(
    public errors: ValidationError[],
    message: string = 'リクエストパラメータが不正です'
  ) {
    super(message);
    this.name = 'ValidationException';
  }
}

export class NotFoundException extends Error {
  constructor(message: string = 'リソースが見つかりません') {
    super(message);
    this.name = 'NotFoundException';
  }
}

export class ConflictException extends Error {
  constructor(message: string = '競合が発生しました') {
    super(message);
    this.name = 'ConflictException';
  }
}

/**
 * ユーザーIDでユーザー情報を取得
 */
export async function getUserById(userId: number): Promise<User> {
  const user = await userRepository.findUserById(userId);

  if (!user) {
    throw new NotFoundException('ユーザーが見つかりません');
  }

  return user;
}

/**
 * ユーザー情報を更新
 */
export async function updateUser(
  userId: number,
  data: unknown
): Promise<User> {
  // バリデーション
  const validationResult = validateUpdateUserData(data);
  if (!validationResult.isValid) {
    throw new ValidationException(validationResult.errors);
  }

  const updateData = data as UpdateUserData;

  // ユーザーの存在確認
  const currentUser = await userRepository.findUserById(userId);
  if (!currentUser) {
    throw new NotFoundException('ユーザーが見つかりません');
  }

  // ニックネームの重複チェック
  if (updateData.nickname && updateData.nickname !== currentUser.nickname) {
    const existingUser = await userRepository.findUserByNickname(updateData.nickname);
    if (existingUser) {
      throw new ConflictException('このニックネームは既に使用されています');
    }
  }

  // パスワードのハッシュ化
  if (updateData.password && updateData.password.length > 0) {
    updateData.password = await authRepository.hashPassword(updateData.password);
  } else {
    // パスワードが空の場合は更新しない
    delete updateData.password;
  }

  // ユーザー情報を更新
  const updatedUser = await userRepository.updateUserById(userId, updateData);

  return updatedUser;
}
