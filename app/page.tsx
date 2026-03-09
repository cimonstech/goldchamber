import { getPublishedArticles } from "@/lib/articles-db";
import { HomePageClient } from "@/components/HomePageClient";

export default async function HomePage() {
  const articles = await getPublishedArticles();
  return <HomePageClient articles={articles} />;
}
