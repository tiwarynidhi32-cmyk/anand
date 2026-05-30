import { useState } from 'react';
import { ICONS, NAVIGATION } from '../constants';
import { motion, AnimatePresence } from 'motion/react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { useAuth } from '../AuthContext';

export default function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const toggleExpand = (name: string) => {
    setExpandedMenus(prev => 
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
  };

  // Filter navigation by role
  const filteredNavigation = NAVIGATION.filter(item => 
    !item.roles || (user && item.roles.includes(user.role))
  );

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden lg:flex h-screen sticky top-0 shadow-sm">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-primary/20">
          <ICONS.Dashboard size={24} />
        </div>
        <div>
          <span className="text-base font-bold font-display text-slate-800 tracking-tight block leading-tight">Anand Hospital</span>
          <span className="text-[10px] text-brand-primary font-black uppercase tracking-widest">{user?.role} Panel</span>
        </div>
      </div>
      
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        {filteredNavigation.map((item) => {
          const Icon = ICONS[item.icon as keyof typeof ICONS];
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          const isExpanded = expandedMenus.includes(item.name) || isActive;
          const hasSubmenus = item.submenus && item.submenus.length > 0;

          return (
            <div key={item.name}>
              <div 
                className={`group flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium cursor-pointer transition-all ${
                  isActive 
                    ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/10' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <NavLink 
                  to={item.path} 
                  className="flex items-center gap-3 flex-1"
                >
                  <Icon size={18} />
                  {item.name}
                </NavLink>
                {hasSubmenus && (
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleExpand(item.name);
                    }}
                    className="p-1 hover:bg-white/10 rounded-md transition-colors"
                  >
                    <ChevronDown 
                      size={14} 
                      className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
                    />
                  </button>
                )}
              </div>
              
              <AnimatePresence>
                {hasSubmenus && isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden pl-11 pr-4 space-y-1 mt-1"
                  >
                    {item.submenus?.map((sub) => {
                      const subPath = `${item.path}/${sub.toLowerCase().replace(/ /g, '-')}`;
                      return (
                        <NavLink
                          key={sub}
                          to={subPath}
                          className={({ isActive }) => 
                            `block py-2 text-xs font-medium transition-colors border-l border-slate-100 pl-4 relative before:absolute before:left-[-1px] before:top-1/2 before:-translate-y-1/2 before:w-[2px] before:h-0 hover:before:h-3 before:bg-brand-primary before:transition-all ${
                              isActive ? 'text-brand-primary border-brand-primary font-bold' : 'text-slate-400 hover:text-brand-primary'
                            }`
                          }
                        >
                          {sub}
                        </NavLink>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-slate-100">
        <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-3 group cursor-pointer hover:bg-slate-100 transition-colors">
          <img 
            src={user?.avatar} 
            alt={user?.role} 
            className="w-10 h-10 rounded-full border-2 border-white shadow-sm transition-transform group-hover:scale-105"
          />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">{user?.name}</p>
            <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
          </div>
        </div>
        
        <button 
          onClick={logout}
          className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-red-50 hover:text-red-600 border border-slate-200 transition-all active:scale-95"
        >
          <ICONS.LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}
