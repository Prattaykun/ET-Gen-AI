import { mockArticles, Article } from "@/data/mockArticles";
import { SupabaseClient } from "@supabase/supabase-js";
import { PersonalityProfile } from "@/data/personalityQuestions";

export async function fetchArticles(supabase: SupabaseClient, category?: string): Promise<Article[]> {
  try {
    let query = supabase.from('articles').select('*');

    if (category) {
      query = query.eq('category', category);
    }

    // Sort by timestamp descending
    query = query.order('timestamp', { ascending: false });

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      console.warn("Supabase fetch failed or returned no data, falling back to mock data.", error?.message || 'No data');
      let articles = [...mockArticles];
      if (category) {
        articles = articles.filter(a => a.category === category);
      }
      return articles.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }

    // Map snake_case to camelCase
    return data.map((d: Record<string, unknown>) => ({
      id: d.id as string,
      title: d.title as string,
      content: d.content as string,
      category: d.category as string,
      timestamp: d.timestamp as string,
      imageUrl: d.image_url as string
    }));
  } catch (e) {
    console.error("Exception during fetch, falling back to mock data", e);
    let articles = [...mockArticles];
    if (category) {
      articles = articles.filter(a => a.category === category);
    }
    return articles.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
}

export async function searchArticles(supabase: SupabaseClient, searchQuery: string): Promise<Article[]> {
  if (!searchQuery.trim()) return [];

  try {
    // Attempt text search across title and content
    // Using ilike for simple text matching on multiple columns
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%`)
      .order('timestamp', { ascending: false });

    if (error || !data || data.length === 0) {
      console.warn("Supabase search failed or returned no data, falling back to mock data.", error?.message || 'No data');
      return mockArticles
        .filter(article =>
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }

    return data.map((d: Record<string, unknown>) => ({
      id: d.id as string,
      title: d.title as string,
      content: d.content as string,
      category: d.category as string,
      timestamp: d.timestamp as string,
      imageUrl: d.image_url as string
    }));
  } catch (e) {
    console.error("Exception during search, falling back to mock data", e);
    return mockArticles
      .filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
}

export async function getUserPersonality(supabase: SupabaseClient, userId: string | undefined): Promise<PersonalityProfile | null> {
  if (!userId) return null;

  try {
    const { data, error } = await supabase
      .from('users')
      .select('personality_traits, personality_completed')
      .eq('id', userId)
      .single();

    if (error || !data) {
      console.warn("Failed to fetch user personality", error?.message);
      return null;
    }

    return data.personality_traits || null;
  } catch (e) {
    console.error("Exception during user personality fetch", e);
    return null;
  }
}

export async function getPersonalizedArticles(
  supabase: SupabaseClient,
  personality: PersonalityProfile | null
): Promise<Article[]> {
  // Get all articles first
  const allArticles = await fetchArticles(supabase);

  if (!personality) {
    // Return top articles if no personality profile
    return allArticles.slice(0, 10);
  }

  // Score articles based on personality profile
  const scoredArticles = allArticles.map(article => {
    let score = 0;

    // Score based on preferred industries
    if (personality.preferred_industries) {
      personality.preferred_industries.forEach(industry => {
        if (article.content.toLowerCase().includes(industry.toLowerCase()) ||
            article.title.toLowerCase().includes(industry.toLowerCase())) {
          score += 3;
        }
      });
    }

    // Score based on news categories preference
    if (personality.news_categories) {
      personality.news_categories.forEach(category => {
        if (article.category.toLowerCase().includes(category.toLowerCase())) {
          score += 2;
        }
      });
    }

    // Score based on investment goals
    if (personality.investment_goals) {
      personality.investment_goals.forEach(goal => {
        if (article.content.toLowerCase().includes(goal.toLowerCase()) ||
            article.title.toLowerCase().includes(goal.toLowerCase())) {
          score += 2;
        }
      });
    }

    // Recency bonus
    const daysSinceArticle = (new Date().getTime() - new Date(article.timestamp).getTime()) / (1000 * 60 * 60 * 24);
    score += Math.max(0, 5 - daysSinceArticle);

    return { article, score };
  });

  // Sort by score and return top 10
  return scoredArticles
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map(item => item.article);
}
