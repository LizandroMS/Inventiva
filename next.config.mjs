/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,  // Activar modo estricto de React
    swcMinify: true,        // Minificación de código usando SWC
    images: {
        domains: ['firebasestorage.googleapis.com'],
    },
    trailingSlash: false,
};

export default nextConfig;
