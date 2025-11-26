/**
 * 編集ページのアクションボタン
 */

import { useRouter } from 'next/navigation';
import { Button } from '@/components/shared/Button';
import { ErrorMessage } from '@/components/shared/ErrorMessage';

interface EditActionsProps {
  onSave: () => void;
  isSaving: boolean;
  error: string | null;
}

export function EditActions({ onSave, isSaving, error }: EditActionsProps) {
  const router = useRouter();

  return (
    <>
      {error && <ErrorMessage message={error} fullScreen={false} />}
      <Button variant="secondary" onClick={() => router.push('/user/profile')} disabled={isSaving}>
        キャンセル
      </Button>
      <Button variant="primary" onClick={onSave} disabled={isSaving}>
        {isSaving ? '保存中...' : '保存'}
      </Button>
    </>
  );
}
