"use client";

import { useState, useEffect } from 'react';
import { Search, Sparkles, Filter, FileText, Loader2, Bookmark, Share2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useRouter } from 'next/navigation';
import { ArticleCard } from '@/components/ArticleCard';
import HeroSection from '@/components/HeroSection';
import { Article, mockArticles } from '@/data/mockArticles';
import { createClient } from '@/utils/supabase/client';
import { fetchArticles, searchArticles, getUserPersonality, getPersonalizedArticles } from '@/data/db';
import { useAuth } from '@/context/AuthContext';
import { CatchUp } from '@/components/CatchUp';

export default function DiscoverPage() {
  const [activeTab, setActiveTab] = useState<'discover' | 'search'>('discover');
  const [searchQuery, setSearchQuery] = useState('');
  const [discoverArticles, setDiscoverArticles] = useState<Article[]>([]);
  const [personalizedArticles, setPersonalizedArticles] = useState<Article[]>([]);
  const [searchResults, setSearchResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticles, setSelectedArticles] = useState<Article[]>([]);
  const [summary, setSummary] = useState<string | null>(null);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const { user } = useAuth();
  const userMetadata = user?.user_metadata;
  const [catchUpSummary, setCatchUpSummary] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Check if user needs to complete personality assessment
  useEffect(() => {
    const checkPersonalityCompletion = async () => {
      if (!user?.id) return;

      try {
        const { data, error } = await supabase
          .from('users')
          .select('personality_completed')
          .eq('id', user.id)
          .single();

        if (error || !data || !data.personality_completed) {
          // Redirect to assessment if not completed
          router.push('/assessment');
        }
      } catch (e) {
        console.error('Error checking personality completion:', e);
        // If error, still allow access (fallback)
      }
    };

    if (user?.id) {
      checkPersonalityCompletion();
    }
  }, [user?.id, router, supabase]);

  const formatDate = () => {
    if (!mounted) return "";
    return new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };

  const getUserEdition = () => {
    if (!userMetadata?.full_name) return "Global Priorities";
    const firstName = userMetadata.full_name.split(' ')[0];
    return `The ${firstName} Edition`;
  };

  useEffect(() => {
    async function loadDiscover() {
      setLoading(true);

      // Set a security timeout to prevent indefinite loading
      const timeoutId = setTimeout(() => {
        setLoading(false);
        if (discoverArticles.length === 0) {
          setDiscoverArticles([...mockArticles]);
        }
      }, 8000);

      try {
        // Fetch personality profile
        const personality = await getUserPersonality(supabase, user?.id);

        // Get personalized articles
        const personalized = await getPersonalizedArticles(supabase, personality);

        // Get all articles as fallback
        const allArticles = await fetchArticles(supabase);

        const userPreferences = user?.user_metadata?.news_preference
          ? [user.user_metadata.news_preference.toLowerCase()]
          : ['markets', 'tech', 'finance', 'news', 'industry', 'prime', 'wealth'];

        const topArticles = allArticles.filter(a =>
          userPreferences.some(pref => a.category.toLowerCase().includes(pref))
        );

        setPersonalizedArticles(personalized.length > 0 ? personalized : []);
        setDiscoverArticles(topArticles.length > 0 ? topArticles : allArticles);
      } catch (error) {
        console.error("Error loading discover feed:", error);
        setDiscoverArticles([...mockArticles]);
      } finally {
        clearTimeout(timeoutId);
        setLoading(false);
      }
    }

    if (activeTab === 'discover') {
      loadDiscover();
      setSummary(null);
    }
  }, [activeTab, user?.id]);

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

  const handleSummarize = async (articlesToSummarize: Article[], query?: string, isFollowUp = false) => {
    if (articlesToSummarize.length === 0) return;

    setIsSummarizing(true);
    let currentHistory = [...messages];

    if (isFollowUp && query) {
      currentHistory.push({ role: 'user', content: query });
      setMessages(currentHistory);
    }

    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articles: articlesToSummarize.map(a => ({ title: a.title, content: a.content })),
          query: isFollowUp ? undefined : query,
          history: currentHistory,
          userContext: userMetadata
        })
      });

      if (!response.ok) throw new Error('Failed to generate summary');
      const data = await response.json();

      const assistantMsg = { role: 'assistant' as const, content: data.summary };
      setMessages(prev => [...prev, assistantMsg]);
      setSummary(data.summary); // Legacy support for discover tab
    } catch (error) {
      console.error('Error generating summary:', error);
      const errorMsg = { role: 'assistant' as const, content: "Sorry, we couldn't generate a response at this time." };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsSummarizing(false);
    }
  };

  // Hero split: 1 main, 2 side
  const heroMain = discoverArticles[0];
  const heroSide = discoverArticles.slice(1, 3);
  const remainingArticles = discoverArticles.slice(3);

  return (
    <div className="max-w-[1280px] mx-auto space-y-8">
      {/* Tab Navigation */}
      <div className="flex border-b border-et-border mb-6">
        <button
          onClick={() => setActiveTab('discover')}
          className={`px-8 py-3 text-sm font-bold uppercase tracking-widest transition-all cursor-pointer ${activeTab === 'discover'
            ? 'border-b-4 border-et-red text-et-red'
            : 'text-et-grey-medium hover:text-black border-b-4 border-transparent'
            }`}
        >
          Discover
        </button>
        <button
          onClick={() => setActiveTab('search')}
          className={`px-8 py-3 text-sm font-bold uppercase tracking-widest transition-all cursor-pointer ${activeTab === 'search'
            ? 'border-b-4 border-et-red text-et-red'
            : 'text-et-grey-medium hover:text-black border-b-4 border-transparent'
            }`}
        >
          AI Search
        </button>
      </div>

      {activeTab === 'discover' && (
        <div className="space-y-10">
          {loading ? (
            <div className="py-20 text-center text-et-grey-medium font-serif italic text-lg animate-pulse">
              Curating your personalized Economic Times feed...
            </div>
          ) : (
            <>
              <CatchUp
                lastLogin={userMetadata?.last_login_at}
                articles={discoverArticles}
                summary={catchUpSummary}
                isSummarizing={isSummarizing}
                onSummarize={async (articles, query) => {
                  setIsSummarizing(true);
                  try {
                    const response = await fetch('/api/summarize', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        articles: articles.map(a => ({ title: a.title, content: a.content })),
                        query,
                        userContext: userMetadata
                      })
                    });
                    const data = await response.json();
                    setCatchUpSummary(data.summary);
                  } catch (e) {
                    console.error(e);
                  } finally {
                    setIsSummarizing(false);
                  }
                }}
              />
              {heroMain && (
                <HeroSection
                  mainArticle={heroMain}
                  sideArticles={heroSide}
                  selectable={activeTab === 'discover'}
                  selectedArticles={selectedArticles}
                  onSelect={handleSelectArticle}
                />
              )}

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 space-y-8">
                  <div className="flex flex-col gap-1 border-b-2 border-black pb-2 mb-6">
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif font-black text-2xl uppercase tracking-tight">
                        {getUserEdition()}
                      </h3>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleSummarize(selectedArticles)}
                          disabled={selectedArticles.length === 0 || isSummarizing}
                          className="flex items-center gap-2 px-6 py-2 bg-et-red text-white rounded-sm font-bold text-[13px] hover:bg-red-700 disabled:opacity-30 disabled:grayscale transition-all uppercase tracking-widest shadow-md"
                        >
                          {isSummarizing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                          Collective Intelligence ({selectedArticles.length})
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-black text-et-grey-medium min-h-[16px]">
                      {mounted && (
                        <>
                          <span>{formatDate()}</span>
                          <span className="text-et-red">●</span>
                          <span>Vol CCIV No. 124</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* AI Summary Section */}
                  {(summary || isSummarizing) && (
                    <div className="bg-gradient-to-br from-[#fdf2f2] via-white to-[#fff5f5] border border-[#fbd5d5] rounded-sm p-8 mb-8 relative overflow-hidden shadow-sm">
                      <div className="absolute top-0 right-0 p-2 flex gap-2">
                        <button className="p-1.5 text-et-grey-medium hover:text-et-red transition-colors"><Bookmark className="w-4 h-4" /></button>
                        <button className="p-1.5 text-et-grey-medium hover:text-et-red transition-colors"><Share2 className="w-4 h-4" /></button>
                      </div>
                      <div className="flex items-center gap-2 mb-6">
                        <div className="bg-et-red p-1 rounded-sm"><Sparkles className="w-4 h-4 text-white" /></div>
                        <h3 className="text-lg font-black font-serif text-et-red uppercase tracking-tight">ET Intelligence Summary</h3>
                      </div>
                      {isSummarizing ? (
                        <div className="flex items-center gap-3 text-et-red/80 font-bold animate-pulse font-serif">
                          <Loader2 className="w-5 h-5 animate-spin" /> Synthesizing data points for you...
                        </div>
                      ) : (
                        <div className="prose prose-sm max-w-none text-et-grey-dark [&_h1]:text-2xl [&_h1]:font-black [&_h1]:font-serif [&_h1]:text-et-red [&_h1]:mt-6 [&_h1]:mb-4 [&_h1]:border-b [&_h1]:border-et-border [&_h1]:pb-2 [&_h2]:text-xl [&_h2]:font-black [&_h2]:font-serif [&_h2]:text-et-red [&_h2]:mt-5 [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-black [&_h3]:font-serif [&_h3]:text-et-red [&_h3]:mt-4 [&_h3]:mb-2 [&_strong]:text-et-red [&_strong]:font-black [&_em]:italic [&_em]:text-et-grey-dark [&_ul]:list-disc [&_ul]:list-inside [&_ul]:space-y-2 [&_ul]:my-4 [&_ol]:list-decimal [&_ol]:list-inside [&_ol]:space-y-2 [&_ol]:my-4 [&_li]:text-base [&_li]:leading-relaxed [&_p]:text-base [&_p]:leading-relaxed [&_p]:my-3 [&_blockquote]:border-l-4 [&_blockquote]:border-et-red [&_blockquote]:pl-4 [&_blockquote]:py-1 [&_blockquote]:my-4 [&_blockquote]:italic [&_blockquote]:text-et-grey-medium [&_code]:bg-et-surface [&_code]:px-2 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-[13px] [&_code]:font-mono [&_code]:text-et-red">
                          <ReactMarkdown
                            components={{
                              h1: ({ node, ...props }) => <h1 className="text-2xl font-black font-serif text-et-red mt-6 mb-4 border-b border-et-border pb-2" {...props} />,
                              h2: ({ node, ...props }) => <h2 className="text-xl font-black font-serif text-et-red mt-5 mb-3" {...props} />,
                              h3: ({ node, ...props }) => <h3 className="text-lg font-black font-serif text-et-red mt-4 mb-2" {...props} />,
                              strong: ({ node, ...props }) => <strong className="font-black text-et-red" {...props} />,
                              em: ({ node, ...props }) => <em className="italic text-et-grey-dark" {...props} />,
                              ul: ({ node, ...props }) => <ul className="list-disc list-inside space-y-2 my-4 ml-4" {...props} />,
                              ol: ({ node, ...props }) => <ol className="list-decimal list-inside space-y-2 my-4 ml-4" {...props} />,
                              li: ({ node, ...props }) => <li className="text-base leading-relaxed" {...props} />,
                              p: ({ node, ...props }) => <p className="text-base leading-relaxed my-3" {...props} />,
                              blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-et-red pl-4 py-1 my-4 italic text-et-grey-medium" {...props} />,
                              code: ({ node, ...props }) => <code className="bg-et-surface px-2 py-0.5 rounded text-[13px] font-mono text-et-red" {...props} />,
                            }}
                          >
                            {summary}
                          </ReactMarkdown>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10 border-t border-et-border pt-10 mt-10">
                      <div className="md:col-span-2">
                        <h4 className="font-serif font-black text-xl border-b border-et-border pb-2 mb-8 flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-et-red" />
                          Recommended for You
                        </h4>
                      </div>
                    </div>
                    {personalizedArticles.length > 0 ? (
                      personalizedArticles.map(article => (
                        <ArticleCard
                          key={article.id}
                          article={article}
                          selectable={true}
                          selected={selectedArticles.some(a => a.id === article.id)}
                          onSelect={handleSelectArticle}
                          onPersonalizedSummary={(a) => handleSummarize([a], "How does this news specifically affect me and what should I do?")}
                        />
                      ))
                    ) : (
                      <div className="text-center py-8 text-et-grey-medium font-serif italic">
                        No personalized recommendations yet. Check back soon!
                      </div>
                    )}
                  </div>

                  <div className="space-y-8 mt-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10 border-t border-et-border pt-10 mt-10">
                      <div className="md:col-span-2">
                        <h4 className="font-serif font-black text-xl border-b border-et-border pb-2 mb-8 flex items-center gap-2">
                          <Filter className="w-4 h-4 text-et-red" />
                          {userMetadata?.investment_goals ? `Curated for: ${userMetadata.investment_goals} Goals` : "News for You"}
                        </h4>
                      </div>
                    </div>
                    {remainingArticles.map(article => (
                      <ArticleCard
                        key={article.id}
                        article={article}
                        selectable={true}
                        selected={selectedArticles.some(a => a.id === article.id)}
                        onSelect={handleSelectArticle}
                        onPersonalizedSummary={(a) => handleSummarize([a], "How does this news specifically affect me and what should I do?")}
                      />
                    ))}
                  </div>
                </div>

                {/* Right Sidebar */}
                <div className="lg:col-span-4 space-y-8">
                  <div className="bg-white border border-et-border p-5 rounded-sm">
                    <h4 className="font-serif font-black text-xl mb-4 border-b border-et-border pb-2">Trending Stocks</h4>
                    <div className="space-y-4">
                      {['Reliance Industries', 'HDFC Bank', 'ICICI Bank', 'Infosys', 'TCS'].map((stock, i) => (
                        <div key={i} className="flex items-center justify-between py-2 border-b border-et-border last:border-0">
                          <span className="text-[14px] font-bold text-et-grey-dark">{stock}</span>
                          <span className={`text-[13px] font-black ${i % 2 === 0 ? 'text-sensex-green' : 'text-sensex-red'}`}>
                            {i % 2 === 0 ? '+' : '-'}{(Math.random() * 2).toFixed(2)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-black text-white p-6 rounded-sm">
                    <h4 className="font-serif font-black text-xl mb-2 text-et-red">ET Prime Premium</h4>
                    <p className="text-[13px] text-gray-400 mb-6">Invest in yourself with sharpest analysis of economy, business and politics.</p>
                    <ul className="space-y-3 mb-6">
                      {['Exclusive Daily Briefings', 'Interactive Market Dashboards', 'Members Only Events'].map((feat, i) => (
                        <li key={i} className="flex items-start gap-2 text-[12px] font-medium">
                          <div className="w-4 h-4 rounded-full bg-et-red flex items-center justify-center flex-shrink-0 mt-0.5">✓</div>
                          {feat}
                        </li>
                      ))}
                    </ul>
                    <button className="w-full bg-et-red py-3 rounded-sm font-black text-[14px] uppercase tracking-widest hover:bg-red-700 transition-colors">
                      Join ET Prime
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {activeTab === 'search' && (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 bg-black text-white px-3 py-1 rounded-full text-[12px] font-black italic tracking-tighter mb-4">
              <Sparkles className="w-3.5 h-3.5 text-et-red" /> POWERED BY ET INTELLIGENCE
            </div>
            <h2 className="font-serif font-black text-4xl lg:text-5xl tracking-tight text-et-grey-dark">Financial Insights at Your Fingertips</h2>
            <p className="text-et-grey-medium font-bold uppercase tracking-widest text-[11px] font-sans">Search across thousands of articles with AI-powered synthesis.</p>
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-et-grey-medium group-focus-within:text-et-red transition-colors" />
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-4 py-5 border-2 border-et-border rounded-none focus:ring-0 focus:border-et-red text-xl font-serif shadow-lg transition-all bg-white"
              placeholder="Ask anything about business, markets, or tech..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && messages.length > 0) {
                  handleSummarize(searchResults, searchQuery, true);
                  setSearchQuery('');
                }
              }}
            />
          </div>

          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {messages.length > 0 && (
              <div className="space-y-6">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-none p-6 shadow-sm border ${msg.role === 'user'
                      ? 'bg-et-grey-dark text-white border-et-grey-dark'
                      : 'bg-white border-et-border text-et-grey-dark'
                      }`}>
                      {msg.role === 'assistant' && (
                        <div className="flex items-center gap-2 mb-3 text-et-red font-bold uppercase tracking-widest text-[10px] font-sans border-b border-et-border pb-2">
                          <Sparkles className="w-3.5 h-3.5" /> ET Intelligence
                        </div>
                      )}
                      <div className={`leading-relaxed font-serif text-lg whitespace-pre-wrap ${msg.role === 'user' ? 'italic opacity-90' : ''}`}>
                        {msg.content.split('Suggested Next Questions:')[0]}
                      </div>

                      {msg.role === 'assistant' && msg.content.includes('Suggested Next Questions:') && (
                        <div className="mt-6 pt-6 border-t border-et-border">
                          <p className="text-[10px] font-black uppercase tracking-widest text-et-grey-medium mb-3">Suggested for you:</p>
                          <div className="flex flex-wrap gap-2">
                            {msg.content.split('Suggested Next Questions:')[1].split('\n').filter(q => q.trim()).map((q, j) => {
                              const cleanQ = q.replace(/^\d+\.\s*/, '').replace(/^-\s*/, '').trim();
                              if (!cleanQ) return null;
                              return (
                                <button
                                  key={j}
                                  onClick={() => {
                                    handleSummarize(searchResults, cleanQ, true);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                  }}
                                  className="text-[12px] font-bold text-et-grey-dark px-3 py-1.5 border border-et-border hover:border-et-red hover:text-et-red transition-all rounded-none bg-et-surface"
                                >
                                  {cleanQ}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isSummarizing && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-et-border p-6 shadow-sm rounded-none max-w-[85%] animate-pulse">
                      <div className="flex items-center gap-3 text-et-red font-bold font-serif italic text-lg">
                        <Loader2 className="w-5 h-5 animate-spin" /> Digging into ET archives...
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {!loading && searchResults.length > 0 && messages.length === 0 && (
              <div className="text-center py-10">
                <p className="text-et-grey-medium font-serif italic">Analyzing your query...</p>
              </div>
            )}

            {loading && messages.length === 0 && (
              <div className="py-12 text-center text-et-red font-bold flex justify-center items-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin" /> Querying news engine...
              </div>
            )}

            {!loading && searchResults.length > 0 && (
              <div>
                <h3 className="font-serif font-black text-2xl mb-6 border-b-2 border-black pb-2 uppercase tracking-tight">Source Material</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {searchResults.map(article => (
                    <div key={article.id} className="opacity-80 hover:opacity-100 transition-opacity">
                      <ArticleCard article={article} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!loading && searchResults.length === 0 && searchQuery && (
              <div className="text-center py-20 border-2 border-dashed border-et-border rounded-none">
                <p className="text-et-grey-medium font-serif text-xl italic">No archives found matching "{searchQuery}". Try a broader topic.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
