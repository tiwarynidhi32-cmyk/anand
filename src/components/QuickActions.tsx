import { ICONS } from '../constants';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

export default function QuickActions() {
  const navigate = useNavigate();
  const actions = [
    { label: 'Add Patient', icon: 'Patients', color: 'bg-brand-accent-blue', path: '/patients' },
    { label: 'Print Report', icon: 'Reports', color: 'bg-brand-secondary', path: '/reports' },
    { label: 'Book OT', icon: 'Calendar', color: 'bg-brand-accent-green', path: '/surgery' },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Quick Actions</h3>
        <ICONS.More className="text-slate-300" size={16} />
      </div>

      <div className="space-y-3">
        {actions.map((action, i) => {
          const Icon = ICONS[action.icon as keyof typeof ICONS];
          return (
            <motion.button
              key={action.label}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(action.path)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl ${action.color} text-white shadow-sm hover:shadow-md transition-all`}
            >
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <Icon size={16} />
              </div>
              <span className="text-sm font-bold truncate">{action.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
