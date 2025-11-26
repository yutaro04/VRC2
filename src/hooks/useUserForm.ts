/**
 * ユーザーフォームの状態管理フック
 */

import { useState, useMemo, useEffect } from 'react';
import type { UserFormData, User } from '@/types/user';

interface UseUserFormProps {
  initialUser?: User | null;
}

interface UseUserFormReturn {
  formData: UserFormData;
  handleInputChange: (field: keyof UserFormData, value: string) => void;
  setFormData: React.Dispatch<React.SetStateAction<UserFormData>>;
  resetForm: () => void;
}

export function useUserForm({ initialUser }: UseUserFormProps = {}): UseUserFormReturn {
  // 初期値をメモ化して、initialUserが変わった時のみ再計算
  const initialFormData = useMemo<UserFormData>(() => {
    if (initialUser) {
      return {
        nickname: initialUser.nickname,
        description: initialUser.description ?? '',
        email: initialUser.email ?? '',
        password: '', // 編集画面ではパスワードを空にする
      };
    }
    return {
      nickname: '',
      description: '',
      email: '',
      password: '',
    };
  }, [initialUser]);

  const [formData, setFormData] = useState<UserFormData>(initialFormData);

  // initialUserが変更されたらformDataを更新
  useEffect(() => {
    setFormData(initialFormData);
  }, [initialFormData]);

  const handleInputChange = (field: keyof UserFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    if (initialUser) {
      setFormData({
        nickname: initialUser.nickname,
        description: initialUser.description ?? '',
        email: initialUser.email ?? '',
        password: '',
      });
    }
  };

  return {
    formData,
    handleInputChange,
    setFormData,
    resetForm,
  };
}
