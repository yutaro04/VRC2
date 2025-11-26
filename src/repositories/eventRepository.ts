import type { Event } from '@/types/event';
import { prisma } from '@/lib/prisma';

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
  }[];
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
    event_dates: prismaEvent.eventDates.map(date => ({
      id: date.id,
      event_id: date.eventId,
      start_date: date.startDate.toISOString(),
      end_date: date.endDate.toISOString(),
    })),
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
}): Promise<{ events: Event[]; total: number }> {
  const { device_id, limit = 20, offset = 0 } = params;

  const where = {
    deletedAt: null,
    ...(device_id ? { deviceId: device_id } : {}),
  };

  const [events, total] = await Promise.all([
    prisma.event.findMany({
      where,
      include: {
        device: true,
        eventDates: {
          where: { deletedAt: null },
          orderBy: { startDate: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    }),
    prisma.event.count({ where }),
  ]);

  return {
    events: events.map(mapPrismaEventToEvent),
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

  return mapPrismaEventToEvent(event);
}

/**
 * ユーザーが参加しているイベント一覧を取得
 */
export async function findEventsByUserId(
  userId: number,
  status?: string
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
    .map(p => ({
      event: mapPrismaEventToEvent(p.event),
      participant_status: p.status,
      participant_role: p.role,
    }));
}
