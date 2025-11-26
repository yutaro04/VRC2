/**
 * イベント参加キャンセルAPIコントローラー
 */

import * as eventParticipantRepository from '@/repositories/eventParticipantRepository';
import {
  successResponseWithMessage,
  notFoundResponse,
  serverErrorResponse,
} from '@/lib/api/apiResponse';

/**
 * DELETE /api/events/[id]/participants/me
 * イベント参加をキャンセル
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const eventId = parseInt(id, 10);

    if (isNaN(eventId)) {
      return notFoundResponse('イベントが見つかりません');
    }

    // 参加申請の存在確認
    const participant = await eventParticipantRepository.findParticipantByEventAndUser(
      eventId,
      userId
    );

    if (!participant) {
      return notFoundResponse('参加申請が見つかりません');
    }

    // 参加をキャンセル（論理削除）
    await eventParticipantRepository.cancelParticipation(eventId, userId);

    return successResponseWithMessage(null, 'イベント参加をキャンセルしました', 200);
  } catch (error) {
    console.error('Error canceling event participation:', error);
    return serverErrorResponse('イベント参加のキャンセルに失敗しました');
  }
}
