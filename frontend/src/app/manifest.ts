import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "EcoSphere",
    short_name: "EcoSphere",
    description:
      "Enterprise sustainability management for organizations tracking measurable ESG impact.",
    start_url: "/",
    display: "standalone",
    background_color: "#020617",
    theme_color: "#020617",
    icons: [
      {
        src: "/favicon-48x48.png",
        sizes: "48x48",
        type: "image/png",
      },
    ],
  };
}
