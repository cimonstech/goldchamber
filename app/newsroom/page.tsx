import { getPublishedArticles } from "@/lib/articles-db";
import { NewsroomClient } from "@/components/newsroom/NewsroomClient";

export default async function NewsroomPage() {
  const articles = await getPublishedArticles();
  return <NewsroomClient articles={articles} />;
}
