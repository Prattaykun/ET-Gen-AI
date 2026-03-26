"use client";

import { useState, useEffect } from 'react';
import { Search, Sparkles, Filter } from 'lucide-react';
import { ArticleCard } from '@/components/ArticleCard';
import { Article } from '@/data/mockArticles';
import { createClient } from '@/utils/supabase/client';
import { fetchArticles, searchArticles } from '@/data/db';

export default function DiscoverPage() {
  const [activeTab, setActiveTab] = useState<'discover' | 'search'>('discover');
  const [searchQuery, setSearchQuery] = useState('');
  const [discoverArticles, setDiscoverArticles] = useState<Article[]>([]);
  const [searchResults, setSearchResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    async function loadDiscover() {
      setLoading(true);
      // Fetch all articles, then filter by preferences.
      const allArticles = await fetchArticles(supabase);
      const userPreferences = ['markets', 'tech', 'finance'];
      const personalized = allArticles.filter(a => userPreferences.includes(a.category));
      setDiscoverArticles(personalized);
      setLoading(false);
    }

    if (activeTab === 'discover') {
      loadDiscover();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  useEffect(() => {
    async function loadSearch() {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }
      setLoading(true);
      const results = await searchArticles(supabase, searchQuery);
      setSearchResults(results);
      setLoading(false);
    }

    const timer = setTimeout(() => {
      if (activeTab === 'search') {
        loadSearch();
      }
    }, 500); // Debounce search

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, activeTab]);

  // Generate a mock summary
  const summary = searchResults.length > 0
    ? `Here's a summary of ${searchResults.length} articles matching "${searchQuery}": ${searchResults.map(a => a.title).join(". ")}. These articles discuss recent developments primarily in the ${[...new Set(searchResults.map(a => a.category))].join(" and ")} sectors.`
    : null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200">
        <button
          data-testid="tab-discover"
          id="tab-discover"
          onClick={() => setActiveTab('discover')}
          className={`flex-1 py-4 text-center font-medium text-lg flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'discover'
              ? 'border-b-2 border-red-600 text-red-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          Discover
        </button>
        <button
          data-testid="tab-search"
          id="tab-search"
          onClick={() => setActiveTab('search')}
          className={`flex-1 py-4 text-center font-medium text-lg flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'search'
              ? 'border-b-2 border-red-600 text-red-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Search className="w-5 h-5" />
          Search
        </button>
      </div>

      {activeTab === 'discover' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">For You</h2>
            <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 border border-gray-300 rounded-full px-3 py-1">
              <Filter className="w-4 h-4" /> Customize Feed
            </button>
          </div>
          <p className="text-gray-600">Personalized articles based on your interest in Markets and Technology.</p>

          {loading ? (
             <div className="py-12 text-center text-gray-500">Loading personalized feed...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {discoverArticles.map(article => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'search' && (
        <div className="space-y-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              data-testid="search-input"
              className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 text-lg shadow-sm"
              placeholder="What's on your mind? Search articles, companies, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {searchQuery && (
            <div className="space-y-8">
              {loading ? (
                 <div className="py-12 text-center text-gray-500">Searching...</div>
              ) : searchResults.length > 0 ? (
                <>
                  {/* AI Summary Section */}
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-5 h-5 text-blue-600" />
                      <h3 className="text-lg font-bold text-blue-900">AI Summary</h3>
                    </div>
                    <p className="text-blue-800 leading-relaxed">{summary}</p>
                  </div>

                  {/* Results List */}
                  <div>
                    <h3 className="text-xl font-bold mb-4">Sources</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {searchResults.map(article => (
                        <ArticleCard key={article.id} article={article} />
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No articles found matching &quot;{searchQuery}&quot;.</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
