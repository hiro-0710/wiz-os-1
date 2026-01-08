// Wiz Aura Utility
// API から返ってくる aura の画像URLを安全に扱うためのヘルパー

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// API_URL が未設定の場合の安全対策
if (!API_URL) {
  console.warn("NEXT_PUBLIC_API_URL が設定されていません。Aura の画像URLが正しく生成されません。");
}

/**
 * API が返す aura の画像URLを絶対URLに変換する
 * - すでに http で始まる場合 → そのまま使う
 * - 相対パスの場合 → API_URL を付与して絶対URLにする
 */
export function resolveAuraUrl(path: string | null): string | null {
  if (!path) return null;

  // すでに絶対URLならそのまま
  if (path.startsWith("http")) return path;

  // API_URL が undefined の場合は null を返す（クラッシュ防止）
  if (!API_URL) return null;

  // 相対パス → 絶対URLに変換
  return `${API_URL}${path}`;
}
