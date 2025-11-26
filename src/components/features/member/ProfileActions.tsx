/**
 * プロフィールページのアクションボタン
 */

import { useRouter } from 'next/navigation';
import { Button } from '@/components/shared/Button';

interface ProfileActionsProps {
  onLogout?: () => void;
}

const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
);

export function ProfileActions({ onLogout }: ProfileActionsProps) {
  const router = useRouter();

  return {
    headerButton: (
      <Button variant="secondary" size="sm" icon={<EditIcon />} onClick={() => router.push('/user/edit')}>
        編集
      </Button>
    ),
    actionButtons: (
      <Button variant="danger" size="md" onClick={onLogout}>
        ログアウト
      </Button>
    ),
  };
}
