import { type Article } from "@/types";
export type { Article };

export const mockArticles: Article[] = [
  {
    id: "mock-1",
    title: "Sensex, Nifty hit all-time highs as bulls return to Dalal Street",
    content: "The Indian stock market witnessed a massive rally today as the Sensex and Nifty hit new record highs. Investors were buoyed by positive global cues and strong domestic earnings. Analysts expect the momentum to continue as the festive season approaches, with retail participation reaching unprecedented levels.",
    category: "markets",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1611974717483-5828ff797ae1?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "mock-2",
    title: "Global Tech Summit 2024: Focus on AI Ethics and Regulation",
    content: "The annual Global Tech Summit kicked off in Bengaluru today, with world leaders and tech CEOs gathering to discuss the future of artificial intelligence. The primary focus of this year's summit is the ethical implementation of AI and the need for a global regulatory framework to prevent misuse while fostering innovation.",
    category: "tech",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "mock-3",
    title: "India's GDP Growth Outpaces Global Peers at 7.8%",
    content: "The latest data from the National Statistical Office reveals that India's economy continues to be a bright spot in the global landscape. With a growth rate of 7.8% in the last quarter, the country is on track to become the world's third-largest economy sooner than expected. Manufacturing and services sectors showed robust performance.",
    category: "economy",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1526304640581-d334cdbbfde7?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "mock-4",
    title: "RBI Holds Repo Rate, Maintains Focus on Inflation Control",
    content: "The Monetary Policy Committee of the RBI has decided to keep the repo rate unchanged at 6.5%. Governor Shaktikanta Das emphasized that while growth remains strong, the central bank is committed to bringing inflation down to the 4% target. Market experts predict a period of stability in interest rates.",
    category: "finance",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "mock-5",
    title: "New Logistic Parks to Boost Supply Chain Efficiency",
    content: "The Ministry of Road Transport and Highways announced the development of 35 multi-modal logistics parks across the country. These parks aim to reduce logistics costs from 14% to 8% of GDP, making Indian exports more competitive. The first phase in Nagpur is nearing completion.",
    category: "logistics",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "mock-6",
    title: "Elections 2024: Key Alliances Reshaping the Political Landscape",
    content: "As the nation gears up for the general elections, new political alliances are emerging across states. Senior leaders from various parties are negotiating seat-sharing arrangements to consolidate votes. Debates on economic progress and social welfare are dominating the campaign trails.",
    category: "politics",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "mock-7",
    title: "Spotlight: The Rise of Indian Startups in Deep Tech",
    content: "Our special feature this week looks at how Indian engineers are moving beyond SaaS and fintech into deep tech areas like quantum computing and space technology. Investors are increasingly looking at long-term IP-driven companies that can solve global challenges.",
    category: "spotlight",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "mock-8",
    title: "Ultra-High Frequency Trading Gains Momentum in GIFT City",
    content: "International finance centers in India are seeing a surge in HFT firms setting up operations. GIFT City's regulatory framework and low latency infrastructure are attracting global players looking to tap into the Indian derivative markets.",
    category: "finance",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 'mock-9',
    title: 'NHAI Invites Bids for ₹2,500 Cr Expressway Project',
    content: 'The National Highways Authority of India (NHAI) has issued a tender for the construction of a new 6-lane access-controlled expressway connecting major industrial hubs in North India. This project is expected to significantly reduce travel time and boost regional economic activity.',
    category: 'tenders',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1541888941255-65801829c60a?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'mock-10',
    title: 'Top Management Roles Opening in India\'s Green Energy Sector',
    content: 'As India accelerates its transition to renewable energy, several top-tier companies are looking for experienced leaders to head their solar and wind divisions. Salaries for VP positions are reaching record highs, with benefits including substantial equity stakes.',
    category: 'jobs',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 15).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800'
  }
];
