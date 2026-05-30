import { useState } from 'react';
import { ICONS, MOCK_APPOINTMENTS } from '../constants';

export default function AppointmentsCalendar() {
  const [selectedDate, setSelectedDate] = useState(6);
  // Simplified calendar view for the dashboard
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dates = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 h-full shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-800 tracking-tight">Appointments Calendar</h3>
        <div className="flex bg-slate-50 rounded-lg p-1">
          <button className="px-3 py-1 text-xs font-semibold bg-white rounded-md shadow-sm text-brand-primary">Day</button>
          <button className="px-3 py-1 text-xs font-semibold text-slate-500 hover:text-brand-primary transition-colors">Week</button>
          <button className="px-3 py-1 text-xs font-semibold text-slate-500 hover:text-brand-primary transition-colors">Month</button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <button className="p-1 text-slate-400 hover:text-slate-600 transition-colors"><ICONS.Clock size={16} /></button>
        <span className="font-black text-slate-800 font-display">April 2024</span>
        <div className="flex gap-1">
          <button className="p-1 hover:bg-slate-50 rounded transition-colors text-slate-400 hover:text-brand-primary"><ICONS.Search size={14} /></button>
          <button className="p-1 hover:bg-slate-50 rounded transition-colors text-slate-400 hover:text-brand-primary"><ICONS.More size={14} /></button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {days.map(day => (
          <div key={day} className="text-center text-[10px] font-black text-slate-300 uppercase tracking-widest py-1">{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 h-[240px] overflow-y-auto pr-1 scrollbar-none">
        {/* Placeholder cells */}
        {Array.from({ length: 3 }).map((_, i) => <div key={`empty-${i}`} className="h-14"></div>)}
        
        {dates.map((date) => (
          <div 
            key={date} 
            onClick={() => setSelectedDate(date)}
            className={`h-14 border border-slate-100 rounded-lg p-1.5 relative hover:bg-slate-50 hover:border-brand-primary/20 cursor-pointer transition-all ${
              selectedDate === date ? 'bg-brand-primary/5 border-brand-primary/30 ring-1 ring-brand-primary/10' : ''
            }`}
          >
            <span className={`text-[10px] font-bold ${
              selectedDate === date ? 'text-brand-primary' : (date === 6 ? 'text-brand-primary' : 'text-slate-500')
            }`}>{date}</span>
            {date === 6 && (
              <div className="mt-1 space-y-0.5">
                <div className="w-full h-1 bg-brand-secondary rounded-full"></div>
                <div className="w-full h-1 bg-brand-accent-blue rounded-full"></div>
              </div>
            )}
            {date === 12 && (
              <div className="mt-1">
                <div className="w-full h-1 bg-brand-accent-orange rounded-full"></div>
              </div>
            )}
            {selectedDate === date && (
              <div className="absolute top-1.5 right-1.5 w-1 h-1 bg-brand-primary rounded-full"></div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-slate-100 italic text-[10px] font-bold text-slate-400 text-center uppercase tracking-widest">
        Legend: <span className="text-brand-secondary">Consultation</span> • <span className="text-brand-accent-blue">Follow-up</span> • <span className="text-brand-accent-orange">Surgery</span>
      </div>
    </div>
  );
}
