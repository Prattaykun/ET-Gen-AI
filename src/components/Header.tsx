import Link from 'next/link';
import { Menu, Search, User } from 'lucide-react';

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <button className="p-1 hover:bg-gray-100 rounded">
            <Menu className="h-6 w-6 text-gray-700" />
          </button>
          <Link href="/" className="flex items-center">
            <span className="font-bold text-xl tracking-tight text-red-600">THE ECONOMIC TIMES</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/discover" className="p-1 hover:bg-gray-100 rounded text-gray-700">
            <Search className="h-5 w-5" />
          </Link>
          <button className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white rounded font-medium text-sm hover:bg-red-700 transition-colors">
            <User className="h-4 w-4" />
            <span>Sign In</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto no-scrollbar">
        <nav className="flex items-center gap-6 px-4 py-2 text-sm font-medium whitespace-nowrap text-gray-600">
          <Link href="/" className="hover:text-red-600 transition-colors py-1">Home</Link>
          <Link href="/prime" className="hover:text-red-600 transition-colors py-1">ET Prime</Link>
          <Link href="/markets" className="hover:text-red-600 transition-colors py-1">Markets</Link>
          <Link href="/news" className="hover:text-red-600 transition-colors py-1">News</Link>
          <Link href="/industry" className="hover:text-red-600 transition-colors py-1">Industry</Link>
          <Link href="/wealth" className="hover:text-red-600 transition-colors py-1">Wealth</Link>
          <Link href="/tech" className="hover:text-red-600 transition-colors py-1">Tech</Link>
          <Link href="/discover" className="hover:text-red-600 transition-colors py-1 font-bold text-red-600">Perplexity Search</Link>
        </nav>
      </div>
    </header>
  );
}
