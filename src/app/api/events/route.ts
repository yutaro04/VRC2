/**
 * イベント一覧取得・作成APIコントローラー
 */

import { NextRequest } from 'next/server';
import { auth } from '@/auth';
import * as eventRepository from '@/repositories/eventRepository';
import {
  successResponse,
  validationErrorResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from '@/lib/api/apiResponse';

/**
 * GET /api/events
 * イベント一覧を取得
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const device_id = searchParams.get('device_id');
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');
    const sort = searchParams.get('sort');

    // パラメータのバリデーション
    const parsedParams: {
      device_id?: number;
      limit?: number;
      offset?: number;
      sort?: 'newest' | 'upcoming';
    } = {};

    if (device_id) {
      const deviceIdNum = parseInt(device_id, 10);
      if (isNaN(deviceIdNum) || deviceIdNum < 1) {
        return validationErrorResponse([
          { field: 'device_id', message: 'device_idは正の整数である必要があります' },
        ]);
      }
      parsedParams.device_id = deviceIdNum;
    }

    if (limit) {
      const limitNum = parseInt(limit, 10);
      if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
        return validationErrorResponse([
          { field: 'limit', message: 'limitは1から100の間である必要があります' },
        ]);
      }
      parsedParams.limit = limitNum;
    }

    if (offset) {
      const offsetNum = parseInt(offset, 10);
      if (isNaN(offsetNum) || offsetNum < 0) {
        return validationErrorResponse([
          { field: 'offset', message: 'offsetは0以上である必要があります' },
        ]);
      }
      parsedParams.offset = offsetNum;
    }

    if (sort) {
      if (sort !== 'newest' && sort !== 'upcoming') {
        return validationErrorResponse([
          { field: 'sort', message: 'sortは"newest"または"upcoming"である必要があります' },
        ]);
      }
      parsedParams.sort = sort;
    }

    const { events, total } = await eventRepository.findEvents(parsedParams);

    return successResponse({ events, total });
  } catch (error) {
    console.error('Error fetching events:', error);
    return serverErrorResponse('イベント一覧の取得に失敗しました');
  }
}

/**
 * POST /api/events
 * イベントを作成
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return unauthorizedResponse('ログインが必要です');
    }

    const userId = parseInt(session.user.id, 10);
    if (isNaN(userId)) {
      return unauthorizedResponse('無効なユーザーIDです');
    }

    const body = await request.json();

    // バリデーション
    const errors: Array<{ field: string; message: string }> = [];

    if (!body.title || typeof body.title !== 'string' || body.title.trim().length === 0) {
      errors.push({ field: 'title', message: 'イベントタイトルは必須です' });
    } else if (body.title.length > 100) {
      errors.push({ field: 'title', message: 'イベントタイトルは100文字以内である必要があります' });
    }

    if (body.description && typeof body.description !== 'string') {
      errors.push({ field: 'description', message: '説明は文字列である必要があります' });
    }

    if (!body.device_id || typeof body.device_id !== 'number' || body.device_id < 1) {
      errors.push({ field: 'device_id', message: '有効なデバイスIDが必要です' });
    }

    if (!body.main_image_url || typeof body.main_image_url !== 'string') {
      errors.push({ field: 'main_image_url', message: 'イベント画像は必須です' });
    }

    if (!body.start_date || typeof body.start_date !== 'string') {
      errors.push({ field: 'start_date', message: '開催日時は必須です' });
    } else {
      const startDate = new Date(body.start_date);
      if (isNaN(startDate.getTime())) {
        errors.push({ field: 'start_date', message: '開催日時の形式が正しくありません' });
      }
    }

    if (!body.end_date || typeof body.end_date !== 'string') {
      errors.push({ field: 'end_date', message: '終了日時は必須です' });
    } else {
      const endDate = new Date(body.end_date);
      if (isNaN(endDate.getTime())) {
        errors.push({ field: 'end_date', message: '終了日時の形式が正しくありません' });
      } else if (body.start_date) {
        const startDate = new Date(body.start_date);
        if (!isNaN(startDate.getTime()) && endDate <= startDate) {
          errors.push({ field: 'end_date', message: '終了日時は開始日時より後である必要があります' });
        }
      }
    }

    if (body.max_participants_num !== undefined && body.max_participants_num !== null) {
      if (typeof body.max_participants_num !== 'number' || body.max_participants_num < 1) {
        errors.push({ field: 'max_participants_num', message: '参加人数上限は1以上である必要があります' });
      }
    }

    if (errors.length > 0) {
      return validationErrorResponse(errors);
    }

    // イベント作成
    const event = await eventRepository.createEvent({
      title: body.title.trim(),
      description: body.description?.trim(),
      device_id: body.device_id,
      main_image_url: body.main_image_url,
      start_date: body.start_date,
      end_date: body.end_date,
      max_participants_num: body.max_participants_num,
      deadline: body.deadline,
      user_id: userId,
    });

    return successResponse(event, 201);
  } catch (error) {
    console.error('Error creating event:', error);
    return serverErrorResponse('イベントの作成に失敗しました');
  }
}
