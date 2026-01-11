import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',  // Habilita exportação estática
  basePath: '/ceuagora',  // Nome do seu repositório GitHub
  images: {
    unoptimized: true,  // Necessário para exportação estática
  },
};

export default nextConfig;