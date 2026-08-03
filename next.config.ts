import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  outputFileTracingIncludes: {
    "/api/course-content/[courseId]": ["./content/notes/**/*.pdf"],
  },
};

export default nextConfig;
