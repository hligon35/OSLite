/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Security hardening (does not change UI/UX).
  poweredByHeader: false,

  images: {
    formats: ['image/avif', 'image/webp']
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          {
            key: 'Permissions-Policy',
            value:
              'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()'
          },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' }
        ]
      }
    ];
  }
};

export default nextConfig;
