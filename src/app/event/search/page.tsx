"use client";

import { useState, useRef } from "react";
import { Monitor, Smartphone, ChevronLeft, ChevronRight, Image as ImageIcon, Clock } from "lucide-react";

interface Event {
  id: string | number;
  title: string;
  startTime: string; // "HH:MM"
  endTime: string; // "HH:MM"
  day: number; // 0: 日, 1: 月, 2: 火, etc.
  organizer: string;
  image: string;
  device: 'PC' | 'All' | 'Android';
  description: string;
}

// Mock event data for the week
const weekEvents: Event[] = [
  // 日曜日
  {
    id: 1,
    title: "モーニングヨガ",
    startTime: "06:30",
    endTime: "07:30",
    day: 0,
    organizer: "Wellness VR",
    image: "https://images.unsplash.com/photo-1558905945-901dc8efd4b3?w=400",
    device: 'All',
    description: "リラクゼーションを追求する人々向けのモーニングヨガクラスです。",
  },
  {
    id: 2,
    title: "朝の瞑想会",
    startTime: "08:00",
    endTime: "09:00",
    day: 0,
    organizer: "Zen Masters",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400",
    device: 'All',
    description: "心を落ち着かせるための瞑想会です。",
  },
  {
    id: 3,
    title: "日曜お茶会",
    startTime: "15:00",
    endTime: "17:00",
    day: 0,
    organizer: "Tea Time",
    image: "https://images.unsplash.com/photo-1587400520111-af8b9a6ea5ed?w=400",
    device: 'All',
    description: "友人や同僚とゆっくりお茶を楽しむ時間です。",
  },
  {
    id: 4,
    title: "サンデーマーケット",
    startTime: "15:00",
    endTime: "18:00",
    day: 0,
    organizer: "VR Market",
    image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=400",
    device: 'All',
    description: "様々な商品を楽しむことができるサンデーマーケットです。",
  },
  {
    id: 5,
    title: "夕暮れスケッチ会",
    startTime: "18:00",
    endTime: "20:00",
    day: 0,
    organizer: "Art Collective",
    image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400",
    device: 'All',
    description: "芸術を楽しむためのスケッチ会です。",
  },
  {
    id: 6,
    title: "夜のジャズライブ",
    startTime: "20:00",
    endTime: "22:00",
    day: 0,
    organizer: "Jazz Club VR",
    image: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=400",
    device: 'All',
    description: "ジャズ音楽を楽しむためのライブです。",
  },
  
  // 月曜日
  {
    id: 7,
    title: "朝活VR散歩",
    startTime: "07:00",
    endTime: "08:00",
    day: 1,
    organizer: "Morning Crew",
    image: "https://images.unsplash.com/photo-1587400520111-af8b9a6ea5ed?w=400",
    device: 'All',
    description: "朝から元気な一日をスタートさせるためのVR散歩です。",
  },
  {
    id: 8,
    title: "英会話レッスン",
    startTime: "07:00",
    endTime: "08:00",
    day: 1,
    organizer: "English VR",
    image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400",
    device: 'All',
    description: "英語を学ぶためのレッスンです。",
  },
  {
    id: 9,
    title: "モーニングコーヒー会",
    startTime: "09:00",
    endTime: "10:00",
    day: 1,
    organizer: "Coffee Lovers",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400",
    device: 'All',
    description: "コーヒーを楽しむための会議です。",
  },
  {
    id: 10,
    title: "プログラミング勉強会",
    startTime: "19:00",
    endTime: "21:00",
    day: 1,
    organizer: "Dev Community",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400",
    device: 'All',
    description: "プログラミングを学ぶための勉強会です。",
  },
  {
    id: 11,
    title: "月曜夜の映画鑑賞",
    startTime: "21:00",
    endTime: "23:00",
    day: 1,
    organizer: "Cinema VR",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400",
    device: 'All',
    description: "映画を楽しむための鑑賞会です。",
  },
  
  // 火曜日
  {
    id: 12,
    title: "早朝ランニング部",
    startTime: "06:00",
    endTime: "07:00",
    day: 2,
    organizer: "Run Club",
    image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=400",
    device: 'All',
    description: "朝から元気な一日をスタートさせるためのランニング部です。",
  },
  {
    id: 13,
    title: "ランチタイム交流会",
    startTime: "12:00",
    endTime: "13:00",
    day: 2,
    organizer: "Lunch Club",
    image: "https://images.unsplash.com/photo-1721642353290-440b0ae63b9f?w=400",
    device: 'All',
    description: "ランチタイムに友人や同僚と交流するための会議です。",
  },
  {
    id: 14,
    title: "ビジネス交流会",
    startTime: "12:00",
    endTime: "13:30",
    day: 2,
    organizer: "Business Network",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400",
    device: 'All',
    description: "ビジネスを深めるための交流会です。",
  },
  {
    id: 15,
    title: "アフタヌーンティー",
    startTime: "15:00",
    endTime: "16:00",
    day: 2,
    organizer: "Tea Society",
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400",
    device: 'All',
    description: "アフタヌーンにゆっくりとティーやスイーツを楽しむ時間です。",
  },
  {
    id: 16,
    title: "VRChat Music Festival",
    startTime: "20:00",
    endTime: "22:00",
    day: 2,
    organizer: "VRC Events",
    image: "https://images.unsplash.com/photo-1558905945-901dc8efd4b3?w=400",
    device: 'All',
    description: "音楽を楽しむためのフェスティバルです。",
  },
  {
    id: 17,
    title: "EDMナイト",
    startTime: "20:00",
    endTime: "23:00",
    day: 2,
    organizer: "EDM Collective",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400",
    device: 'All',
    description: "EDMを楽しむためのナイトです。",
  },
  
  // 水曜日
  {
    id: 18,
    title: "朝のストレッチ",
    startTime: "07:00",
    endTime: "08:00",
    day: 3,
    organizer: "Fitness VR",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400",
    device: 'All',
    description: "朝から元気な一日をスタートさせるためのストレッチです。",
  },
  {
    id: 19,
    title: "写真撮影ツアー",
    startTime: "14:00",
    endTime: "16:00",
    day: 3,
    organizer: "Photo Club",
    image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400",
    device: 'All',
    description: "写真撮影を楽しむためのツアーです。",
  },
  {
    id: 20,
    title: "ワールド探索ツアー",
    startTime: "16:00",
    endTime: "18:00",
    day: 3,
    organizer: "Explorer's Guild",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400",
    device: 'All',
    description: "ワールドを探索するためのツアーです。",
  },
  {
    id: 21,
    title: "クリエイティブワークショップ",
    startTime: "19:00",
    endTime: "21:00",
    day: 3,
    organizer: "Creators Lab",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400",
    device: 'All',
    description: "クリエイティブを学ぶためのワークショップです。",
  },
  {
    id: 22,
    title: "深夜アニメ鑑賞会",
    startTime: "23:00",
    endTime: "01:00",
    day: 3,
    organizer: "Anime Night",
    image: "https://images.unsplash.com/photo-1721642353290-440b0ae63b9f?w=400",
    device: 'All',
    description: "アニメを楽しむための鑑賞会です。",
  },
  {
    id: 23,
    title: "深夜ゲーム実況",
    startTime: "23:00",
    endTime: "02:00",
    day: 3,
    organizer: "Gaming Stream",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400",
    device: 'All',
    description: "ゲームを楽しむための実況です。",
  },
  
  // 木曜日
  {
    id: 24,
    title: "モーニングニュース",
    startTime: "08:00",
    endTime: "09:00",
    day: 4,
    organizer: "VR News",
    image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400",
    device: 'All',
    description: "ニュースを楽しむためのモーニングニュースです。",
  },
  {
    id: 25,
    title: "3Dモデリング講座",
    startTime: "18:00",
    endTime: "20:00",
    day: 4,
    organizer: "3D Academy",
    image: "https://images.unsplash.com/photo-1633412802994-5c058f151b66?w=400",
    device: 'All',
    description: "3Dモデリングを学ぶための講座です。",
  },
  {
    id: 26,
    title: "クリエイター交流会",
    startTime: "19:00",
    endTime: "21:00",
    day: 4,
    organizer: "Creator Hub",
    image: "https://images.unsplash.com/photo-1558008322-9793c57cb73b?w=400",
    device: 'All',
    description: "クリエイターを深めるための交流会です。",
  },
  {
    id: 27,
    title: "Unity勉強会",
    startTime: "19:00",
    endTime: "21:00",
    day: 4,
    organizer: "Unity Users",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400",
    device: 'All',
    description: "Unityを学ぶための勉強会です。",
  },
  {
    id: 28,
    title: "カラオケナイト",
    startTime: "21:00",
    endTime: "23:00",
    day: 4,
    organizer: "Karaoke Club",
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400",
    device: 'All',
    description: "カラオケを楽しむためのナイトです。",
  },
  
  // 金曜日
  {
    id: 29,
    title: "朝活読書会",
    startTime: "07:00",
    endTime: "08:00",
    day: 5,
    organizer: "Book Club",
    image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400",
    device: 'All',
    description: "読書を楽しむための読書会です。",
  },
  {
    id: 30,
    title: "ランチビュッフェ",
    startTime: "12:00",
    endTime: "13:30",
    day: 5,
    organizer: "Food Paradise",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400",
    device: 'All',
    description: "ランチタイムに楽しむためのビュッフェです。",
  },
  {
    id: 31,
    title: "夕方ダンスレッスン",
    startTime: "18:00",
    endTime: "19:30",
    day: 5,
    organizer: "Dance Studio",
    image: "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=400",
    device: 'All',
    description: "ダンスを学ぶためのレッスンです。",
  },
  {
    id: 32,
    title: "金曜夜のDJパーティー",
    startTime: "22:00",
    endTime: "24:00",
    day: 5,
    organizer: "Friday Night",
    image: "https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=400",
    device: 'All',
    description: "DJを楽しむためのパーティーです。",
  },
  {
    id: 33,
    title: "夜のゲーム大会",
    startTime: "21:00",
    endTime: "23:00",
    day: 5,
    organizer: "Gaming Night",
    image: "https://images.unsplash.com/photo-1558008322-9793c57cb73b?w=400",
    device: 'All',
    description: "ゲームを楽しむための大会です。",
  },
  {
    id: 34,
    title: "テクノナイト",
    startTime: "22:00",
    endTime: "03:00",
    day: 5,
    organizer: "Techno Collective",
    image: "https://images.unsplash.com/photo-1571266028243-d220c265d3cd?w=400",
    device: 'All',
    description: "テクノを楽しむためのナイトです。",
  },
  
  // 土曜日
  {
    id: 35,
    title: "早朝フィッシング",
    startTime: "05:00",
    endTime: "07:00",
    day: 6,
    organizer: "Fishing Club",
    image: "https://images.unsplash.com/photo-1498654077810-12c21d4d6dc3?w=400",
    device: 'All',
    description: "フィッシングを楽しむためのクラブです。",
  },
  {
    id: 36,
    title: "朝市ツアー",
    startTime: "08:00",
    endTime: "10:00",
    day: 6,
    organizer: "Market Guide",
    image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400",
    device: 'All',
    description: "朝市を楽しむためのツアーです。",
  },
  {
    id: 37,
    title: "料理教室",
    startTime: "11:00",
    endTime: "13:00",
    day: 6,
    organizer: "Cooking School",
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400",
    device: 'All',
    description: "料理を学ぶための教室です。",
  },
  {
    id: 38,
    title: "週末ワールド巡り",
    startTime: "14:00",
    endTime: "16:00",
    day: 6,
    organizer: "World Tour",
    image: "https://images.unsplash.com/photo-1459550532302-ba13832edcdf?w=400",
    device: 'All',
    description: "週末にワールドを巡るためのツアーです。",
  },
  {
    id: 39,
    title: "アートギャラリー展",
    startTime: "14:00",
    endTime: "17:00",
    day: 6,
    organizer: "VR Gallery",
    image: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=400",
    device: 'All',
    description: "アートを楽しむためのギャラリー展です。",
  },
  {
    id: 40,
    title: "夕暮れコンサート",
    startTime: "17:00",
    endTime: "19:00",
    day: 6,
    organizer: "Symphony VR",
    image: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=400",
    device: 'All',
    description: "コンサートを楽しむための夕暮れコンサートです。",
  },
  {
    id: 41,
    title: "土曜夜のバル巡り",
    startTime: "19:00",
    endTime: "22:00",
    day: 6,
    organizer: "Bar Hopping",
    image: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=400",
    device: 'All',
    description: "バルを楽しむための巡りです。",
  },
  {
    id: 42,
    title: "ミッドナイトシアター",
    startTime: "00:00",
    endTime: "02:00",
    day: 6,
    organizer: "Late Night Cinema",
    image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400",
    device: 'All',
    description: "映画を楽しむためのミッドナイトシアターです。",
  },
];

const daysOfWeek = ["日", "月", "火", "水", "木", "金", "土"];

const DAYS_IN_WEEK = 7;
const TIME_SLOT_MINUTES = 30;
const MINUTES_IN_HOUR = 60;
const HOURS_IN_DAY = 24;
const SLOTS_PER_HOUR = MINUTES_IN_HOUR / TIME_SLOT_MINUTES;
const TOTAL_SLOTS = HOURS_IN_DAY * SLOTS_PER_HOUR;

const CALENDAR_MAX_HEIGHT = 600;
const EVENT_MIN_HEIGHT = 160;
const CONTAINER_MAX_WIDTH = 1400;

// Convert time string to minutes from midnight
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * MINUTES_IN_HOUR + minutes;
}

// Generate time slots (every 30 minutes)
const timeSlots = Array.from({ length: TOTAL_SLOTS }, (_, i) => {
  const hour = Math.floor(i / SLOTS_PER_HOUR);
  const minute = (i % SLOTS_PER_HOUR) * TIME_SLOT_MINUTES;
  return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
});

export default function SearchPage() {
  const [selectedDay, setSelectedDay] = useState<number>(1); // Default to Monday
  const [weekOffset, setWeekOffset] = useState<number>(0); // Week offset (0 = current week)
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Calculate current date with week offset
  const getCurrentWeekStart = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diff = today.getDate() - dayOfWeek + (weekOffset * DAYS_IN_WEEK);
    const weekStart = new Date(today);
    weekStart.setDate(diff);
    return weekStart;
  };

  const getDateForDay = (dayIndex: number) => {
    const weekStart = getCurrentWeekStart();
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + dayIndex);
    return date;
  };

  const formatDate = (date: Date) => {
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  const handlePrevWeek = () => {
    setWeekOffset(weekOffset - 1);
  };

  const handleNextWeek = () => {
    setWeekOffset(weekOffset + 1);
  };

  const getDeviceIcon = (device: 'PC' | 'All' | 'Android') => {
    if (device === 'PC') return <Monitor className="w-3 h-3" aria-hidden="true" />;
    if (device === 'Android') return <Smartphone className="w-3 h-3" aria-hidden="true" />;
    return <span className="text-xs">ALL</span>;
  };

  // Scroll to specific time
  const scrollToTime = (time: string) => {
    const element = document.getElementById(`time-${time}`);
    if (element && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      container.scrollTo({
        top: element.offsetTop,
        behavior: "smooth",
      });
    }
  };

  // Get events for selected day
  const selectedDayEvents = weekEvents.filter(event => event.day === selectedDay);

  // Get active time slots (times that have events)
  const activeTimeSlots = Array.from(new Set(
    selectedDayEvents.map(event => event.startTime.split(":")[0] + ":00")
  )).sort();

  return (
    <div className="min-h-screen bg-transparent relative flex flex-col">

      <main className="relative z-10 flex-1 pb-24 lg:pb-8">

        {/* Search Content */}
        <div 
          className="pt-16 pb-8 mx-auto px-8"
          style={{ maxWidth: CONTAINER_MAX_WIDTH }}
        >
          {/* Day Selector */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <button
              onClick={handlePrevWeek}
              className="px-3 py-3 bg-white border-2 border-gray-900 rounded-lg hover:bg-gray-100 transition-all"
              aria-label="前の週"
            >
              <ChevronLeft className="w-5 h-5" aria-hidden="true" />
            </button>
            
            <div className="flex gap-2">
              {daysOfWeek.map((day, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedDay(index)}
                  className={`px-6 py-3 rounded-lg border-2 transition-all ${
                    selectedDay === index
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-white text-gray-900 border-gray-200 hover:border-gray-900"
                  }`}
                >
                  <div className="text-sm opacity-70">{day}</div>
                  <div className="text-xs">{formatDate(getDateForDay(index))}</div>
                </button>
              ))}
            </div>
            
            <button
              onClick={handleNextWeek}
              className="px-3 py-3 bg-white border-2 border-gray-900 rounded-lg hover:bg-gray-100 transition-all"
              aria-label="次の週"
            >
              <ChevronRight className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          {/* Calendar View */}
          <div className="bg-white border-2 border-gray-900 rounded-lg overflow-hidden max-w-6xl mx-auto">
            <div className="flex">
              {/* Time Slots */}
              <div 
                ref={scrollContainerRef}
                className="flex-1 overflow-y-auto scrollbar-thin relative"
                style={{ maxHeight: CALENDAR_MAX_HEIGHT }}
              >
                {timeSlots.map((time) => {
                  const eventsAtThisTime = selectedDayEvents.filter(event => {
                    const eventStart = timeToMinutes(event.startTime);
                    let eventEnd = timeToMinutes(event.endTime);
                    let slotTime = timeToMinutes(time);
                    // If event ends before it starts, it spans midnight
                    if (eventEnd < eventStart) {
                      eventEnd += 1440; // add 24 hours in minutes
                      // Also, if slotTime < eventStart, treat slotTime as after midnight
                      if (slotTime < eventStart) {
                        slotTime += 1440;
                      }
                    }
                    return slotTime >= eventStart && slotTime < eventEnd;
                  });

                  const isHalfHour = time.endsWith(":30");

                  return (
                    <div key={time} id={`time-${time}`}>
                      <div className="flex border-b border-gray-200">
                        {/* Time Label */}
                        <div className={`w-20 flex-shrink-0 p-4 text-sm text-gray-600 ${isHalfHour ? "opacity-50" : "font-medium"}`}>
                          {!isHalfHour && time}
                        </div>

                        {/* Event Area */}
                        <div 
                          className="flex-1 p-2 flex items-center"
                          style={{ minHeight: EVENT_MIN_HEIGHT }}
                        >
                          {eventsAtThisTime.length > 0 ? (
                            <div className="w-full space-y-2">
                              {eventsAtThisTime.map((event) => {
                                // Only show the event card at its start time
                                if (event.startTime === time) {
                                  return (
                                    <div
                                      key={event.id}
                                      className="bg-white border-2 border-gray-900 rounded-lg overflow-hidden hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer group flex max-w-lg"
                                    >
                                      <div className="flex items-stretch h-full w-full">
                                        {/* Poster Image (Dummy) */}
                                        <div className="w-40 flex-shrink-0 bg-gray-200 aspect-[4/5] flex items-center justify-center">
                                          <ImageIcon className="w-12 h-12 text-gray-400" aria-hidden="true" />
                                        </div>
                                        {/* Event Info */}
                                        <div className="flex-1 p-3 flex flex-col justify-between bg-white relative">
                                          {/* Device badge */}
                                          <div className="absolute top-2 right-2 bg-white border border-gray-900 rounded px-1.5 py-1 flex items-center gap-0.5 text-gray-900 text-xs">
                                            {getDeviceIcon(event.device)}
                                          </div>
                                          
                                          <div>
                                            <h3 className="text-gray-900 mb-2 pr-12 group-hover:text-gray-700 transition-colors line-clamp-2">{event.title}</h3>
                                            <p className="text-xs text-gray-600 mb-2">{event.organizer}</p>
                                            <p className="text-xs text-gray-500 line-clamp-2 mb-2">{event.description}</p>
                                          </div>
                                          
                                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                            <Clock className="w-3 h-3" aria-hidden="true" />
                                            <span>{event.startTime} - {event.endTime}</span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                }
                                return null;
                              })}
                            </div>
                          ) : null}
                        </div>
                      </div>

                      {/* 30-minute divider */}
                      {isHalfHour && (
                        <div className="border-b border-dashed border-gray-300" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Time Jump Navigation */}
              <div 
                className="w-24 border-l-2 border-gray-900 bg-gray-50 overflow-y-auto scrollbar-thin"
                style={{ maxHeight: CALENDAR_MAX_HEIGHT }}
              >
                <div className="sticky top-0 bg-gray-900 text-white text-xs p-2 text-center z-10">
                  時刻選択
                </div>
                <div className="p-2 space-y-1">
                  {activeTimeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => scrollToTime(time)}
                      className="w-full px-2 py-2 text-xs bg-white border border-gray-200 rounded hover:bg-gray-900 hover:text-white transition-all text-gray-900"
                    >
                      {time}
                    </button>
                  ))}
                  {activeTimeSlots.length === 0 && (
                    <p className="text-xs text-gray-400 text-center py-4">
                      イベントなし
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative px-8 py-8 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gray-100 rounded-lg p-6 text-center">
            <p className="text-gray-600">
              © 2025 VRChat Events Platform. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}