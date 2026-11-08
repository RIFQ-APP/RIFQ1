import type { MetadataRoute } from "next";

const base = (process.env.NEXT_PUBLIC_SITE_URL || "https://rifq.app");

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/quran",
    "/tafsir",
    "/hifz",
    "/tajweed",
    "/adhkar",
    "/library",
    "/library/hadith",
    "/library/seerah",
    "/library/fiqh",
    "/search",
    "/quizzes",
    "/plan",
    "/about",
    "/bookmarks",
    "/faq",
    "/wird",
    "/contact",
    "/privacy",
    "/support",
    "/auth/login",
    "/auth/register",
  ];
  return routes.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" || path === "/quran" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/quran" ? 0.9 : 0.7,
  }));
}
