/**
 * ユーザー登録APIコントローラー
 */

import { NextRequest } from 'next/server';
import * as authRepository from '@/repositories/authRepository';
import { generateToken } from '@/lib/jwt';
import { validateRegisterData } from '@/lib/validators/authValidator';
import {
  successResponseWithMessage,
  validationErrorResponse,
  conflictResponse,
  serverErrorResponse,
} from '@/lib/api/apiResponse';

/**
 * POST /api/auth/register
 * 新規ユーザー登録
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // バリデーション
    const validationResult = validateRegisterData(body);
    if (!validationResult.isValid) {
      return validationErrorResponse(validationResult.errors);
    }

    // ニックネームの重複チェック
    const nicknameExists = await authRepository.isNicknameExists(body.nickname);
    if (nicknameExists) {
      return conflictResponse('このニックネームは既に使用されています');
    }

    // ユーザーを作成
    const user = await authRepository.createUser({
      nickname: body.nickname,
      password: body.password,
      email: body.email,
      description: body.description,
      avatar_image_url: body.avatar_image_url,
    });

    // JWTトークンを生成
    const token = generateToken({
      userId: user.id,
      nickname: user.nickname,
    });

    return successResponseWithMessage(
      {
        user,
        token,
      },
      'ユーザー登録が完了しました',
      201
    );
  } catch (error) {
    console.error('Error registering user:', error);
    return serverErrorResponse('ユーザー登録に失敗しました');
  }
}
