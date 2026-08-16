import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  outputFileTracingIncludes: {
    "/api/course-content/[courseId]": ["./content/notes/**/*.pdf"],
    "/api/preview/electrostatics/[page]": [
      "./content/previews/electrostatics/*.jpg",
    ],
    "/api/preview/current-electricity/[page]": [
      "./content/previews/current-electricity/*.jpg",
    ],
  },
};

export default nextConfig;
