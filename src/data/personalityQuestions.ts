export interface PersonalityQuestion {
  id: number;
  question: string;
  options: {
    text: string;
    trait: string;
    value: string;
  }[];
  category: 'investment' | 'news' | 'risk' | 'goals';
}

export const personalityQuestions: PersonalityQuestion[] = [
  {
    id: 1,
    question: "What best describes your investment approach?",
    category: 'investment',
    options: [
      { text: "I prefer safe, stable investments with guaranteed returns", trait: 'investment_style', value: 'conservative' },
      { text: "I want balanced growth with moderate risk", trait: 'investment_style', value: 'balanced' },
      { text: "I'm willing to take risks for higher potential returns", trait: 'investment_style', value: 'aggressive' },
      { text: "I follow market trends and trade actively", trait: 'investment_style', value: 'active_trader' }
    ]
  },
  {
    id: 2,
    question: "How do you feel about market volatility?",
    category: 'risk',
    options: [
      { text: "It makes me anxious; I prefer stable investments", trait: 'risk_tolerance', value: 'low' },
      { text: "I can handle some fluctuations", trait: 'risk_tolerance', value: 'moderate' },
      { text: "I see volatility as opportunity to buy low", trait: 'risk_tolerance', value: 'high' },
      { text: "Volatility defines my trading strategy", trait: 'risk_tolerance', value: 'very_high' }
    ]
  },
  {
    id: 3,
    question: "What are your main financial goals?",
    category: 'goals',
    options: [
      { text: "Retirement planning and wealth preservation", trait: 'investment_goals', value: 'retirement' },
      { text: "Short-term wealth creation and income", trait: 'investment_goals', value: 'income' },
      { text: "Long-term capital appreciation", trait: 'investment_goals', value: 'growth' },
      { text: "Diversification across multiple asset classes", trait: 'investment_goals', value: 'diversification' }
    ]
  },
  {
    id: 4,
    question: "Which industries interest you most?",
    category: 'news',
    options: [
      { text: "Technology and Innovation", trait: 'preferred_industries', value: 'technology' },
      { text: "Finance and Banking", trait: 'preferred_industries', value: 'finance' },
      { text: "Real Estate and Infrastructure", trait: 'preferred_industries', value: 'realestate' },
      { text: "Healthcare and Pharma", trait: 'preferred_industries', value: 'healthcare' }
    ]
  },
  {
    id: 5,
    question: "How often do you check market news?",
    category: 'news',
    options: [
      { text: "Multiple times a day, I need real-time updates", trait: 'news_categories', value: 'realtime' },
      { text: "Once or twice daily for updates", trait: 'news_categories', value: 'daily' },
      { text: "Weekly summary is enough for me", trait: 'news_categories', value: 'weekly' },
      { text: "I prefer deep analytical reports", trait: 'news_categories', value: 'analytical' }
    ]
  },
  {
    id: 6,
    question: "What type of news content do you prefer?",
    category: 'news',
    options: [
      { text: "Market data and stock analysis", trait: 'news_categories', value: 'markets' },
      { text: "Business and corporate news", trait: 'news_categories', value: 'business' },
      { text: "Economic indicators and policy news", trait: 'news_categories', value: 'economy' },
      { text: "Personal finance and wealth tips", trait: 'news_categories', value: 'personal_finance' }
    ]
  },
  {
    id: 7,
    question: "What's your investment experience level?",
    category: 'investment',
    options: [
      { text: "I'm new to investing", trait: 'investment_style', value: 'beginner' },
      { text: "I have 1-5 years of experience", trait: 'investment_style', value: 'intermediate' },
      { text: "I have 5+ years of investing experience", trait: 'investment_style', value: 'experienced' },
      { text: "I'm a professional investor/trader", trait: 'investment_style', value: 'professional' }
    ]
  },
  {
    id: 8,
    question: "Which economic sectors do you track?",
    category: 'news',
    options: [
      { text: "IT, Software, and Digital Services", trait: 'preferred_industries', value: 'it' },
      { text: "Banking, Insurance, and Financial Services", trait: 'preferred_industries', value: 'banking' },
      { text: "Pharma, Healthcare, and Biotech", trait: 'preferred_industries', value: 'pharma' },
      { text: "Energy, Commodities, and Infrastructure", trait: 'preferred_industries', value: 'energy' }
    ]
  }
];

export interface PersonalityProfile {
  investment_style?: string;
  risk_tolerance?: string;
  investment_goals?: string[];
  preferred_industries?: string[];
  news_categories?: string[];
}
