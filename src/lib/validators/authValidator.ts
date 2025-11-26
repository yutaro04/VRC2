/**
 * 認証用バリデーター
 */

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface RegisterData {
  nickname: string;
  password: string;
  email?: string;
  description?: string;
  avatar_image_url?: string;
}

export interface LoginData {
  nickname: string;
  password: string;
}

/**
 * ユーザー登録データをバリデーション
 */
export function validateRegisterData(data: unknown): ValidationResult {
  const errors: ValidationError[] = [];

  if (typeof data !== 'object' || data === null) {
    return { isValid: false, errors: [{ field: 'body', message: 'リクエストボディが不正です' }] };
  }

  const registerData = data as Partial<RegisterData>;

  // nickname必須チェック
  if (!registerData.nickname) {
    errors.push({ field: 'nickname', message: 'ニックネームは必須です' });
  } else if (typeof registerData.nickname !== 'string') {
    errors.push({ field: 'nickname', message: 'ニックネームは文字列である必要があります' });
  } else if (registerData.nickname.length < 1 || registerData.nickname.length > 50) {
    errors.push({ field: 'nickname', message: 'ニックネームは1文字以上50文字以内である必要があります' });
  }

  // password必須チェック
  if (!registerData.password) {
    errors.push({ field: 'password', message: 'パスワードは必須です' });
  } else if (typeof registerData.password !== 'string') {
    errors.push({ field: 'password', message: 'パスワードは文字列である必要があります' });
  } else if (registerData.password.length < 8) {
    errors.push({ field: 'password', message: 'パスワードは8文字以上である必要があります' });
  }

  // emailオプショナルチェック
  if (registerData.email !== undefined) {
    if (typeof registerData.email !== 'string') {
      errors.push({ field: 'email', message: 'メールアドレスは文字列である必要があります' });
    } else if (registerData.email && !isValidEmail(registerData.email)) {
      errors.push({ field: 'email', message: 'メールアドレスの形式が不正です' });
    }
  }

  // descriptionオプショナルチェック
  if (registerData.description !== undefined && typeof registerData.description !== 'string') {
    errors.push({ field: 'description', message: '自己紹介は文字列である必要があります' });
  }

  // avatar_image_urlオプショナルチェック
  if (registerData.avatar_image_url !== undefined && typeof registerData.avatar_image_url !== 'string') {
    errors.push({ field: 'avatar_image_url', message: 'アバター画像URLは文字列である必要があります' });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * ログインデータをバリデーション
 */
export function validateLoginData(data: unknown): ValidationResult {
  const errors: ValidationError[] = [];

  if (typeof data !== 'object' || data === null) {
    return { isValid: false, errors: [{ field: 'body', message: 'リクエストボディが不正です' }] };
  }

  const loginData = data as Partial<LoginData>;

  // nickname必須チェック
  if (!loginData.nickname) {
    errors.push({ field: 'nickname', message: 'ニックネームは必須です' });
  } else if (typeof loginData.nickname !== 'string') {
    errors.push({ field: 'nickname', message: 'ニックネームは文字列である必要があります' });
  }

  // password必須チェック
  if (!loginData.password) {
    errors.push({ field: 'password', message: 'パスワードは必須です' });
  } else if (typeof loginData.password !== 'string') {
    errors.push({ field: 'password', message: 'パスワードは文字列である必要があります' });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * メールアドレスの形式チェック
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
