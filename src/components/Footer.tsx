export default function Footer() {
    return (
        <footer className="bg-white border-t-4 border-black pt-16 pb-12 mt-20">
            <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-10 mb-16">
                    <div className="col-span-2">
                        <h2 className="font-serif font-black text-3xl mb-6">The Economic Times</h2>
                        <p className="text-et-grey-medium text-[13px] leading-relaxed max-w-sm font-bold uppercase tracking-widest">
                            India's leading business newspaper. Delivering real-time market intelligence and authoritative financial analysis since 1961.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-black text-[12px] uppercase tracking-widest mb-6 text-et-red italic">Markets</h4>
                        <ul className="space-y-3 text-[11px] font-black uppercase tracking-widest text-et-grey-medium">
                            <li className="hover:text-et-red cursor-pointer transition-colors">Stock Market</li>
                            <li className="hover:text-et-red cursor-pointer transition-colors">IPO</li>
                            <li className="hover:text-et-red cursor-pointer transition-colors">Commodities</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-black text-[12px] uppercase tracking-widest mb-6 text-et-red italic">News</h4>
                        <ul className="space-y-3 text-[11px] font-black uppercase tracking-widest text-et-grey-medium">
                            <li className="hover:text-et-red cursor-pointer transition-colors">Politics</li>
                            <li className="hover:text-et-red cursor-pointer transition-colors">Economy</li>
                            <li className="hover:text-et-red cursor-pointer transition-colors">Technology</li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-et-border pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-et-grey-medium">
                        © 2026 Bennett, Coleman & Co. Ltd. All rights reserved.
                    </p>
                    <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-et-grey-medium">
                        <span className="hover:text-et-red cursor-pointer transition-colors">Privacy Policy</span>
                        <span className="hover:text-et-red cursor-pointer transition-colors">Terms of Service</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
