import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { CHART_DATA, ICONS } from '../constants';

export default function AppointmentsTrends() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 h-full shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Appointments Trends</h3>
          <p className="text-xs text-slate-500 mt-1">Appointments Weekly</p>
        </div>
        <button className="text-slate-400 hover:text-slate-600 transition-colors">
          <ICONS.More size={20} />
        </button>
      </div>

      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={CHART_DATA}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: '#64748B' }} 
              dy={10}
            />
            <YAxis 
              hide 
              domain={[0, 8]}
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '12px', 
                border: 'none', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                fontSize: '12px'
              }} 
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#10B981" 
              strokeWidth={3} 
              fillOpacity={1} 
              fill="url(#colorValue)" 
              dot={{ r: 4, fill: '#10B981', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
