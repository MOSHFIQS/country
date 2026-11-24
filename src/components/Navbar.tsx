'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Globe, Bookmark, Scale, Trophy, BarChart2, Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const pathname = usePathname();
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [compareCount, setCompareCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const updateCounts = () => {
      try {
        const favs = JSON.parse(localStorage.getItem('fav_countries') || '[]');
        setFavoritesCount(Array.isArray(favs) ? favs.length : 0);
        const comp = JSON.parse(localStorage.getItem('compare_countries') || '[]');
        setCompareCount(Array.isArray(comp) ? comp.length : 0);
      } catch (e) {
        console.error(e);
      }
    };

    updateCounts();
    window.addEventListener('storage', updateCounts);
    window.addEventListener('favorites_updated', updateCounts);
    window.addEventListener('compare_updated', updateCounts);

    return () => {
      window.removeEventListener('storage', updateCounts);
      window.removeEventListener('favorites_updated', updateCounts);
      window.removeEventListener('compare_updated', updateCounts);
    };
  }, []);

  const navLinks = [
    { href: '/', label: 'Explore', icon: Globe },
    { href: '/favorites', label: 'Favorites', icon: Bookmark, badge: favoritesCount },
    { href: '/compare', label: 'Compare', icon: Scale, badge: compareCount },
    { href: '/quiz', label: 'Trivia Quiz', icon: Trophy },
    { href: '/analytics', label: 'Analytics', icon: BarChart2 },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#f2e8cf]/90 dark:bg-slate-950/95 border-b border-[#e2d5b5] dark:border-slate-800 transition-colors">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-[100px]">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-md bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <Globe className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white">
                World<span className="text-blue-600 dark:text-blue-400">Atlas</span>
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-white/70 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-[#e2d5b5] dark:border-blue-800">
                v2.0
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/80'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                  {typeof item.badge === 'number' && item.badge > 0 && (
                    <span
                      className={`px-1.5 py-0.2 text-[10px] font-bold rounded-md ${
                        isActive
                          ? 'bg-white text-blue-600'
                          : 'bg-blue-600 text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions: Explicit Theme Toggle */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden rounded-md border border-[#e2d5b5] dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 px-1 border-t border-[#e2d5b5] dark:border-slate-800 space-y-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 rounded-md text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {typeof item.badge === 'number' && item.badge > 0 && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-blue-600 text-white">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
}
