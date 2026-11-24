'use client';

import { Users, Globe, Shield, Landmark } from 'lucide-react';

interface StatsOverviewProps {
  stats: {
    totalCountries: number;
    totalPopulation: number;
    independentCount: number;
    unMemberCount: number;
  };
}

export default function StatsOverview({ stats }: StatsOverviewProps) {
  const cards = [
    {
      title: 'Total Nations',
      value: stats.totalCountries,
      sub: 'Recognized territories',
      icon: Globe,
      color: 'text-blue-600 dark:text-blue-400',
    },
    {
      title: 'Global Population',
      value: `${(stats.totalPopulation / 1_000_000_000).toFixed(2)}B`,
      sub: 'Est. World Census',
      icon: Users,
      color: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      title: 'Sovereign States',
      value: stats.independentCount,
      sub: 'Independent nations',
      icon: Shield,
      color: 'text-purple-600 dark:text-purple-400',
    },
    {
      title: 'UN Member States',
      value: stats.unMemberCount,
      sub: 'Assembly members',
      icon: Landmark,
      color: 'text-amber-600 dark:text-amber-400',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.title}
            className="p-3 rounded-md bg-white dark:bg-slate-900 border border-[#e2d5b5] dark:border-slate-800 shadow-xs flex items-center justify-between"
          >
            <div>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block uppercase tracking-wider">
                {c.title}
              </span>
              <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-0.5">
                {c.value}
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                {c.sub}
              </span>
            </div>
            <div className={`p-2 rounded-md bg-slate-50 dark:bg-slate-800 border border-[#e2d5b5]/50 dark:border-transparent ${c.color}`}>
              <Icon className="w-4 h-4" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
