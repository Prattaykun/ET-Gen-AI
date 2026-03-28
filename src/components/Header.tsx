"use client";

import Link from 'next/link';
import { Menu, User, ChevronDown, LogOut, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const [currentDate, setCurrentDate] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { user, signOut, loading } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Only show header when at the very top of the page
      if (currentScrollY < 10) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const date = new Date();
      const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
      const timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' };

      const dateStr = date.toLocaleDateString('en-US', options);
      const timeStr = date.toLocaleTimeString('en-US', timeOptions);

      setCurrentDate(`${dateStr} | ${timeStr} IST`);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const l1Nav = [
    { name: 'Home', href: '/' },
    { name: 'ETPrime', href: '/prime', highlight: true },
    { name: 'Markets', href: '/markets' },
    { name: 'News', href: '/' },
    { name: 'Industry', href: '/industry' },
    { name: 'Wealth', href: '/wealth' },
    { name: 'Tech', href: '/tech' },
    { name: 'Tenders', href: '/tenders' },
    { name: 'Jobs', href: '/jobs' },
    { name: 'Matrimony', href: '/matrimony' },
    { name: 'ET TV', href: '/ettv' },
  ];

  const l2Nav = [
    { name: 'News Live!', href: '/news' },
    { name: 'Govt Tenders', href: '/tenders' },
    { name: 'Job Apply', href: '/jobs' },
    { name: 'Spotlight', href: '/spotlight' },
    { name: 'Economy', href: '/economy' },
    { name: 'Finance', href: '/finance' },
    { name: 'Logistics', href: '/logistics' },
    { name: 'Politics', href: '/politics' }
  ];

  return (
    <header className={`bg-white shadow-sm transition-transform duration-300 ease-in-out ${isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}>
      {/* Branding Tier */}
      <div className="border-b border-et-border py-6">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-8 flex items-center justify-between">
          <div className="flex flex-col gap-1.5 text-[11px] text-et-grey-medium font-bold font-sans">
            <span className="uppercase tracking-wider">English Edition | {currentDate}</span>
            <Link href="/epaper" className="text-et-red hover:text-red-700 font-black uppercase tracking-[0.2em] transition-colors border-b-2 border-et-red inline-block mt-1">Today's ePaper</Link>
          </div>

          <div className="flex flex-col items-center">
            <Link href="/" className="flex flex-col items-center group">
              <div className="bg-et-red text-white w-[54px] h-[54px] flex items-center justify-center font-serif font-black text-[38px] mb-2 leading-none shadow-md group-hover:bg-[#d0151d] transition-all duration-300">ET</div>
              <span className="font-serif font-black text-[24px] tracking-[-0.04em] leading-none text-et-grey-dark">THE ECONOMIC TIMES</span>
            </Link>
          </div>

          <div className="flex items-center gap-6">
            {loading ? (
              <div className="flex items-center gap-2 text-[12px] font-extrabold text-et-grey-medium uppercase tracking-widest font-sans animate-pulse">
                <Loader2 className="h-4 w-4 animate-spin" />
                Validating...
              </div>
            ) : user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-[12px] font-extrabold text-et-grey-dark uppercase tracking-widest font-sans">
                  <User className="h-4.5 w-4.5 text-et-red" />
                  <span className="truncate max-w-[120px]">{user.email?.split('@')[0]}</span>
                </div>
                <button
                  onClick={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    await signOut();
                  }}
                  type="button"
                  className="text-et-grey-medium hover:text-et-red transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="h-4.5 w-4.5" />
                </button>
              </div>
            ) : (
              <Link href="/auth/login" className="flex items-center gap-2 text-[12px] font-extrabold text-et-grey-dark hover:text-et-red transition-all duration-200 uppercase tracking-widest font-sans">
                <User className="h-4.5 w-4.5" />
                Sign In
              </Link>
            )}
            <button className="bg-black text-white px-6 py-2.5 text-[12px] font-black rounded-sm uppercase tracking-[0.15em] hover:bg-et-grey-dark transition-all duration-300 shadow-sm font-sans">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* L1 Nav Tier */}
      <div className="border-b border-et-border">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-8 flex items-center h-[50px]">
          <button className="mr-8 p-1.5 hover:bg-et-grey-light rounded-sm transition-colors duration-200">
            <Menu className="h-6 w-6 text-et-grey-dark" />
          </button>
          <nav className="flex items-center gap-8 overflow-x-auto no-scrollbar h-full">
            {l1Nav.map((item, i) => (
              <Link
                key={i}
                href={item.href}
                className={`text-[13px] font-extrabold whitespace-nowrap h-full flex items-center border-b-[3px] transition-all duration-200 px-1 font-sans uppercase tracking-tight
                  ${item.highlight ? 'text-et-red border-transparent hover:border-et-red' : 'text-et-grey-dark border-transparent hover:border-et-red hover:text-et-red'}
                `}
              >
                {item.name}
                {item.name === 'Mutual Funds' && <ChevronDown className="w-3.5 h-3.5 ml-1" />}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* L2 Nav Tier */}
      <div className="bg-et-grey-light border-b border-et-border hidden lg:block">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-8 flex items-center h-[36px] gap-8">
          {l2Nav.map((item, i) => (
            <Link
              key={i}
              href={item.href}
              className="text-[10px] font-extrabold text-et-grey-dark/70 hover:text-et-red whitespace-nowrap flex items-center gap-1.5 transition-all duration-200 uppercase tracking-widest font-sans"
            >
              {item.name === 'News Live!' && <span className="w-2 h-2 bg-et-red rounded-full animate-pulse shadow-[0_0_8px_rgba(237,25,36,0.5)]"></span>}
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
