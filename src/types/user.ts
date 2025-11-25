/**
 * ユーザー関連の型定義
 */

export interface User {
  id: number;
  nickname: string;
  description: string;
  email: string;
  avatar_image_url: string;
  created_at: string;
  updated_at: string;
}

export interface UserFormData {
  nickname: string;
  description: string;
  email: string;
  password: string;
}

export interface UpdateUserRequest {
  nickname?: string;
  description?: string;
  email?: string;
  password?: string;
  avatar_image_url?: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  message?: string;
  data?: T;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}
