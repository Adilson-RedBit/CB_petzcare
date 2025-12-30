/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Garantir que as variáveis de ambiente sejam carregadas
  env: {
    // NODE_ENV já é definido automaticamente pelo Next.js
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  // Para compatibilidade com Cloudflare Pages
  // output: 'standalone', // Comentado - causa problemas em desenvolvimento
};

export default nextConfig;

