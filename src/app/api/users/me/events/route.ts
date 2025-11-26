/**
 * ユーザーの参加イベント一覧取得APIコントローラー
 */

import { NextRequest } from 'next/server';
import * as eventRepository from '@/repositories/eventRepository';
import {
  successResponse,
  serverErrorResponse,
} from '@/lib/api/apiResponse';

/**
 * GET /api/users/me/events
 * 自分が参加申請した（または参加確定した）イベント一覧を取得
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: 実際の認証チェックを実装
    // const token = request.headers.get('authorization');
    // if (!token) {
    //   return unauthorizedResponse();
    // }

    // TODO: JWTトークンからユーザーIDを取得
    // const userId = verifyToken(token);

    // 仮のユーザーID（実装時はトークンから取得）
    const userId = 16;

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') ?? undefined;

    const results = await eventRepository.findEventsByUserId(userId, status);

    // レスポンス形式を整形
    const data = results.map(result => ({
      participant: {
        event_id: result.event.id,
        user_id: userId,
        role: result.participant_role,
        status: result.participant_status,
      },
      event: result.event,
    }));

    return successResponse(data);
  } catch (error) {
    console.error('Error fetching user events:', error);
    return serverErrorResponse('参加イベント一覧の取得に失敗しました');
  }
}
