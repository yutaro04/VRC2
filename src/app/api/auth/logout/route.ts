/**
 * ログアウトAPIコントローラー
 */

import { successResponseWithMessage } from '@/lib/api/apiResponse';

/**
 * POST /api/auth/logout
 * ユーザーログアウト
 *
 * Note: JWTベースの認証では、サーバー側でのログアウト処理は不要です。
 * クライアント側でトークンを削除することでログアウトとなります。
 * このエンドポイントは、将来的にトークンのブラックリスト機能などを
 * 追加する場合のために用意しています。
 */
export async function POST() {
  return successResponseWithMessage(null, 'ログアウトしました', 200);
}
