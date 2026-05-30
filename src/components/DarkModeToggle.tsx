import { useState, useEffect } from 'react';
import { ICONS } from '../constants';

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div className="bg-[#2D3748] rounded-2xl p-4 flex items-center justify-between group cursor-pointer transition-colors hover:bg-[#232B38]" onClick={() => setIsDark(!isDark)}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
          <ICONS.Moon size={20} />
        </div>
        <span className="text-sm font-bold text-white uppercase tracking-wider">Dark Mode</span>
      </div>
      
      <div className={`w-12 h-6 rounded-full p-1 transition-colors relative ${isDark ? 'bg-brand-primary' : 'bg-slate-600'}`}>
        <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${isDark ? 'translate-x-6' : 'translate-x-0'}`}></div>
      </div>
    </div>
  );
}
