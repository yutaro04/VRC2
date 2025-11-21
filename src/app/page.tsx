import Link from "next/link";
import ROUTES from "../lib/routes";
import { FloatingNav } from "../components/shared/FloatingNav";
import { EventCard } from "../components/features/events/EventCard";


interface Event {
  id: string | number;
  title: string;
  date: string;
  organizer: string;
  image: string;
  device: "PC" | "All" | "Android";
  participants?: number;
}

const upcomingEvents: Event[] = [
  {
    id: "1",
    title: "VRChat Music Festival 2024",
    date: "2024.12.25 20:00 JST",
    organizer: "VRC Events Team",
    image:
      "https://images.unsplash.com/photo-1558905945-901dc8efd4b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    device: "All",
  },
  {
    id: "2",
    title: "アバター展示会 2024 Winter",
    date: "2024.12.28 19:00 JST",
    organizer: "Avatar Creators",
    image:
      "https://images.unsplash.com/photo-1721642353290-440b0ae63b9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    device: "PC",
  },
  {
    id: "3",
    title: "New Year VR Party",
    date: "2025.01.01 00:00 JST",
    organizer: "VR Party Official",
    image:
      "https://images.unsplash.com/photo-1459550532302-ba13832edcdf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    device: "All",
  },
  {
    id: "4",
    title: "Cyberpunk Night Club",
    date: "2024.12.30 22:00 JST",
    organizer: "Neon Nights",
    image:
      "https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    device: "Android",
  },
  {
    id: "5",
    title: "Virtual World Meetup",
    date: "2025.01.05 18:00 JST",
    organizer: "VRC Community",
    image:
      "https://images.unsplash.com/photo-1587400520111-af8b9a6ea5ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    device: "All",
  },
  {
    id: "6",
    title: "Gaming Tournament Final",
    date: "2025.01.10 20:00 JST",
    organizer: "VR Esports",
    image:
      "https://images.unsplash.com/photo-1558008322-9793c57cb73b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    device: "PC",
  },
  {
    id: "7",
    title: "VRChatバーチャル花火大会",
    date: "2025.01.15 20:00 JST",
    organizer: "Japan VR Events",
    image:
      "https://images.unsplash.com/photo-1558905945-901dc8efd4b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    device: "All",
  },
  {
    id: "8",
    title: "クリエイター交流会 Vol.12",
    date: "2025.01.18 19:00 JST",
    organizer: "VRC Creator Hub",
    image:
      "https://images.unsplash.com/photo-1721642353290-440b0ae63b9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    device: "All",
  },
];

const newEvents: Event[] = [
  {
    id: 401,
    title: "バーチャル写真撮影会 - 冬の風景",
    date: "2025年11月19日 17:00",
    organizer: "VR Photographers Guild",
    image:
      "https://images.unsplash.com/photo-1587400520111-af8b9a6ea5ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    participants: 125,
    device: "All",
  },
  {
    id: 402,
    title: "VRChat謎解きゲームイベント",
    date: "2025年11月19日 20:00",
    organizer: "Mystery Game Masters",
    image:
      "https://images.unsplash.com/photo-1558008322-9793c57cb73b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    participants: 98,
    device: "PC",
  },
  {
    id: 403,
    title: "深夜アニメ鑑賞会",
    date: "2025年11月19日 23:00",
    organizer: "Anime Night Crew",
    image:
      "https://images.unsplash.com/photo-1721642353290-440b0ae63b9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    participants: 86,
    device: "All",
  },
  {
    id: 404,
    title: "モーショントレーニング講座",
    date: "2025年11月20日 19:00",
    organizer: "Motion Capture Academy",
    image:
      "https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    participants: 72,
    device: "PC",
  },
  {
    id: 405,
    title: "Quest限定ワールド巡り",
    date: "2025年11月20日 18:30",
    organizer: "Quest Users Community",
    image:
      "https://images.unsplash.com/photo-1459550532302-ba13832edcdf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    participants: 64,
    device: "Android",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-transparent relative flex flex-col">

      <FloatingNav />

      <main className="relative z-10 flex-1 pb-24 lg:pb-0">

        <div className="py-12 max-w-[1400px] mx-auto px-8">
          <div className="bg-gray-900 rounded-lg p-6 border-2 border-gray-900">
            <div className="text-center mb-6">
              <h2 className="text-white mb-2">VRChatイベントを、もっと身近に</h2>
              <p className="text-gray-300">誰でも簡単にイベントを投稿・検索できるプラットフォーム</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-white mb-1">1,250+</div>
                <p className="text-gray-400 text-sm">開催イベント数</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="text-white mb-1">8,500+</div>
                <p className="text-gray-400 text-sm">累計参加者数</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                </div>
                <div className="text-white mb-1">350+</div>
                <p className="text-gray-400 text-sm">イベント主催者</p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto px-4">
                <Link href={ROUTES.EVENT_SEARCH} className="group relative bg-white text-gray-900 rounded-2xl border border-gray-200 hover:border-gray-900 transition-all duration-300 p-6 text-left overflow-hidden hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] block">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gray-900 opacity-0 group-hover:opacity-5 transition-all duration-300 rounded-bl-full" />

                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gray-900 group-hover:scale-110 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:rotate-3">
                          <svg className="w-6 h-6 text-white transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-white border-2 border-gray-900 rounded-full group-hover:scale-125 transition-all duration-300" />
                      </div>
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-900 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg">イベントを探す</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">気になるイベントを検索して<br className="hidden sm:block" />参加しよう</p>
                    </div>
                  </div>
                </Link>

                <Link href={ROUTES.EVENT_CREATE} className="group relative bg-gray-900 text-white rounded-2xl border-2 border-white hover:border-white transition-all duration-300 p-6 text-left overflow-hidden shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.5)] block">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-0 group-hover:opacity-10 transition-all duration-300 rounded-bl-full" />

                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <div className="relative">
                        <div className="w-12 h-12 bg-white group-hover:scale-110 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:rotate-3">
                          <svg className="w-6 h-6 text-gray-900 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-gray-900 border-2 border-white rounded-full group-hover:scale-125 transition-all duration-300" />
                      </div>
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg">イベントを投稿する</h3>
                      <p className="text-sm text-gray-400 leading-relaxed">あなたのイベントを<br className="hidden sm:block" />多くの人に届けよう</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="py-4 max-w-[1400px] mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <section>
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <h2 className="text-gray-900 mb-1">開催予定イベント</h2>
                  <p className="text-gray-600 text-sm">VRChatで開催されるイベント一覧</p>
                </div>
                <button className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg border-2 border-gray-900 hover:bg-gray-700 transition-all flex-shrink-0">もっと見る</button>
              </div>
              <div className="overflow-x-auto scrollbar-hide">
                <div className="flex gap-2 pb-2">
                  {upcomingEvents.map((event) => (
                    <EventCard key={event.id} {...event} />
                  ))}
                </div>
              </div>
            </section>

            <section>
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <h2 className="text-gray-900 mb-1">新着イベント</h2>
                  <p className="text-gray-600 text-sm">新しく投稿されたイベント</p>
                </div>
                <button className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg border-2 border-gray-900 hover:bg-gray-700 transition-all flex-shrink-0">もっと見る</button>
              </div>
              <div className="overflow-x-auto scrollbar-hide">
                <div className="flex gap-2 pb-2">
                  {newEvents.map((event) => (
                    <EventCard key={event.id} {...event} />
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <footer className="relative px-8 py-8 mt-0 lg:mt-12 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gray-100 rounded-lg p-6 text-center">
            <p className="text-gray-600">© 2025 VRChat Events Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
