"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Play, Calendar, Eye, Share2, ThumbsUp, MessageSquare, Radio, ChevronRight, Activity } from 'lucide-react';
import Footer from '../../components/Footer';

export default function ETTVPage() {
    const searchParams = useSearchParams();
    const videoId = searchParams.get('v') || 'lQgN87gqKJA';
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const tickerItems = [
        "SENSEX CLIMBS 400 POINTS AS BANKING STOCKS LEAD RALLY",
        "RELIANCE INDUSTRIES TO ANNOUNCE Q4 RESULTS LATER TODAY",
        "GLOBAL MARKETS STEADY AHEAD OF US INFLATION DATA",
        "GOLD PRICES HIT ALL-TIME HIGH AMID GEOPOLITICAL TENSIONS",
        "RBI KEEPS REPO RATE UNCHANGED AT 6.5% FOR SEVENTH TIME"
    ];

    if (!isClient) return null;

    return (
        <div className="min-h-screen bg-white text-black selection:bg-et-red selection:text-white overflow-x-hidden -mt-6">
            <div className="pt-10 pb-20 max-w-full mx-auto px-0">
                {/* Advanced Breadcrumb/Header Tonal Shift */}
                <div className="mb-8 flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.3em] text-et-grey-medium px-4 lg:px-0">
                    <span className="text-et-red hover:text-black transition-colors cursor-pointer">ET TV</span>
                    <span className="w-1 h-1 bg-et-border rounded-full"></span>
                    <span>Broadcasting Live</span>
                    <span className="w-1 h-1 bg-et-border rounded-full"></span>
                    <span className="text-et-grey-dark">Market Intelligence</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-1 bg-et-border border border-et-border shadow-2xl">
                    {/* Main Video Section - The 'Stage' */}
                    <div className="lg:col-span-9 bg-black">
                        <div className="relative aspect-video bg-black overflow-hidden group">
                            <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&rel=0&modestbranding=1&bg=000000`}
                                title="ET TV Live"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                className="absolute inset-0"
                            ></iframe>

                            {/* Advanced Live Badge Overlay - Pure Red Accent */}
                            <div className="absolute top-6 left-6 z-10 flex items-center gap-4 bg-et-red px-6 py-2 shadow-[0_10px_40px_rgba(237,25,36,0.3)]">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                                </span>
                                <span className="text-[13px] font-black uppercase tracking-[0.35em] text-white italic">LiveNow</span>
                            </div>
                        </div>

                        {/* Video Info - Tonal Layering */}
                        <div className="p-8 bg-white space-y-8 border-t border-et-border">
                            <div className="flex flex-wrap items-start justify-between gap-8">
                                <div className="space-y-4 flex-1">
                                    <h1 className="text-3xl lg:text-4xl font-serif font-black tracking-tighter leading-[1.1] text-et-grey-dark max-w-4xl">
                                        Economic Times Live: Global Markets, Fiscal Policy & Corporate Strategy
                                    </h1>
                                    <div className="flex flex-wrap items-center gap-8 text-et-grey-medium text-[11px] font-black uppercase tracking-[0.25em]">
                                        <div className="flex items-center gap-3">
                                            <Calendar className="w-4 h-4 text-et-red" />
                                            <span className="text-et-grey-dark">March 28, 2026</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Activity className="w-4 h-4 text-et-red" />
                                            <span className="text-et-grey-dark">214,502 Global Viewers</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button className="flex items-center gap-4 bg-et-grey-light hover:bg-et-red hover:text-white transition-all duration-500 px-6 py-3 text-[11px] font-black uppercase tracking-[0.3em]">
                                        <ThumbsUp className="w-4 h-4" /> Recommend
                                    </button>
                                    <button className="flex items-center gap-4 bg-et-grey-light hover:bg-et-grey-dark hover:text-white transition-all duration-500 px-6 py-3 text-[11px] font-black uppercase tracking-[0.3em]">
                                        <Share2 className="w-4 h-4" /> Share
                                    </button>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-et-border font-serif">
                                <p className="text-et-grey-medium leading-loose text-[17px] font-medium max-w-5xl">
                                    Experience real-time intelligence from the corridors of power. ET TV delivers cinematic precision in market reporting, merging archival authority with live synthesis.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Advanced Sidebar / Interaction Panel */}
                    <div className="lg:col-span-3 bg-white flex flex-col">
                        <section className="bg-white flex flex-col flex-1 relative overflow-hidden group">
                            <div className="p-6 bg-et-grey-light flex items-center justify-between border-b border-et-border">
                                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] flex items-center gap-4 text-et-grey-dark">
                                    <MessageSquare className="w-4 h-4 text-et-red" /> Live Intelligence
                                </h3>
                                <div className="flex gap-1.5 px-2 py-1 bg-white/40">
                                    <div className="w-1 h-1 bg-et-red rounded-full animate-pulse"></div>
                                    <div className="w-1 h-1 bg-et-border rounded-full"></div>
                                </div>
                            </div>

                            {/* Interaction Panel */}
                            <div className="flex-1 p-6 space-y-8 overflow-y-auto no-scrollbar">
                                <div className="space-y-6">
                                    <div className="w-14 h-14 bg-et-grey-light rounded-none flex items-center justify-center border border-et-border group-hover:border-et-red/40 transition-colors">
                                        <Radio className="w-6 h-6 text-et-red animate-pulse" />
                                    </div>
                                    <div className="space-y-4">
                                        <p className="text-et-grey-dark font-serif italic text-lg leading-relaxed">
                                            "Summarizing current segment: Finance Minister signals new FDI norms for tech sectors."
                                        </p>
                                        <p className="text-[10px] uppercase font-black tracking-[0.35em] text-et-red bg-et-red/5 py-1 px-3 inline-block border border-et-red/10">
                                            AI Synthesis Active
                                        </p>
                                    </div>
                                </div>

                                {/* Stock Modules */}
                                <div className="space-y-1">
                                    {[
                                        { label: "SENSEX", value: "72,143.20", trend: "+0.54%" },
                                        { label: "NIFTY 50", value: "21,832.05", trend: "+0.48%" }
                                    ].map((stock, i) => (
                                        <div key={i} className="bg-et-grey-light/50 p-4 flex items-center justify-between group/stock hover:bg-et-grey-light transition-colors cursor-default border border-transparent hover:border-et-border">
                                            <span className="text-[10px] font-black text-et-grey-medium tracking-widest">{stock.label}</span>
                                            <div className="text-right">
                                                <div className="text-[13px] font-black text-et-grey-dark">{stock.value}</div>
                                                <div className="text-[10px] font-black text-green-600">{stock.trend}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="p-6 bg-et-grey-light border-t border-et-border">
                                <button className="w-full bg-black hover:bg-et-red text-white py-4 text-[11px] font-black uppercase tracking-[0.3em] transition-all duration-500 shadow-xl">
                                    Full Market Report
                                </button>
                            </div>
                        </section>
                    </div>
                </div>

                {/* News Ticker (In-page variant) */}
                <div className="mt-8 h-14 bg-black flex items-center overflow-hidden">
                    <div className="flex-shrink-0 bg-et-red h-full px-8 flex items-center z-10">
                        <span className="text-[11px] font-black text-white uppercase tracking-[0.3em] italic">Ticker</span>
                    </div>
                    <div className="flex-1 relative overflow-hidden h-full flex items-center">
                        <div className="flex whitespace-nowrap animate-ticker gap-16">
                            {[...tickerItems, ...tickerItems].map((item, i) => (
                                <div key={i} className="flex items-center gap-6">
                                    <span className="text-et-red font-black text-lg">/</span>
                                    <span className="text-[13px] font-black uppercase tracking-[0.2em] text-zinc-300">
                                        {item}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />

            <style jsx global>{`
                @keyframes ticker {
                    0% { transform: translate3d(0, 0, 0); }
                    100% { transform: translate3d(-50%, 0, 0); }
                }
                .animate-ticker {
                    animation: ticker 30s linear infinite;
                }
            `}</style>
        </div>
    );
}
