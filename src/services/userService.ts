/**
 * ユーザー関連のAPIサービス
 */

import type { User, UpdateUserRequest, ApiResponse } from '@/types/user';

/**
 * 現在のユーザー情報を取得
 */
export async function getCurrentUser(): Promise<User> {
  const response = await fetch('/api/users/me');
  const result: ApiResponse<User> = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'ユーザー情報の取得に失敗しました');
  }

  if (!result.data) {
    throw new Error('ユーザー情報が見つかりません');
  }

  return result.data;
}

/**
 * ユーザー情報を更新
 */
export async function updateUser(data: UpdateUserRequest): Promise<User> {
  const response = await fetch('/api/users/me', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result: ApiResponse<User> = await response.json();

  if (!response.ok) {
    if (result.errors && Array.isArray(result.errors)) {
      const errorMessages = result.errors
        .map((err) => err.message)
        .join('\n');
      throw new Error(errorMessages);
    }
    throw new Error(result.message || 'ユーザー情報の更新に失敗しました');
  }

  if (!result.data) {
    throw new Error('更新されたユーザー情報が見つかりません');
  }

  return result.data;
}
