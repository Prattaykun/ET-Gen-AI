import { Article } from '@/data/mockArticles';
import Image from 'next/image';
import Link from 'next/link';

export function ArticleCard({ article }: { article: Article }) {
  const timeAgo = (dateString: string) => {
    const hours = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours} hrs ago`;
    return `${Math.floor(hours / 24)} days ago`;
  };

  return (
    <article className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
      <div className="relative h-48 w-full bg-gray-100 flex-shrink-0">
        <Image
          src={article.imageUrl}
          alt={article.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-red-600 uppercase tracking-wider">{article.category}</span>
          <span className="text-xs text-gray-500">{timeAgo(article.timestamp)}</span>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">
          <Link href={`#`} className="hover:text-red-600 transition-colors">
            {article.title}
          </Link>
        </h3>
        <p className="text-sm text-gray-600 line-clamp-3">
          {article.content}
        </p>
      </div>
    </article>
  );
}
