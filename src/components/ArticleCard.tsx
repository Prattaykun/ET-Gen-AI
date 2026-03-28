"use client";

import { Article } from '@/data/mockArticles';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
  selectable?: boolean;
  selected?: boolean;
  onSelect?: (article: Article) => void;
  onPersonalizedSummary?: (article: Article) => void;
}

export function ArticleCard({ article, selectable, selected, onSelect, onPersonalizedSummary }: ArticleCardProps) {
  const timeAgo = (dateString: string) => {
    const hours = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours} hrs ago`;
    return `${Math.floor(hours / 24)} days ago`;
  };

  const [imgSrc, setImgSrc] = useState(article.imageUrl);
  const fallbackImg = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=800';

  const handleCardClick = (e: React.MouseEvent) => {
    if (selectable && onSelect) {
      e.preventDefault();
      onSelect(article);
    }
  };

  const cardContent = (
    <div className="flex gap-5">
      {selectable && (
        <div className="flex-shrink-0 pt-1.5">
          <div className={`w-5 h-5 rounded-sm border flex items-center justify-center transition-all duration-200 ${selected ? 'bg-et-red border-et-red' : 'border-et-border bg-white group-hover:border-et-red group-hover:shadow-sm'}`}>
            {selected && (
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        </div>
      )}
      <div className="flex-1 space-y-1.5 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-et-red uppercase tracking-[0.1em] font-sans">{article.category}</span>
          <span className="text-[10px] text-et-grey-medium font-bold border-l border-et-border pl-2 leading-none uppercase tracking-wide font-sans">{timeAgo(article.timestamp)}</span>
        </div>
        <h3 className="font-serif font-bold text-[19px] leading-[1.2] text-et-grey-dark group-hover:text-et-red transition-colors line-clamp-2">
          {article.title}
        </h3>
        <p className="text-et-grey-dark/80 text-[13px] leading-[1.5] line-clamp-2 font-sans pt-0.5">
          {article.content}
        </p>
      </div>
      <div className="relative w-[115px] h-[75px] mt-1.5 flex-shrink-0 overflow-hidden bg-et-grey-light">
        <Image
          src={imgSrc}
          alt={article.title}
          fill
          sizes="115px"
          className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          onError={() => setImgSrc(fallbackImg)}
          unoptimized
        />
        {onPersonalizedSummary && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onPersonalizedSummary(article);
            }}
            className="absolute bottom-1 right-1 bg-black/70 hover:bg-et-red text-white p-1.5 rounded-sm transition-colors shadow-lg group/btn z-10"
            title="How this affects me?"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );

  if (selectable) {
    return (
      <article
        className={`bg-white border-b border-et-border pb-6 last:border-0 group cursor-pointer transition-all ${selected ? 'bg-et-red/5' : ''}`}
        onClick={handleCardClick}
      >
        {cardContent}
      </article>
    );
  }

  return (
    <Link href={`/articles/${article.id}`} className="block">
      <article className="bg-white border-b border-et-border pb-6 last:border-0 group cursor-pointer transition-all">
        {cardContent}
      </article>
    </Link>
  );
}
