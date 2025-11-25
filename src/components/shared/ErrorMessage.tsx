/**
 * エラーメッセージコンポーネント
 */

interface ErrorMessageProps {
  message: string;
  fullScreen?: boolean;
}

export function ErrorMessage({ message, fullScreen = true }: ErrorMessageProps) {
  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">{message}</div>
      </div>
    );
  }

  return (
    <div className="w-full text-red-600 text-sm mb-2">
      {message}
    </div>
  );
}
