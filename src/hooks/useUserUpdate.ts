/**
 * ユーザー情報更新を管理するカスタムフック
 */

import { useState } from 'react';
import { updateUser } from '@/services/userService';
import type { UpdateUserRequest, User } from '@/types/user';

interface UseUserUpdateReturn {
  updateUserData: (data: UpdateUserRequest) => Promise<User>;
  isUpdating: boolean;
  error: string | null;
  clearError: () => void;
}

export function useUserUpdate(): UseUserUpdateReturn {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateUserData = async (data: UpdateUserRequest): Promise<User> => {
    try {
      setIsUpdating(true);
      setError(null);
      const updatedUser = await updateUser(data);
      return updatedUser;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'エラーが発生しました';
      setError(errorMessage);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    updateUserData,
    isUpdating,
    error,
    clearError,
  };
}
