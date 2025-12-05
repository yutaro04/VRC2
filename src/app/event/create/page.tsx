"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { CldUploadWidget, CldImage } from "next-cloudinary";
import { Calendar, FileText, Clock, Users, Image as ImageIcon, Trash2 } from "lucide-react";
import { FloatingNav } from "@/components/shared/FloatingNav";
import ROUTES from "@/lib/routes";

interface CloudinaryUploadResult {
  info: {
    public_id: string;
    secure_url: string;
  };
}

interface Device {
  id: number;
  name: string;
}

export default function CreateEventPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // フォーム状態
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [deviceId, setDeviceId] = useState<number | undefined>(undefined);
  const [maxParticipants, setMaxParticipants] = useState<number | undefined>(undefined);
  const [hasMaxParticipants, setHasMaxParticipants] = useState(false);
  const [imagePublicId, setImagePublicId] = useState<string>("");

  // デバイス一覧
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoadingDevices, setIsLoadingDevices] = useState(true);

  // デバイス一覧を取得
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await fetch("/api/devices");
        if (response.ok) {
          const data = await response.json();
          setDevices(data);
          // デフォルトで最初のデバイスを選択
          if (data.length > 0 && deviceId === undefined) {
            setDeviceId(data[0].id);
          }
        } else {
          console.error("Failed to fetch devices");
        }
      } catch (error) {
        console.error("Error fetching devices:", error);
      } finally {
        setIsLoadingDevices(false);
      }
    };

    fetchDevices();
  }, [deviceId]);

  // ローディング中はリダイレクト
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  // 未ログインの場合はログインページへ
  if (!session) {
    router.push(ROUTES.LOGIN);
    return null;
  }

  const handleImageUpload = (result: CloudinaryUploadResult) => {
    if (result.info?.public_id) {
      setImagePublicId(result.info.public_id);
    }
  };

  const handleImageDelete = () => {
    setImagePublicId("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // バリデーション
      if (!title.trim()) {
        setError("イベントタイトルを入力してください");
        setIsSubmitting(false);
        return;
      }

      if (!imagePublicId) {
        setError("イベント画像をアップロードしてください");
        setIsSubmitting(false);
        return;
      }

      if (!startDate || !endDate) {
        setError("開催日時と終了日時を入力してください");
        setIsSubmitting(false);
        return;
      }

      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || undefined,
          device_id: deviceId,
          main_image_url: imagePublicId,
          start_date: new Date(startDate).toISOString(),
          end_date: new Date(endDate).toISOString(),
          max_participants_num: hasMaxParticipants ? maxParticipants : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "イベントの作成に失敗しました");
        setIsSubmitting(false);
        return;
      }

      // 成功したらイベント一覧へ遷移
      router.push(ROUTES.HOME);
    } catch (err) {
      console.error("Error creating event:", err);
      setError("イベントの作成に失敗しました");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-32 lg:pb-8">
      <FloatingNav />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-medium text-gray-900 mb-2">イベント作成</h1>
          <p className="text-gray-500">新しいイベントを作成して公開しましょう</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* イベント情報セクション */}
          <div className="border-2 border-gray-900 rounded-lg overflow-hidden">
            <div className="bg-gray-900 px-6 py-4 flex items-center gap-3">
              <FileText className="w-5 h-5 text-white" />
              <h2 className="text-xl font-medium text-white">イベント情報</h2>
            </div>

            <div className="p-6 space-y-6">
              {/* イベントタイトル */}
              <div>
                <label className="flex items-center gap-2 text-sm text-gray-700 mb-1">
                  <FileText className="w-4 h-4" />
                  イベントタイトル
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="お絵描き大会"
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-900"
                  maxLength={100}
                  required
                />
              </div>

              {/* イベント説明 */}
              <div>
                <label className="text-sm text-gray-700 mb-1 block">イベント説明</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="イベントの詳細を入力してください"
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-900 min-h-[100px] resize-y"
                />
              </div>

              {/* 日時 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm text-gray-700 mb-1">
                    <Clock className="w-4 h-4" />
                    開催日時
                  </label>
                  <input
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded text-gray-900 focus:outline-none focus:border-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm text-gray-700 mb-1">
                    <Clock className="w-4 h-4" />
                    終了日時
                  </label>
                  <input
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded text-gray-900 focus:outline-none focus:border-gray-900"
                    required
                  />
                </div>
              </div>

              {/* デバイス選択 */}
              <div>
                <label className="flex items-center gap-2 text-sm text-gray-700 mb-1">
                  <Calendar className="w-4 h-4" />
                  対応デバイス
                </label>
                {isLoadingDevices ? (
                  <div className="w-full px-3 py-2 border-2 border-gray-300 rounded text-gray-500">
                    読み込み中...
                  </div>
                ) : (
                  <select
                    value={deviceId || ""}
                    onChange={(e) => setDeviceId(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded text-gray-900 focus:outline-none focus:border-gray-900"
                    required
                  >
                    <option value="" disabled>
                      デバイスを選択
                    </option>
                    {devices.map((device) => (
                      <option key={device.id} value={device.id}>
                        {device.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* 参加人数制限 */}
              <div className="border-2 border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  <input
                    type="checkbox"
                    id="hasMaxParticipants"
                    checked={hasMaxParticipants}
                    onChange={(e) => setHasMaxParticipants(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <label htmlFor="hasMaxParticipants" className="flex items-center gap-2 text-sm text-gray-700">
                    <Users className="w-4 h-4" />
                    参加人数制限を設定する
                  </label>
                </div>

                {hasMaxParticipants && (
                  <div>
                    <label className="text-sm text-gray-700 mb-1 block">参加人数上限</label>
                    <input
                      type="number"
                      value={maxParticipants || ""}
                      onChange={(e) => setMaxParticipants(parseInt(e.target.value, 10))}
                      placeholder="20"
                      min="1"
                      className="w-48 px-3 py-2 border-2 border-gray-300 rounded text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-900"
                    />
                  </div>
                )}
              </div>

              {/* イベント画像 */}
              <div>
                <label className="flex items-center gap-2 text-sm text-gray-700 mb-1">
                  <ImageIcon className="w-4 h-4" />
                  イベント画像
                </label>

                <div className="flex items-center gap-3">
                  <CldUploadWidget
                    uploadPreset="user_avatars"
                    options={{
                      sources: ['local', 'url'],
                      multiple: false,
                      maxFiles: 1,
                    }}
                    onSuccess={(result) => handleImageUpload(result as CloudinaryUploadResult)}
                  >
                    {({ open }) => (
                      <button
                        type="button"
                        onClick={() => open()}
                        className="px-4 py-2 border-2 border-gray-300 rounded text-sm text-gray-700 hover:border-gray-900 transition-colors"
                      >
                        画像を変更
                      </button>
                    )}
                  </CldUploadWidget>

                  {imagePublicId && (
                    <button
                      type="button"
                      onClick={handleImageDelete}
                      className="px-4 py-2 border-2 border-red-500 rounded text-sm text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      削除
                    </button>
                  )}
                </div>

                {/* 画像プレビュー */}
                {imagePublicId && (
                  <div className="mt-4 border-2 border-gray-200 rounded-lg p-2">
                    <CldImage
                      src={imagePublicId}
                      alt="イベント画像プレビュー"
                      width={400}
                      height={300}
                      crop="fill"
                      gravity="auto"
                      className="w-full max-w-md rounded"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* アクションボタン */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={isSubmitting}
              className="px-6 py-2.5 border-2 border-gray-900 rounded-lg text-gray-900 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-gray-900 border-2 border-gray-900 rounded-lg text-white hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "作成中..." : "イベントを作成"}
            </button>
          </div>
        </form>

        {/* Logo Footer */}
        <div className="mt-16 text-center">
          <div className="text-xs text-gray-400 tracking-widest mb-1">FOR VRCHAT</div>
          <div className="text-sm text-gray-500">バーチャル世界で開催されるイベントを発見・共有しよう</div>
          <div className="mt-4 flex items-center justify-center gap-5">
            <div className="flex items-center gap-2">
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
              <span className="text-2xl font-bold tracking-wider">Virtual</span>
              <div className="w-px h-7 bg-gradient-to-b from-transparent via-gray-300 to-transparent" />
              <span className="text-2xl font-extralight tracking-wider">Events</span>
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 rounded-lg mx-4 sm:mx-6 lg:mx-8 p-6 mt-8">
        <p className="text-center text-gray-700 text-sm">
          © 2025 VRChat Events Platform. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
