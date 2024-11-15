/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['replicate.delivery'],
  },
  async redirects() {
    return [
      // non-www to www redirect (단일 리다이렉트)
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'oveners.com',
          },
        ],
        permanent: true,
        destination: 'https://www.oveners.com/:path*',
      }
    ];
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      }
    ];
  },
  async rewrites() {
    return [
      {
        source: '/framer-landing.html',
        destination: '/framer-landing.html',
      },
      {
        source: '/main',
        destination: '/app/main',
      },
    ];
  },
};

export default nextConfig;