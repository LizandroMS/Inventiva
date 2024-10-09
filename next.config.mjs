/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,  // Activar modo estricto de React
    swcMinify: true,        // Minificación de código usando SWC
    images: {
        domains: ['firebasestorage.googleapis.com'],
    },
    trailingSlash: false,
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'firebasestorage.googleapis.com',
            pathname: '/v0/b/**', // Permite todas las rutas dentro de Firebase Storage
          },
        ],
      },
};

export default nextConfig;
