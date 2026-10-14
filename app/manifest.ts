import type { MetadataRoute } from "next";
import { colors } from "@/brand";
import { site } from "@/site.config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.shortName,
    start_url: "/",
    display: "standalone",
    dir: "rtl",
    lang: "ar",
    background_color: colors.light.bg,
    theme_color: colors.light["primary-dark"],
    icons: [{ src: "/logo.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
