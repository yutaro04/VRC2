/**
 * API レスポンスヘルパー
 * 統一されたレスポンス形式を提供
 */

import { NextResponse } from 'next/server';
import type { ValidationError } from '@/lib/validators/userValidator';

interface ApiResponseOptions<T> {
  statusCode: number;
  message?: string;
  data?: T;
  errors?: ValidationError[];
}

/**
 * 成功レスポンスを生成
 */
export function successResponse<T>(data: T, statusCode: number = 200) {
  return NextResponse.json(
    {
      statusCode,
      data,
    },
    { status: statusCode }
  );
}

/**
 * 成功レスポンス（メッセージ付き）を生成
 */
export function successResponseWithMessage<T>(
  data: T,
  message: string,
  statusCode: number = 200
) {
  return NextResponse.json(
    {
      statusCode,
      message,
      data,
    },
    { status: statusCode }
  );
}

/**
 * エラーレスポンスを生成
 */
export function errorResponse(
  message: string,
  statusCode: number = 500,
  errors?: ValidationError[]
) {
  const response: ApiResponseOptions<never> = {
    statusCode,
    message,
  };

  if (errors && errors.length > 0) {
    response.errors = errors;
  }

  return NextResponse.json(response, { status: statusCode });
}

/**
 * バリデーションエラーレスポンス
 */
export function validationErrorResponse(errors: ValidationError[]) {
  return errorResponse('リクエストパラメータが不正です', 400, errors);
}

/**
 * 認証エラーレスポンス
 */
export function unauthorizedResponse(message: string = '認証が必要です') {
  return errorResponse(message, 401);
}

/**
 * 権限エラーレスポンス
 */
export function forbiddenResponse(message: string = '権限がありません') {
  return errorResponse(message, 403);
}

/**
 * 未検出エラーレスポンス
 */
export function notFoundResponse(message: string = 'リソースが見つかりません') {
  return errorResponse(message, 404);
}

/**
 * 競合エラーレスポンス
 */
export function conflictResponse(message: string = '競合が発生しました') {
  return errorResponse(message, 409);
}

/**
 * サーバーエラーレスポンス
 */
export function serverErrorResponse(message: string = 'サーバー内部エラーが発生しました') {
  return errorResponse(message, 500);
}
