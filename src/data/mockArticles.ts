export interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
  timestamp: string; // ISO format
  imageUrl: string;
}

export const mockArticles: Article[] = [
  {
    id: "1",
    title: "Bulls Return to Dalal Street; Analysts see Nifty heading towards 23,800",
    content: "The stock market witnessed a massive rally today as bulls reclaimed control on Dalal street. Easing inflation concerns and positive global cues have propelled the Nifty 50 past key resistance levels. Analysts suggest this momentum could carry the index towards the 23,800 mark in the short term, provided foreign institutional investor (FII) inflows continue.",
    category: "markets",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "2",
    title: "Accenture is pressing the AI pedal. What's stopping Indian IT then?",
    content: "While global IT giants like Accenture are making massive investments in generative AI and restructuring their workforce to adapt to the new paradigm, Indian IT services firms appear to be moving at a slower pace. The hesitation seems rooted in concerns over data privacy, lack of clear ROI from early AI pilots, and the need to retrain a massive workforce. However, falling behind in the AI race could cost them dearly in the long run.",
    category: "prime",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "3",
    title: "Jio's big listing comes with goodbyes worth millions",
    content: "As Reliance readies Jio Platforms for a blockbuster IPO, several early backers and private equity firms are preparing to exit their investments. The expected valuation of the telecom and digital services giant could result in massive windfalls for these investors. The listing is highly anticipated and is expected to be one of the largest in India's corporate history.",
    category: "news",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
    imageUrl: "https://images.unsplash.com/photo-1516322073320-80bd1db5c102?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "4",
    title: "Crude hits century again. Is $150 the next stop?",
    content: "Oil prices surged past the $100 per barrel mark once again amid escalating geopolitical tensions in the Middle East. The disruption of key shipping routes and fears of supply constraints have driven the rally. Some energy analysts are warning that if the conflict broadens, crude oil could reach $150 a barrel, significantly impacting global inflation and economic growth.",
    category: "industry",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    imageUrl: "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "5",
    title: "How to make Rs 2 cr corpus market crash-proof",
    content: "For retirees and conservative investors, protecting a large corpus from sudden market downturns is crucial. Financial planners recommend a mix of asset allocation strategies, including shifting a portion of equity gains into debt instruments, investing in high-dividend yield stocks, and maintaining a healthy emergency fund in liquid assets to weather volatility without selling at a loss.",
    category: "wealth",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    imageUrl: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "6",
    title: "AI is reshaping lending, and why it's bad news for traditional banks",
    content: "Fintech startups are increasingly leveraging AI to process alternative data points for credit scoring, allowing them to lend to individuals and small businesses previously ignored by traditional banks. This agility and precision threaten the market share of established financial institutions, forcing them to either innovate rapidly or risk becoming obsolete in the consumer lending space.",
    category: "prime",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "7",
    title: "Stock Market Holiday: Are NSE, BSE closed today?",
    content: "Investors are reminded that both the National Stock Exchange (NSE) and the Bombay Stock Exchange (BSE) will remain closed today on account of a public holiday. Trading in the equity, derivative, and currency segments will resume on the next business day. The Multi Commodity Exchange (MCX) will also be closed for the morning session but will open for the evening session.",
    category: "markets",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    imageUrl: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "8",
    title: "Indian GCCs ditch DIY build-out model to team up with external companies",
    content: "Global Capability Centers (GCCs) in India are shifting their expansion strategies. Instead of building facilities and recruiting talent from scratch, many are now partnering with external managed service providers and co-working spaces. This approach allows them to scale operations faster, reduce initial capital expenditure, and focus on their core competencies.",
    category: "tech",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
    imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800",
  }
];
