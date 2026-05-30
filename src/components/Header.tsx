import { ICONS } from '../constants';
import { useAuth } from '../AuthContext';

export default function Header({ onOpenMessages }: { onOpenMessages?: () => void }) {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-10">
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <ICONS.Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search patients, appointments, doctors..." 
            className="w-full bg-slate-50 border-none rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-brand-primary/20 transition-all outline-none"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg relative transition-colors" title="Notifications">
          <ICONS.Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 border-2 border-white rounded-full text-[10px] text-white flex items-center justify-center font-bold">5</span>
        </button>
        <button 
          onClick={onOpenMessages}
          className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors relative" 
          title="Internal Messages"
        >
          <ICONS.MessageSquare size={20} />
          <span className="absolute bottom-1.5 right-1.5 w-2 h-2 bg-green-500 border border-white rounded-full"></span>
        </button>
        <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors" title="Toggle Theme">
          <ICONS.Moon size={20} />
        </button>
        
        <div className="h-8 w-[1px] bg-slate-200 mx-2 hidden md:block"></div>
        
        <button 
          onClick={logout}
          className="flex items-center gap-3 pl-2 group"
          title="Logout"
        >
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-slate-800 leading-none group-hover:text-brand-primary transition-colors">{user?.name}</p>
            <p className="text-[10px] font-medium text-slate-400 mt-1">{user?.role}</p>
          </div>
          <img 
            src={user?.avatar} 
            alt="Profile" 
            className="w-8 h-8 rounded-lg border border-slate-200 group-hover:border-brand-primary transition-colors shadow-sm"
          />
        </button>
      </div>
    </header>
  );
}
