/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,  // Activar modo estricto de React
    swcMinify: true,        // Minificación de código usando SWC
    images: {
        domains: ['firebasestorage.googleapis.com'],
    },
};

export default nextConfig;
