/**
 * イベント一覧取得APIコントローラー
 */

import { NextRequest } from 'next/server';
import * as eventRepository from '@/repositories/eventRepository';
import {
  successResponse,
  validationErrorResponse,
  serverErrorResponse,
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

    // パラメータのバリデーション
    const parsedParams: {
      device_id?: number;
      limit?: number;
      offset?: number;
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

    const { events, total } = await eventRepository.findEvents(parsedParams);

    return successResponse({ events, total });
  } catch (error) {
    console.error('Error fetching events:', error);
    return serverErrorResponse('イベント一覧の取得に失敗しました');
  }
}
