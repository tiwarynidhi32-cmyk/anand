import { MOCK_ADMISSIONS, ICONS } from '../constants';
import { useNavigate } from 'react-router-dom';

export default function RecentAdmissions() {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 h-full shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-800 tracking-tight">Recent Admissions</h3>
        <button 
          onClick={() => navigate('/ipd')}
          className="text-slate-400 hover:text-slate-600 transition-colors"
        >
          <ICONS.More size={20} />
        </button>
      </div>

      <div className="space-y-4">
        {MOCK_ADMISSIONS.map((admission) => (
          <div 
            key={admission.id} 
            onClick={() => navigate('/ipd')}
            className="flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <img 
                src={admission.avatar} 
                alt={admission.name} 
                className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-50 group-hover:ring-brand-primary/10 transition-all shadow-sm"
              />
              <div>
                <h4 className="text-sm font-semibold text-slate-800 group-hover:text-brand-primary transition-colors">{admission.name}</h4>
                <p className="text-[11px] text-slate-500">{admission.treatment}</p>
              </div>
            </div>
            <div className="text-right">
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                admission.date === 'Today' ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-500'
              }`}>
                {admission.date}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <button 
        onClick={() => navigate('/ipd')}
        className="w-full mt-6 text-[11px] font-bold text-brand-primary hover:underline uppercase tracking-wider"
      >
        View All Records
      </button>
    </div>
  );
}
