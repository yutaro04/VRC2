import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("🌱 Starting seed...");

  // テーブルのクリーンアップ（外部キー制約を考慮した順序）
  await prisma.eventParticipant.deleteMany();
  await prisma.eventDate.deleteMany();
  await prisma.event.deleteMany();
  await prisma.device.deleteMany();
  await prisma.user.deleteMany();

  console.log("✨ Existing data cleared");

  // Usersテーブルにデータを作成
  const users = await Promise.all([
    prisma.user.create({
      data: {
        nickname: "VRChatユーザー1",
        description: "VRChatで色々なイベントに参加しています。音楽イベントやアート展示が好きです。",
        email: "user1@example.com",
        avatarImageUrl: "/api/placeholder/80/80",
        passwordHash: "hashed_password_1",
      },
    }),
    prisma.user.create({
      data: {
        nickname: "VRChatユーザー2",
        description: "VRChatでワールド探索やダンスイベントに参加するのが好きです。",
        email: "user2@example.com",
        avatarImageUrl: "/api/placeholder/80/80",
        passwordHash: "hashed_password_2",
      },
    }),
    prisma.user.create({
      data: {
        nickname: "イベントオーガナイザー",
        description: "VRChatでイベントを企画・運営しています。みんなで楽しめるイベントを作りたい!",
        email: "organizer@example.com",
        avatarImageUrl: "/api/placeholder/80/80",
        passwordHash: "hashed_password_3",
      },
    }),
  ]);

  console.log(`✅ Created ${users.length} users`);

  // Devicesテーブルにデータを作成
  const devices = await Promise.all([
    prisma.device.create({
      data: {
        name: "Quest 3",
      },
    }),
    prisma.device.create({
      data: {
        name: "Quest 2",
      },
    }),
    prisma.device.create({
      data: {
        name: "PCVR",
      },
    }),
  ]);

  console.log(`✅ Created ${devices.length} devices`);

  // Eventsテーブルにデータを作成
  const events = await Promise.all([
    prisma.event.create({
      data: {
        title: "VRChat音楽フェスティバル2025",
        description:
          "様々なジャンルのDJやミュージシャンが集まる大型音楽イベント。ライブパフォーマンスやダンスフロアで盛り上がろう!",
        deviceId: devices[0].id,
        maxParticipantsNum: 50,
        mainImageUrl: "/images/events/music-festival.jpg",
        deadline: new Date("2025-12-31T23:59:59Z"),
      },
    }),
    prisma.event.create({
      data: {
        title: "アートギャラリーツアー",
        description:
          "VRChatの美しいアートギャラリーワールドを巡るツアーイベント。クリエイターによる作品解説も予定しています。",
        deviceId: devices[2].id,
        maxParticipantsNum: 20,
        mainImageUrl: "/images/events/art-gallery.jpg",
        deadline: new Date("2025-12-25T18:00:00Z"),
      },
    }),
    prisma.event.create({
      data: {
        title: "初心者向けVRChat交流会",
        description:
          "VRChat初心者の方でも安心して参加できる交流イベント。操作方法やコミュニケーションのコツをお教えします。",
        deviceId: devices[1].id,
        maxParticipantsNum: 30,
        mainImageUrl: "/images/events/beginner-meetup.jpg",
        deadline: new Date("2025-12-20T12:00:00Z"),
      },
    }),
    prisma.event.create({
      data: {
        title: "ゲームナイト - みんなで遊ぼう",
        description:
          "VRChat内のゲームワールドで遊ぶイベント。Murder、Among Usなど様々なゲームを楽しみましょう!",
        deviceId: devices[0].id,
        maxParticipantsNum: 40,
        mainImageUrl: "/images/events/game-night.jpg",
        deadline: new Date("2025-12-28T20:00:00Z"),
      },
    }),
  ]);

  console.log(`✅ Created ${events.length} events`);

  // EventDatesテーブルにデータを作成
  const eventDates = await Promise.all([
    // 音楽フェスティバル - 3日間開催
    prisma.eventDate.create({
      data: {
        eventId: events[0].id,
        startDate: new Date("2025-12-27T19:00:00Z"),
        endDate: new Date("2025-12-27T23:00:00Z"),
      },
    }),
    prisma.eventDate.create({
      data: {
        eventId: events[0].id,
        startDate: new Date("2025-12-28T19:00:00Z"),
        endDate: new Date("2025-12-28T23:00:00Z"),
      },
    }),
    prisma.eventDate.create({
      data: {
        eventId: events[0].id,
        startDate: new Date("2025-12-29T19:00:00Z"),
        endDate: new Date("2025-12-29T23:00:00Z"),
      },
    }),
    // アートギャラリーツアー
    prisma.eventDate.create({
      data: {
        eventId: events[1].id,
        startDate: new Date("2025-12-26T14:00:00Z"),
        endDate: new Date("2025-12-26T16:00:00Z"),
      },
    }),
    // 初心者向け交流会
    prisma.eventDate.create({
      data: {
        eventId: events[2].id,
        startDate: new Date("2025-12-21T10:00:00Z"),
        endDate: new Date("2025-12-21T12:00:00Z"),
      },
    }),
    // ゲームナイト - 2日間開催
    prisma.eventDate.create({
      data: {
        eventId: events[3].id,
        startDate: new Date("2025-12-29T12:00:00Z"),
        endDate: new Date("2025-12-29T16:00:00Z"),
      },
    }),
    prisma.eventDate.create({
      data: {
        eventId: events[3].id,
        startDate: new Date("2025-12-30T12:00:00Z"),
        endDate: new Date("2025-12-30T16:00:00Z"),
      },
    }),
  ]);

  console.log(`✅ Created ${eventDates.length} event dates`);

  // EventParticipantsテーブルにデータを作成
  // Note: statusはデフォルト値(PENDING)を使用
  const eventParticipants = await Promise.all([
    // ユーザー1: 音楽フェスに参加
    prisma.eventParticipant.create({
      data: {
        eventId: events[0].id,
        userId: users[0].id,
        role: "participant",
      },
    }),
    // ユーザー1: アートツアーに申請中
    prisma.eventParticipant.create({
      data: {
        eventId: events[1].id,
        userId: users[0].id,
        role: "participant",
      },
    }),
    // ユーザー2: 初心者交流会に参加
    prisma.eventParticipant.create({
      data: {
        eventId: events[2].id,
        userId: users[1].id,
        role: "participant",
      },
    }),
    // ユーザー2: ゲームナイトに申請中
    prisma.eventParticipant.create({
      data: {
        eventId: events[3].id,
        userId: users[1].id,
        role: "participant",
      },
    }),
    // オーガナイザー: 音楽フェスの主催者
    prisma.eventParticipant.create({
      data: {
        eventId: events[0].id,
        userId: users[2].id,
        role: "organizer",
      },
    }),
    // オーガナイザー: アートツアーの主催者
    prisma.eventParticipant.create({
      data: {
        eventId: events[1].id,
        userId: users[2].id,
        role: "organizer",
      },
    }),
  ]);

  console.log(`✅ Created ${eventParticipants.length} event participants`);

  console.log("🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
