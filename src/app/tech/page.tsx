import { ArticleCard } from '@/components/ArticleCard';
import { fetchArticles } from '@/data/db';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export default async function TechPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const articles = await fetchArticles(supabase, 'tech');

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-2">
        <h1 className="text-3xl font-bold">Tech</h1>
      </div>

      {articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No tech updates found.</p>
      )}
    </div>
  );
}
