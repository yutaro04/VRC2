import { NextRequest, NextResponse } from 'next/server';

// 仮のユーザーデータ型定義
interface User {
  id: number;
  nickname: string;
  description: string;
  email: string;
  avatar_image_url: string;
  created_at: string;
  updated_at: string;
}

// 仮のデータベース（実装時は実際のDBに接続）
const mockUser: User = {
  id: 1,
  nickname: 'VRChatユーザー(APIから呼び出し)',
  description: 'VRChatで色々なイベントに参加しています。音楽イベントやアート展示が好きです。よろしくお願いします！',
  email: 'user@example.com',
  avatar_image_url: '/api/placeholder/80/80',
  created_at: '2025-01-01T00:00:00+09:00',
  updated_at: '2025-01-01T00:00:00+09:00',
};

/**
 * GET /api/users/me
 * 認証済みユーザーの情報を取得
 */
export async function GET() {
  try {
    // TODO: 実際の認証チェックを実装
    // const token = request.headers.get('authorization');
    // if (!token) {
    //   return NextResponse.json(
    //     { statusCode: 401, message: '認証が必要です' },
    //     { status: 401 }
    //   );
    // }

    // TODO: JWTトークンからユーザー情報を取得
    // const userId = verifyToken(token);
    // const user = await getUserById(userId);

    // 仮のレスポンス
    return NextResponse.json(
      {
        statusCode: 200,
        data: mockUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json(
      {
        statusCode: 500,
        message: 'ユーザー情報の取得に失敗しました',
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/users/me
 * 認証済みユーザーの情報を更新
 */
export async function PUT(request: NextRequest) {
  try {
    // TODO: 実際の認証チェックを実装
    // const token = request.headers.get('authorization');
    // if (!token) {
    //   return NextResponse.json(
    //     { statusCode: 401, message: '認証が必要です' },
    //     { status: 401 }
    //   );
    // }

    const body = await request.json();

    // バリデーション
    const errors: { field: string; message: string }[] = [];

    if (body.nickname !== undefined) {
      if (typeof body.nickname !== 'string' || body.nickname.length === 0) {
        errors.push({ field: 'nickname', message: 'ニックネームは必須です' });
      } else if (body.nickname.length > 50) {
        errors.push({ field: 'nickname', message: 'ニックネームは50文字以内で入力してください' });
      }
    }

    if (body.description !== undefined && typeof body.description !== 'string') {
      errors.push({ field: 'description', message: '自己紹介文は文字列で入力してください' });
    }

    if (body.email !== undefined) {
      if (typeof body.email !== 'string' || body.email.length === 0) {
        errors.push({ field: 'email', message: 'メールアドレスは必須です' });
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
        errors.push({ field: 'email', message: '有効なメールアドレスを入力してください' });
      }
    }

    if (body.password !== undefined) {
      if (typeof body.password !== 'string' || body.password.length < 8) {
        errors.push({ field: 'password', message: 'パスワードは8文字以上で入力してください' });
      }
    }

    if (body.avatar_image_url !== undefined && typeof body.avatar_image_url !== 'string') {
      errors.push({ field: 'avatar_image_url', message: 'アバター画像URLは文字列で入力してください' });
    }

    if (errors.length > 0) {
      return NextResponse.json(
        {
          statusCode: 400,
          message: 'リクエストパラメータが不正です',
          errors,
        },
        { status: 400 }
      );
    }

    // TODO: ニックネームの重複チェック
    // if (body.nickname && body.nickname !== currentUser.nickname) {
    //   const existingUser = await findUserByNickname(body.nickname);
    //   if (existingUser) {
    //     return NextResponse.json(
    //       {
    //         statusCode: 409,
    //         message: 'このニックネームは既に使用されています',
    //       },
    //       { status: 409 }
    //     );
    //   }
    // }

    // TODO: データベースの更新処理
    // const updatedUser = await updateUser(userId, body);

    // 仮の更新レスポンス
    const updatedUser: User = {
      ...mockUser,
      nickname: body.nickname ?? mockUser.nickname,
      description: body.description ?? mockUser.description,
      email: body.email ?? mockUser.email,
      avatar_image_url: body.avatar_image_url ?? mockUser.avatar_image_url,
      updated_at: new Date().toISOString(),
    };

    return NextResponse.json(
      {
        statusCode: 200,
        message: 'ユーザー情報を更新しました',
        data: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating user data:', error);
    return NextResponse.json(
      {
        statusCode: 500,
        message: 'ユーザー情報の更新に失敗しました',
      },
      { status: 500 }
    );
  }
}
