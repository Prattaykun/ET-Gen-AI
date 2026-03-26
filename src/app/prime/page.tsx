import { ArticleCard } from '@/components/ArticleCard';
import { fetchArticles } from '@/data/db';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export default async function PrimePage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const articles = await fetchArticles(supabase, 'prime');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
        <h1 className="text-3xl font-bold">ET Prime</h1>
        <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider">Premium</span>
      </div>
      {articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No prime articles found.</p>
      )}
    </div>
  );
}
