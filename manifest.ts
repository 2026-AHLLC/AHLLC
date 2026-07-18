import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AH LLC",

    short_name: "AH LLC",

    description:
      "AI-powered websites, automation, SEO and software.",

    start_url: "/",

    display: "standalone",

    background_color: "#09090b",

    theme_color: "#09090b",

    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
