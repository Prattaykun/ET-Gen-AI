import { ArticleCard } from '@/components/ArticleCard';
import { fetchArticles } from '@/data/db';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export default async function MarketsPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const articles = await fetchArticles(supabase, 'markets');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-gray-200 pb-2">
        <h1 className="text-3xl font-bold">Markets</h1>
        <div className="flex gap-4 mt-2 md:mt-0 text-sm">
          <div><span className="font-semibold text-gray-700">Sensex:</span> <span className="text-green-600 font-bold">75,273 ▲</span></div>
          <div><span className="font-semibold text-gray-700">Nifty:</span> <span className="text-green-600 font-bold">23,306 ▲</span></div>
        </div>
      </div>

      {articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No market updates found.</p>
      )}
    </div>
  );
}
