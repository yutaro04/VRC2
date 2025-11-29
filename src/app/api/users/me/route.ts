/**
 * ユーザー情報取得・更新APIコントローラー
 * Controller層：HTTPリクエスト/レスポンスの処理を担当
 */

import { NextRequest } from 'next/server';
import { auth } from '@/auth';
import * as userService from '../_services/userService';
import {
  successResponse,
  successResponseWithMessage,
  notFoundResponse,
  conflictResponse,
  validationErrorResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from '@/lib/api/apiResponse';

/**
 * GET /api/users/me
 * 認証済みユーザーの情報を取得
 */
export async function GET() {
  try {
    // NextAuthセッションからユーザー情報を取得
    const session = await auth();

    if (!session?.user?.id) {
      return unauthorizedResponse('ログインが必要です');
    }

    const userId = parseInt(session.user.id, 10);

    const user = await userService.getUserById(userId);

    return successResponse(user);
  } catch (error) {
    console.error('Error fetching user data:', error);

    if (error instanceof userService.NotFoundException) {
      return notFoundResponse(error.message);
    }

    return serverErrorResponse('ユーザー情報の取得に失敗しました');
  }
}

/**
 * PUT /api/users/me
 * 認証済みユーザーの情報を更新
 */
export async function PUT(request: NextRequest) {
  try {
    // NextAuthセッションからユーザー情報を取得
    const session = await auth();

    if (!session?.user?.id) {
      return unauthorizedResponse('ログインが必要です');
    }

    const userId = parseInt(session.user.id, 10);

    const body = await request.json();

    // サービス層でバリデーションとビジネスロジックを実行
    const updatedUser = await userService.updateUser(userId, body);

    return successResponseWithMessage(
      updatedUser,
      'ユーザー情報を更新しました',
      200
    );
  } catch (error) {
    console.error('Error updating user data:', error);

    if (error instanceof userService.ValidationException) {
      return validationErrorResponse(error.errors);
    }

    if (error instanceof userService.NotFoundException) {
      return notFoundResponse(error.message);
    }

    if (error instanceof userService.ConflictException) {
      return conflictResponse(error.message);
    }

    return serverErrorResponse('ユーザー情報の更新に失敗しました');
  }
}
