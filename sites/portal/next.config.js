/** @type {import('next').NextConfig} */
const nextConfig = {
  // 静的ファイルは public/ に配置（ファイルベースルーティング）
  // ディレクトリアクセス（末尾スラッシュ）→index.htmlは middleware.ts で処理
};

module.exports = nextConfig;
