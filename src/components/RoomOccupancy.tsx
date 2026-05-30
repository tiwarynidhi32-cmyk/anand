import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { PIE_DATA, ICONS } from '../constants';

export default function RoomOccupancy() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 h-full shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold text-slate-800">Room Occupancy</h3>
        <button className="text-slate-400 hover:text-slate-600 transition-colors">
          <ICONS.More size={20} />
        </button>
      </div>

      <div className="h-[200px] w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={PIE_DATA}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {PIE_DATA.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-4">
          <span className="text-2xl font-bold text-slate-800">85%</span>
          <span className="text-[10px] text-slate-500 uppercase font-semibold">Total</span>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-2">
        {PIE_DATA.map((item) => (
          <div key={item.name} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
            <span className="text-[10px] font-medium text-slate-600">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
