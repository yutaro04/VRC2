/**
 * ログインAPIコントローラー
 */

import { NextRequest } from 'next/server';
import * as authRepository from '@/repositories/authRepository';
import { generateToken } from '@/lib/jwt';
import { validateLoginData } from '@/lib/validators/authValidator';
import {
  successResponseWithMessage,
  validationErrorResponse,
  serverErrorResponse,
} from '@/lib/api/apiResponse';
import { NextResponse } from 'next/server';

/**
 * POST /api/auth/login
 * ユーザーログイン
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // バリデーション
    const validationResult = validateLoginData(body);
    if (!validationResult.isValid) {
      return validationErrorResponse(validationResult.errors);
    }

    // ユーザーを検索
    const result = await authRepository.findUserByNicknameWithPassword(body.nickname);
    if (!result) {
      return NextResponse.json(
        {
          statusCode: 401,
          message: 'ニックネームまたはパスワードが正しくありません',
        },
        { status: 401 }
      );
    }

    // パスワードを検証
    const isValidPassword = await authRepository.verifyPassword(
      body.password,
      result.passwordHash
    );

    if (!isValidPassword) {
      return NextResponse.json(
        {
          statusCode: 401,
          message: 'ニックネームまたはパスワードが正しくありません',
        },
        { status: 401 }
      );
    }

    // JWTトークンを生成
    const token = generateToken({
      userId: result.user.id,
      nickname: result.user.nickname,
    });

    return successResponseWithMessage(
      {
        user: result.user,
        token,
      },
      'ログインしました',
      200
    );
  } catch (error) {
    console.error('Error logging in:', error);
    return serverErrorResponse('ログインに失敗しました');
  }
}
