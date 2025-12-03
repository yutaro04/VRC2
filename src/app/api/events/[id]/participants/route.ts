/**
 * イベント参加者管理APIコントローラー
 */

import { NextRequest } from 'next/server';
import * as eventRepository from '@/repositories/eventRepository';
import * as eventParticipantRepository from '@/repositories/eventParticipantRepository';
import { ParticipantStatus } from '@/generated/prisma/client';
import {
  successResponse,
  successResponseWithMessage,
  notFoundResponse,
  validationErrorResponse,
  conflictResponse,
  serverErrorResponse,
} from '@/lib/api/apiResponse';

/**
 * GET /api/events/[id]/participants
 * イベントの参加者一覧を取得
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const eventId = parseInt(id, 10);

    if (isNaN(eventId)) {
      return notFoundResponse('イベントが見つかりません');
    }

    // イベントの存在確認
    const event = await eventRepository.findEventById(eventId);
    if (!event) {
      return notFoundResponse('イベントが見つかりません');
    }

    const searchParams = request.nextUrl.searchParams;
    const statusParam = searchParams.get('status');
    const status = statusParam ? statusParam as ParticipantStatus : undefined;

    const participants = await eventParticipantRepository.findParticipantsByEventId(
      eventId,
      status
    );

    return successResponse(participants);
  } catch (error) {
    console.error('Error fetching event participants:', error);
    return serverErrorResponse('参加者一覧の取得に失敗しました');
  }
}

/**
 * POST /api/events/[id]/participants
 * イベントに参加申請する
 */
export async function POST(
  request: NextRequest,
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

    // イベントの存在確認
    const event = await eventRepository.findEventById(eventId);
    if (!event) {
      return notFoundResponse('イベントが見つかりません');
    }

    // 既に参加申請しているか確認
    const existingParticipant = await eventParticipantRepository.findParticipantByEventAndUser(
      eventId,
      userId
    );

    if (existingParticipant) {
      return conflictResponse('既にこのイベントに参加申請しています');
    }

    // 定員チェック
    if (event.max_participants_num) {
      const approvedCount = await eventParticipantRepository.countApprovedParticipants(eventId);
      if (approvedCount >= event.max_participants_num) {
        return validationErrorResponse([
          { field: 'event', message: 'このイベントは定員に達しています' },
        ]);
      }
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return validationErrorResponse([
        { field: 'body', message: 'Invalid JSON in request body' },
      ]);
    }
    const role = body.role || 'participant';

    // 参加申請を作成
    const participant = await eventParticipantRepository.createParticipant(
      eventId,
      userId,
      role
    );

    return successResponseWithMessage(
      participant,
      'イベントへの参加を申請しました',
      201
    );
  } catch (error) {
    console.error('Error applying to event:', error);
    return serverErrorResponse('イベント参加申請に失敗しました');
  }
}
