"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getArticleById } from '@/data/db';
import { createClient } from '@/utils/supabase/client';
import { Article } from '@/data/mockArticles';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import { ChevronLeft, Sparkles, Loader2, Bookmark, Share2, Calendar, User, ArrowRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function ArticleDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);
    const [expansion, setExpansion] = useState<string | null>(null);
    const [isExpanding, setIsExpanding] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        async function loadArticle() {
            if (!id) return;
            setLoading(true);
            const data = await getArticleById(supabase, id as string);
            setArticle(data);
            setLoading(false);

            if (data) {
                handleExpand(data);
            }
        }
        loadArticle();
    }, [id]);

    const handleExpand = async (articleData: Article) => {
        setIsExpanding(true);
        try {
            const response = await fetch('/api/expand', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: articleData.title,
                    content: articleData.content,
                    category: articleData.category,
                    userContext: user?.user_metadata
                })
            });

            if (!response.ok) throw new Error('Expansion failed');
            const data = await response.json();
            setExpansion(data.expansion);
        } catch (error) {
            console.error('Error expanding article:', error);
        } finally {
            setIsExpanding(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-10 h-10 text-et-red animate-spin" />
                <p className="font-serif italic text-et-grey-medium">Retrieving from archives...</p>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="py-20 text-center space-y-6">
                <h2 className="text-3xl font-serif font-black uppercase text-et-grey-dark">Article Not Found</h2>
                <button onClick={() => router.back()} className="text-et-red font-bold uppercase tracking-widest flex items-center gap-2 mx-auto hover:gap-4 transition-all">
                    <ChevronLeft className="w-4 h-4" /> Back to News Feed
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-[850px] mx-auto pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Navigation */}
            <div className="mb-10 flex items-center justify-between border-b border-et-border pb-6 sticky top-0 bg-white/80 backdrop-blur-md z-10 pt-2">
                <button
                    onClick={() => router.back()}
                    className="group flex items-center gap-2 text-et-grey-medium hover:text-black font-extrabold text-[12px] uppercase tracking-[0.2em] transition-all"
                >
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Archives
                </button>
                <div className="flex gap-4">
                    <button className="p-2 text-et-grey-medium hover:text-et-red transition-colors"><Bookmark className="w-5 h-5" /></button>
                    <button className="p-2 text-et-grey-medium hover:text-et-red transition-colors"><Share2 className="w-5 h-5" /></button>
                </div>
            </div>

            {/* Article Header */}
            <header className="space-y-6 mb-12">
                <div className="flex items-center gap-3">
                    <span className="bg-et-red text-white px-3 py-1 text-[11px] font-black uppercase tracking-widest rounded-sm">
                        {article.category}
                    </span>
                    <span className="text-[11px] font-black text-et-grey-medium uppercase tracking-[0.2em] flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(article.timestamp).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-black leading-[1.1] tracking-tighter text-et-grey-dark">
                    {article.title}
                </h1>

                <div className="flex items-center gap-4 py-6 border-y border-et-border">
                    <div className="w-10 h-10 rounded-full bg-et-grey-light flex items-center justify-center">
                        <User className="w-5 h-5 text-et-grey-medium" />
                    </div>
                    <div className="font-sans">
                        <p className="text-[12px] font-black uppercase tracking-widest text-et-grey-dark">ET Bureau</p>
                        <p className="text-[11px] font-bold text-et-grey-medium italic tracking-wide">Financial Intelligence Division</p>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 gap-12">
                <div className="space-y-8">
                    {/* Main Content */}
                    <div className="relative aspect-[16/9] mb-10 overflow-hidden bg-et-grey-light shadow-2xl">
                        <Image
                            src={article.imageUrl}
                            alt={article.title}
                            fill
                            className="object-cover"
                            priority
                            unoptimized
                        />
                    </div>

                    <div className="prose prose-lg max-w-none text-et-grey-dark font-serif leading-relaxed text-justify">
                        <p className="text-xl md:text-2xl font-black italic mb-8 border-l-4 border-et-red pl-6 leading-relaxed opacity-90">
                            {article.content}
                        </p>
                        <p className="text-lg leading-loose">{article.content}</p>
                    </div>

                    {/* AI Expansion Section */}
                    <section className="mt-20 border-t-2 border-black pt-12">
                        <div className="bg-gradient-to-br from-[#f8f9fa] to-white border border-et-border p-8 md:p-12 relative overflow-hidden group/ai">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover/ai:opacity-20 transition-opacity">
                                <Sparkles className="w-20 h-20 text-et-red" />
                            </div>

                            <div className="flex items-center gap-3 mb-10 border-b border-et-border pb-6">
                                <div className="bg-et-red p-2 rounded-sm shadow-lg">
                                    <Sparkles className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black font-serif text-et-red uppercase tracking-tight">ET Intelligence: Deep Dive</h3>
                                    <p className="text-[10px] uppercase font-black tracking-[0.3em] text-et-grey-medium mt-1">AI-Powered Strategic Analysis</p>
                                </div>
                            </div>

                            {isExpanding ? (
                                <div className="py-20 text-center space-y-6">
                                    <Loader2 className="w-10 h-10 text-et-red animate-spin mx-auto" />
                                    <div className="space-y-2">
                                        <p className="font-serif italic text-xl font-bold animate-pulse text-et-red">Synthesizing market signals...</p>
                                        <p className="text-[11px] uppercase font-black tracking-widest text-et-grey-medium">Llama-3.3 Advanced Model Processing</p>
                                    </div>
                                </div>
                            ) : expansion ? (
                                <div className="prose prose-sm md:prose-base max-w-none text-et-grey-dark font-sans 
                  [&_h1]:text-3xl [&_h1]:font-black [&_h1]:font-serif [&_h1]:text-et-red [&_h1]:mt-10 [&_h1]:mb-6 [&_h1]:border-b-2 [&_h1]:border-et-border [&_h1]:pb-2
                  [&_h2]:text-2xl [&_h2]:font-black [&_h2]:font-serif [&_h2]:text-et-red [&_h2]:mt-8 [&_h2]:mb-4
                  [&_h3]:text-xl [&_h3]:font-black [&_h3]:font-serif [&_h3]:text-et-red [&_h3]:mt-6 [&_h3]:mb-3
                  [&_strong]:text-et-red [&_strong]:font-black
                  [&_ul]:list-none [&_ul]:space-y-4 [&_ul]:my-6
                  [&_li]:relative [&_li]:pl-6 [&_li]:text-[16px] [&_li]:leading-relaxed
                  [&_li]:before:content-['●'] [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:text-et-red [&_li]:before:text-[10px] [&_li]:before:top-[8px]
                  [&_p]:text-[17px] [&_p]:leading-[1.8] [&_p]:my-4
                  [&_a]:text-et-red [&_a]:font-bold [&_a]:underline [&_a]:decoration-et-red/30 [&_a:hover]:decoration-et-red transition-all
                ">
                                    <ReactMarkdown>{expansion}</ReactMarkdown>
                                </div>
                            ) : (
                                <div className="py-10 text-center">
                                    <p className="text-et-grey-medium italic">Deep Dive analysis currently unavailable.</p>
                                </div>
                            )}

                            <div className="mt-12 pt-8 border-t border-et-border flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-et-grey-medium">
                                <span>© ET GLOBAL INTELLIGENCE UNIT</span>
                                <span className="flex items-center gap-2">Data Integrity Verified <ArrowRight className="w-3 h-3 text-et-red" /></span>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
