/**
 * ユーザー関連のバリデーション
 */

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

/**
 * ニックネームのバリデーション
 */
export function validateNickname(nickname: unknown): ValidationError | null {
  if (typeof nickname !== 'string' || nickname.length === 0) {
    return { field: 'nickname', message: 'ニックネームは必須です' };
  }
  if (nickname.length > 50) {
    return { field: 'nickname', message: 'ニックネームは50文字以内で入力してください' };
  }
  return null;
}

/**
 * 自己紹介文のバリデーション
 */
export function validateDescription(description: unknown): ValidationError | null {
  if (description === undefined) {
    return null; // オプションフィールド
  }
  if (typeof description !== 'string') {
    return { field: 'description', message: '自己紹介文は文字列で入力してください' };
  }
  if (description.length > 500) {
    return { field: 'description', message: '自己紹介文は500文字以内で入力してください' };
  }
  return null;
}

/**
 * メールアドレスのバリデーション
 */
export function validateEmail(email: unknown): ValidationError | null {
  if (typeof email !== 'string' || email.length === 0) {
    return { field: 'email', message: 'メールアドレスは必須です' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { field: 'email', message: '有効なメールアドレスを入力してください' };
  }
  return null;
}

/**
 * パスワードのバリデーション
 */
export function validatePassword(password: unknown): ValidationError | null {
  if (password === undefined) {
    return null; // オプションフィールド
  }
  if (typeof password !== 'string') {
    return { field: 'password', message: 'パスワードは文字列で入力してください' };
  }
  // 空文字列は許可（パスワード変更しない場合）
  if (password.length > 0 && password.length < 8) {
    return { field: 'password', message: 'パスワードは8文字以上で入力してください' };
  }
  return null;
}

/**
 * アバター画像URLのバリデーション
 */
export function validateAvatarImageUrl(avatarImageUrl: unknown): ValidationError | null {
  if (avatarImageUrl === undefined) {
    return null; // オプションフィールド
  }
  if (typeof avatarImageUrl !== 'string') {
    return { field: 'avatar_image_url', message: 'アバター画像URLは文字列で入力してください' };
  }
  return null;
}

/**
 * ユーザー更新データの総合バリデーション
 */
export function validateUpdateUserData(data: unknown): ValidationResult {
  const errors: ValidationError[] = [];

  if (typeof data !== 'object' || data === null) {
    return {
      isValid: false,
      errors: [{ field: 'body', message: 'リクエストボディが不正です' }],
    };
  }

  const body = data as Record<string, unknown>;

  // 各フィールドのバリデーション
  if (body.nickname !== undefined) {
    const error = validateNickname(body.nickname);
    if (error) errors.push(error);
  }

  if (body.description !== undefined) {
    const error = validateDescription(body.description);
    if (error) errors.push(error);
  }

  if (body.email !== undefined) {
    const error = validateEmail(body.email);
    if (error) errors.push(error);
  }

  if (body.password !== undefined) {
    const error = validatePassword(body.password);
    if (error) errors.push(error);
  }

  if (body.avatar_image_url !== undefined) {
    const error = validateAvatarImageUrl(body.avatar_image_url);
    if (error) errors.push(error);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
