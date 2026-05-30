import { ICONS, MOCK_STATS } from '../constants';
import { motion } from 'motion/react';

export default function StatsGrid({ onCardClick }: { onCardClick?: (title: string) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {MOCK_STATS.map((stat, i) => {
        const Icon = ICONS[stat.icon as keyof typeof ICONS];
        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => onCardClick?.(stat.title)}
            className={`${stat.color} rounded-2xl p-5 shadow-sm overflow-hidden relative group cursor-pointer active:scale-95 transition-all`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color.includes('white') ? 'bg-slate-100 text-slate-600' : 'bg-white/20 text-white'}`}>
                <Icon size={20} />
              </div>
              <button className={`${stat.color.includes('white') ? 'text-slate-400' : 'text-white/40'} hover:text-white transition-colors`}>
                <ICONS.More size={20} />
              </button>
            </div>
            
            <div>
              <p className={`text-xs font-bold uppercase tracking-widest ${stat.color.includes('white') ? 'text-slate-500' : 'text-white/80'}`}>{stat.title}</p>
              <h3 className={`text-2xl font-black mt-1 ${stat.color.includes('white') ? 'text-slate-900' : 'text-white'}`}>{stat.value}</h3>
            </div>
            
            {/* Decorative shape */}
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all duration-500"></div>
          </motion.div>
        );
      })}
    </div>
  );
}
