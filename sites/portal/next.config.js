/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return {
      // publicのディレクトリへのトレーリングスラッシュアクセスをindex.htmlに転送
      beforeFiles: [
        {
          source: '/:path+/',
          destination: '/:path+/index.html',
          missing: [
            // App Routerのページが存在する場合はスキップ（/diary/ 等）
            { type: 'header', key: 'x-middleware-next' },
          ],
        },
      ],
    };
  },
};

module.exports = nextConfig;
