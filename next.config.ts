import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    STRAPI_BASE_URL: process.env.STRAPI_BASE_URL,
    APP_NAME: process.env.APP_NAME,
    AWS_REGION: process.env.AWS_REGION,
    AWS_LOG_GROUP_NAME: process.env.AWS_LOG_GROUP_NAME,
    AWS_LOG_STREAM_NAME: process.env.AWS_LOG_STREAM_NAME,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  },
};

export default nextConfig;
