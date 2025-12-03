import type { Event } from '@/types/event';
import { prisma } from '@/lib/prisma';
import { ParticipantStatus } from '@/generated/prisma/client';

/**
 * Prismaのイベントオブジェクトをアプリケーション型に変換
 */
function mapPrismaEventToEvent(prismaEvent: {
  id: number;
  title: string;
  description: string | null;
  deviceId: number;
  maxParticipantsNum: number | null;
  mainImageUrl: string;
  deadline: Date | null;
  createdAt: Date;
  updatedAt: Date;
  device: {
    id: number;
    name: string;
  };
  eventDates: {
    id: number;
    eventId: number;
    startDate: Date;
    endDate: Date;
  };
}): Event {
  return {
    id: prismaEvent.id,
    title: prismaEvent.title,
    description: prismaEvent.description ?? undefined,
    device_id: prismaEvent.deviceId,
    device_name: prismaEvent.device.name,
    max_participants_num: prismaEvent.maxParticipantsNum ?? undefined,
    main_image_url: prismaEvent.mainImageUrl,
    deadline: prismaEvent.deadline?.toISOString(),
    event_dates: [{
      id: prismaEvent.eventDates.id,
      event_id: prismaEvent.eventDates.eventId,
      start_date: prismaEvent.eventDates.startDate.toISOString(),
      end_date: prismaEvent.eventDates.endDate.toISOString(),
    }],
    created_at: prismaEvent.createdAt.toISOString(),
    updated_at: prismaEvent.updatedAt.toISOString(),
  };
}

/**
 * イベント一覧を取得
 */
export async function findEvents(params: {
  device_id?: number;
  limit?: number;
  offset?: number;
  sort?: 'newest' | 'upcoming';
}): Promise<{ events: Event[]; total: number }> {
  const { device_id, limit = 20, offset = 0, sort = 'newest' } = params;

  const where = {
    deletedAt: null,
    ...(device_id ? { deviceId: device_id } : {}),
  };

  if (sort === 'upcoming') {
    // 直近開催順: 各eventDateを個別のイベントとして展開
    const prismaEvents = await prisma.event.findMany({
      where,
      include: {
        device: true,
        eventDates: {
          where: { deletedAt: null },
          orderBy: { startDate: 'asc' },
        },
      },
    });

    // 各eventDateに対してイベントを展開
    const allEvents: Event[] = [];
    for (const event of prismaEvents) {
      for (const eventDate of event.eventDates) {
        allEvents.push(mapPrismaEventToEvent({
          ...event,
          eventDates: eventDate,
        }));
      }
    }

    // 開催日時でソート（現在時刻以降のものを優先）
    const now = new Date();
    const sortedEvents = allEvents
      .filter(event => new Date(event.event_dates[0].start_date) >= now)
      .sort((a, b) => 
        new Date(a.event_dates[0].start_date).getTime() - 
        new Date(b.event_dates[0].start_date).getTime()
      );

    // ページネーション適用
    const events = sortedEvents.slice(offset, offset + limit);
    const total = sortedEvents.length;

    return {
      events,
      total,
    };
  }

  // 新着順: 各イベントの最も近い開催日のみを取得
  const prismaEvents = await prisma.event.findMany({
    where,
    include: {
      device: true,
      eventDates: {
        where: { deletedAt: null },
        orderBy: { startDate: 'asc' },
        take: 1, // 最も近い開催日のみ取得
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // イベントを変換（eventDatesが空のものは除外）
  const allEvents: Event[] = [];
  for (const event of prismaEvents) {
    if (event.eventDates.length > 0) {
      allEvents.push(mapPrismaEventToEvent({
        ...event,
        eventDates: event.eventDates[0],
      }));
    }
  }

  // ページネーション適用
  const events = allEvents.slice(offset, offset + limit);
  const total = allEvents.length;

  return {
    events,
    total,
  };
}

/**
 * イベントIDでイベント詳細を取得
 */
export async function findEventById(eventId: number): Promise<Event | null> {
  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
      deletedAt: null,
    },
    include: {
      device: true,
      eventDates: {
        where: { deletedAt: null },
        orderBy: { startDate: 'asc' },
      },
    },
  });

  if (!event) {
    return null;
  }

  // 最初のeventDateを使用
  if (event.eventDates.length === 0) {
    return null;
  }

  return mapPrismaEventToEvent({
    ...event,
    eventDates: event.eventDates[0],
  });
}

/**
 * ユーザーが参加しているイベント一覧を取得
 */
export async function findEventsByUserId(
  userId: number,
  status?: ParticipantStatus
): Promise<Array<{ event: Event; participant_status: string; participant_role: string }>> {
  const where = {
    userId,
    deletedAt: null,
    ...(status ? { status } : {}),
  };

  const participants = await prisma.eventParticipant.findMany({
    where,
    include: {
      event: {
        include: {
          device: true,
          eventDates: {
            where: { deletedAt: null },
            orderBy: { startDate: 'asc' },
          },
        },
      },
    },
    orderBy: { appliedAt: 'desc' },
  });

  return participants
    .filter(p => p.event.deletedAt === null)
    .flatMap(p => 
      p.event.eventDates.map(eventDate => ({
        event: mapPrismaEventToEvent({
          ...p.event,
          eventDates: eventDate,
        }),
        participant_status: p.status,
        participant_role: p.role,
      }))
    );
}
