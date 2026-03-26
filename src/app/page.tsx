"use client";

import { useState, useEffect } from 'react';
import { Search, Sparkles, Filter, FileText, Loader2 } from 'lucide-react';
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
  const [selectedArticles, setSelectedArticles] = useState<Article[]>([]);
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    async function loadDiscover() {
      setLoading(true);
      const allArticles = await fetchArticles(supabase);
      // For demonstration, selecting a few categories
      const userPreferences = ['markets', 'tech', 'finance'];
      const personalized = allArticles.filter(a => userPreferences.includes(a.category));
      setDiscoverArticles(personalized.length > 0 ? personalized : allArticles); // fallback to all if empty
      setLoading(false);
    }

    if (activeTab === 'discover') {
      loadDiscover();
      setSummary(null); // Clear summary when switching tabs
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  useEffect(() => {
    async function loadSearch() {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        setSummary(null);
        return;
      }
      setLoading(true);
      const results = await searchArticles(supabase, searchQuery);
      setSearchResults(results);
      setLoading(false);

      if (results.length > 0) {
        handleSummarize(results, searchQuery);
      } else {
        setSummary(null);
      }
    }

    const timer = setTimeout(() => {
      if (activeTab === 'search') {
        loadSearch();
      }
    }, 800);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, activeTab]);

  const handleSelectArticle = (article: Article) => {
    setSelectedArticles(prev => {
      const isSelected = prev.some(a => a.id === article.id);
      if (isSelected) {
        return prev.filter(a => a.id !== article.id);
      } else {
        return [...prev, article];
      }
    });
  };

  const handleSummarize = async (articlesToSummarize: Article[], query?: string) => {
    if (articlesToSummarize.length === 0) return;

    setIsSummarizing(true);
    setSummary(null);
    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articles: articlesToSummarize.map(a => ({ title: a.title, content: a.content })),
          query: query
        })
      });

      if (!response.ok) throw new Error('Failed to generate summary');
      const data = await response.json();
      setSummary(data.summary);
    } catch (error) {
      console.error('Error generating summary:', error);
      setSummary("Sorry, we couldn't generate a summary at this time.");
    } finally {
      setIsSummarizing(false);
    }
  };


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
            <div>
              <h2 className="text-2xl font-bold">For You</h2>
              <p className="text-gray-600">Personalized articles based on your interest. Select multiple to get a combined summary.</p>
            </div>
            <div className="flex gap-2">
               <button
                  onClick={() => handleSummarize(selectedArticles)}
                  disabled={selectedArticles.length === 0 || isSummarizing}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSummarizing ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                  Summarize ({selectedArticles.length})
                </button>
              <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 border border-gray-300 rounded-lg px-3 py-2">
                <Filter className="w-4 h-4" /> Customize
              </button>
            </div>
          </div>

          {/* Discover Summary Section */}
          {(summary || isSummarizing) && (
            <div className="bg-red-50 border border-red-100 rounded-lg p-6 animate-in fade-in slide-in-from-top-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-red-600" />
                <h3 className="text-lg font-bold text-red-900">Combined AI Summary</h3>
              </div>
              {isSummarizing ? (
                 <div className="flex items-center gap-2 text-red-700">
                    <Loader2 className="w-4 h-4 animate-spin" /> Analyzing selected articles...
                 </div>
              ) : (
                 <div className="text-red-900 leading-relaxed whitespace-pre-wrap">{summary}</div>
              )}
            </div>
          )}

          {loading ? (
             <div className="py-12 text-center text-gray-500">Loading personalized feed...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {discoverArticles.map(article => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  selectable={true}
                  selected={selectedArticles.some(a => a.id === article.id)}
                  onSelect={handleSelectArticle}
                />
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
                 <div className="py-12 text-center text-gray-500 flex justify-center items-center gap-2">
                   <Loader2 className="w-5 h-5 animate-spin" /> Searching...
                 </div>
              ) : searchResults.length > 0 ? (
                <>
                  {/* AI Summary Section */}
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-5 h-5 text-blue-600" />
                      <h3 className="text-lg font-bold text-blue-900">AI Summary</h3>
                    </div>
                    {isSummarizing ? (
                       <div className="flex items-center gap-2 text-blue-700">
                         <Loader2 className="w-4 h-4 animate-spin" /> Generating summary...
                       </div>
                    ) : (
                      <div className="text-blue-900 leading-relaxed whitespace-pre-wrap">{summary}</div>
                    )}
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
