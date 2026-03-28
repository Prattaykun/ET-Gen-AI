import { ArticleCard } from '@/components/ArticleCard';
import { fetchArticles } from '@/data/db';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

interface NewsCategoryPageProps {
    category: string;
    title: string;
}

export default async function NewsCategoryPage({ category, title }: NewsCategoryPageProps) {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const articles = await fetchArticles(supabase, category);

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <div className="flex flex-col gap-2 border-b-4 border-black pb-6">
                <h1 className="font-serif font-black text-4xl lg:text-5xl uppercase tracking-tight">{title}</h1>
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-black text-et-grey-medium">
                    <span>{new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    <span className="text-et-red">●</span>
                    <span>Gen AI News Integration</span>
                </div>
            </div>

            {articles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
                    {articles.map((article) => (
                        <div key={article.id} className="group">
                            <ArticleCard article={article} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-20 text-center border-2 border-dashed border-et-border">
                    <p className="text-et-grey-medium font-serif italic text-xl">
                        No updates found for {title} at the moment. Please check back shortly for AI-curated insights.
                    </p>
                </div>
            )}
        </div>
    );
}
