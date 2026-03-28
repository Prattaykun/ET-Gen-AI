"use client";

import { useState } from 'react';
import { Article } from '@/data/mockArticles';
import Image from 'next/image';
import Link from 'next/link';
import { PlayCircle } from 'lucide-react';

interface HeroSectionProps {
    mainArticle: Article;
    sideArticles: Article[];
    selectable?: boolean;
    selectedArticles?: Article[];
    onSelect?: (article: Article) => void;
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=800';

function SafeImage({ src, alt, ...props }: any) {
    const [imgSrc, setImgSrc] = useState(src);
    return (
        <Image
            {...props}
            src={imgSrc || FALLBACK_IMAGE}
            alt={alt}
            onError={() => setImgSrc(FALLBACK_IMAGE)}
        />
    );
}

export default function HeroSection({ mainArticle, sideArticles, selectable, selectedArticles = [], onSelect }: HeroSectionProps) {
    const isSelected = (id: string) => selectedArticles.some(a => a.id === id);

    return (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-b border-et-border pb-10 mb-10 overflow-hidden">
            {/* Main Featured Article */}
            <div className={`lg:col-span-8 flex flex-col group relative ${selectable && isSelected(mainArticle.id) ? 'bg-et-red/5 -mx-4 px-4 py-2 rounded-sm transition-colors' : ''}`}>
                {selectable && (
                    <button
                        onClick={() => onSelect?.(mainArticle)}
                        className={`absolute top-4 left-4 z-20 w-6 h-6 rounded-sm border flex items-center justify-center transition-all duration-200 ${isSelected(mainArticle.id) ? 'bg-et-red border-et-red shadow-lg' : 'border-white/50 bg-black/20 backdrop-blur-sm hover:border-white'}`}
                    >
                        {isSelected(mainArticle.id) && (
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        )}
                    </button>
                )}
                <Link href={`/articles/${mainArticle.id}`} className="relative aspect-[16/9] overflow-hidden mb-5 bg-et-grey-light">
                    <SafeImage
                        src={mainArticle.imageUrl}
                        alt={mainArticle.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 840px"
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        priority
                        unoptimized
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <PlayCircle className="w-16 h-16 text-white/90 drop-shadow-2xl group-hover:scale-110 group-hover:text-white transition-all duration-300" />
                    </div>
                </Link>
                <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-et-red uppercase tracking-[0.15em] mb-2 font-sans">
                        {mainArticle.category}
                    </span>
                    <Link href={`/articles/${mainArticle.id}`}>
                        <h1 className="font-serif font-black text-3xl lg:text-[34px] leading-[1.1] mb-4 text-et-grey-dark hover:text-et-red transition-colors duration-200">
                            {mainArticle.title}
                        </h1>
                    </Link>
                    <p className="text-et-grey-dark/80 text-[15px] leading-[1.6] line-clamp-3 font-sans">
                        {mainArticle.content}
                    </p>
                </div>
            </div>

            {/* Side Articles */}
            <div className="lg:col-span-4 flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                    <div className="h-6 w-1 bg-et-red"></div>
                    <h3 className="text-[13px] font-bold uppercase tracking-[0.1em] text-et-grey-dark font-sans">
                        Top Stories
                    </h3>
                </div>
                <div className="flex flex-col">
                    {sideArticles.map((article, i) => (
                        <div key={i} className={`flex gap-4 group py-5 border-b border-et-border first:pt-0 last:border-0 last:pb-0 relative ${selectable && isSelected(article.id) ? 'bg-et-red/5 -mx-4 px-4 rounded-sm transition-colors' : ''}`}>
                            {selectable && (
                                <button
                                    onClick={() => onSelect?.(article)}
                                    className={`absolute top-2 left-[-12px] z-20 w-4 h-4 rounded-sm border flex items-center justify-center transition-all duration-200 ${isSelected(article.id) ? 'bg-et-red border-et-red shadow-md' : 'border-et-border bg-white hover:border-et-red'}`}
                                >
                                    {isSelected(article.id) && (
                                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </button>
                            )}
                            <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                                <span className="text-et-red text-[10px] font-bold uppercase tracking-wider font-sans">
                                    {article.category}
                                </span>
                                <Link href={`/articles/${article.id}`}>
                                    <h4 className="font-serif font-bold text-[17px] leading-[1.2] text-et-grey-dark hover:text-et-red transition-colors line-clamp-3">
                                        {article.title}
                                    </h4>
                                </Link>
                            </div>
                            <Link href={`/articles/${article.id}`} className="relative w-20 h-20 flex-shrink-0 overflow-hidden bg-et-grey-light">
                                <SafeImage
                                    src={article.imageUrl}
                                    alt={article.title}
                                    fill
                                    sizes="80px"
                                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                    unoptimized
                                />
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Prime Promo */}
                <div className="bg-et-surface p-5 border border-et-border mt-8 hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="bg-black text-white px-2 py-0.5 text-[10px] font-black italic tracking-tighter">ET PRIME</span>
                        <span className="text-[11px] font-bold text-et-grey-dark uppercase tracking-[0.1em] font-sans">Subscription</span>
                    </div>
                    <p className="text-[13px] font-bold text-et-grey-dark leading-snug mb-4">Get exclusive news, analysis and insights from ET Prime.</p>
                    <button className="w-full bg-[#f6ab2f] hover:bg-[#e09a25] text-black font-extrabold py-2.5 rounded-sm text-[12px] transition-all duration-200 uppercase tracking-[0.15em] shadow-sm hover:translate-y-[-1px]">
                        Try Now
                    </button>
                </div>
            </div>
        </section>
    );
}
