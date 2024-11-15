/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['replicate.delivery'],
  },
  async redirects() {
    return [
      // non-www to www redirect
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'oveners.com',
          },
        ],
        permanent: true, // This ensures a 301 redirect
        destination: 'https://www.oveners.com/:path*',
      },
      // http to https redirect
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.oveners.com',
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
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          }
        ],
      },
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