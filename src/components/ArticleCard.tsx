import { Article } from '@/data/mockArticles';
import Image from 'next/image';
import Link from 'next/link';

interface ArticleCardProps {
  article: Article;
  selectable?: boolean;
  selected?: boolean;
  onSelect?: (article: Article) => void;
}

export function ArticleCard({ article, selectable, selected, onSelect }: ArticleCardProps) {
  const timeAgo = (dateString: string) => {
    const hours = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours} hrs ago`;
    return `${Math.floor(hours / 24)} days ago`;
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (selectable && onSelect) {
      e.preventDefault();
      onSelect(article);
    }
  };

  return (
    <article
      className={`bg-white border ${selected ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-200'} rounded-lg overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full relative cursor-pointer`}
      onClick={handleCardClick}
    >
      {selectable && (
        <div className="absolute top-2 right-2 z-10">
          <input
            type="checkbox"
            checked={selected}
            onChange={() => {}} // Handled by card click
            className="w-5 h-5 accent-red-600 rounded cursor-pointer pointer-events-none"
          />
        </div>
      )}
      <div className="relative h-48 w-full bg-gray-100 flex-shrink-0">
        <Image
          src={article.imageUrl}
          alt={article.title}
          fill
          className={`object-cover ${selected ? 'opacity-90' : ''}`}
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-red-600 uppercase tracking-wider">{article.category}</span>
          <span className="text-xs text-gray-500">{timeAgo(article.timestamp)}</span>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">
          {selectable ? (
             <span className="hover:text-red-600 transition-colors">
               {article.title}
             </span>
          ) : (
            <Link href={`#`} className="hover:text-red-600 transition-colors">
              {article.title}
            </Link>
          )}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-3">
          {article.content}
        </p>
      </div>
    </article>
  );
}
