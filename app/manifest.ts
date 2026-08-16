import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MAPHY Physics Learning",
    short_name: "MAPHY",
    description:
      "Class 12 Physics tests, handwritten notes and BPSC TRE practice.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f9fc",
    theme_color: "#07111f",
    categories: ["education"],
    icons: [
      {
        src: "/maphy-logo-mark.png",
        sizes: "256x256",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
