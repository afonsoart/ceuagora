import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',  
  basePath: '/Ceu_Agora',  
  images: {
    unoptimized: true,  
  },
};

export default nextConfig;