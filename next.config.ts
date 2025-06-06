/** @type {import('next').NextConfig} */

// リポジトリ名をここに設定！
const repo = 'pre-chouseisan'; // ★ ご自身のリポジトリ名に合わせてください

const nextConfig = {
  // ★ 静的サイトとして出力する設定
  output: 'export',

  // ★ GitHub Pages用の設定
  basePath: `/${repo}`,
  assetPrefix: `/${repo}`,

  // 画像最適化を無効にする（静的サイトでは必須）
  images: {
    unoptimized: true,
  },
};

export default nextConfig;