/**
 * イベント詳細取得APIコントローラー
 */

import * as eventRepository from '@/repositories/eventRepository';
import {
  successResponse,
  notFoundResponse,
  serverErrorResponse,
} from '@/lib/api/apiResponse';

/**
 * GET /api/events/[id]
 * イベント詳細を取得
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const eventId = parseInt(id, 10);

    if (isNaN(eventId)) {
      return notFoundResponse('イベントが見つかりません');
    }

    const event = await eventRepository.findEventById(eventId);

    if (!event) {
      return notFoundResponse('イベントが見つかりません');
    }

    return successResponse(event);
  } catch (error) {
    console.error('Error fetching event detail:', error);
    return serverErrorResponse('イベント詳細の取得に失敗しました');
  }
}
