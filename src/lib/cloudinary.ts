/**
 * Cloudinaryヘルパー関数
 */

/**
 * アバター画像のURLを生成
 * @param publicId Cloudinaryのpublic ID
 * @param size 画像のサイズ（幅と高さ）
 * @returns 画像URL
 */
export function getAvatarImageUrl(publicId?: string, size: number = 80): string {
  if (!publicId) {
    // デフォルトのプレースホルダー画像
    return '/api/placeholder/80/80';
  }

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  
  if (!cloudName) {
    console.warn('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set');
    return '/api/placeholder/80/80';
  }

  // Cloudinaryの変換パラメータを使用して画像を最適化
  return `https://res.cloudinary.com/${cloudName}/image/upload/c_fill,w_${size},h_${size},g_face/${publicId}`;
}
