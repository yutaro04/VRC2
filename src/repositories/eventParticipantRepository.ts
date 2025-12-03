import type { EventParticipant } from '@/types/event';
import { prisma } from '@/lib/prisma';
import { ParticipantStatus } from '@/generated/prisma/client';

/**
 * Prismaの参加者オブジェクトをアプリケーション型に変換
 */
function mapPrismaParticipantToEventParticipant(prismaParticipant: {
  id: number;
  eventId: number;
  userId: number;
  role: string;
  status: string;
  appliedAt: Date | null;
}): EventParticipant {
  return {
    id: prismaParticipant.id,
    event_id: prismaParticipant.eventId,
    user_id: prismaParticipant.userId,
    role: prismaParticipant.role as 'organizer' | 'participant',
    status: prismaParticipant.status as 'pending' | 'approved' | 'rejected' | 'cancelled',
    applied_at: prismaParticipant.appliedAt?.toISOString(),
  };
}

/**
 * イベントの参加者一覧を取得
 */
export async function findParticipantsByEventId(
  eventId: number,
  status?: ParticipantStatus
): Promise<EventParticipant[]> {
  const where = {
    eventId,
    deletedAt: null,
    ...(status ? { status } : {}),
  };

  const participants = await prisma.eventParticipant.findMany({
    where,
    orderBy: { appliedAt: 'desc' },
  });

  return participants.map(mapPrismaParticipantToEventParticipant);
}

/**
 * イベントに参加申請する
 */
export async function createParticipant(
  eventId: number,
  userId: number,
  role: string = 'participant'
): Promise<EventParticipant> {
  const participant = await prisma.eventParticipant.create({
    data: {
      eventId,
      userId,
      role,
      status: ParticipantStatus.PENDING,
    },
  });

  return mapPrismaParticipantToEventParticipant(participant);
}

/**
 * ユーザーが特定のイベントに既に参加申請しているか確認
 */
export async function findParticipantByEventAndUser(
  eventId: number,
  userId: number
): Promise<EventParticipant | null> {
  const participant = await prisma.eventParticipant.findFirst({
    where: {
      eventId,
      userId,
      deletedAt: null,
    },
  });

  if (!participant) {
    return null;
  }

  return mapPrismaParticipantToEventParticipant(participant);
}

/**
 * イベント参加をキャンセル（論理削除）
 */
export async function cancelParticipation(
  eventId: number,
  userId: number
): Promise<void> {
  await prisma.eventParticipant.updateMany({
    where: {
      eventId,
      userId,
      deletedAt: null,
    },
    data: {
      deletedAt: new Date(),
    },
  });
}

/**
 * 承認済み参加者の数を取得
 */
export async function countApprovedParticipants(eventId: number): Promise<number> {
  return await prisma.eventParticipant.count({
    where: {
      eventId,
      status: ParticipantStatus.APPROVED,
      deletedAt: null,
    },
  });
}
