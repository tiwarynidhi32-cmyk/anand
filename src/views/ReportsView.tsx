import { useState } from 'react';
import { ICONS } from '../constants';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

const REVENUE_DATA = [
  { month: 'Jan', opd: 4000, ipd: 2400 },
  { month: 'Feb', opd: 3000, ipd: 1398 },
  { month: 'Mar', opd: 2000, ipd: 9800 },
  { month: 'Apr', opd: 2780, ipd: 3908 },
  { month: 'May', opd: 1890, ipd: 4800 },
];

export default function ReportsView() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Reports & Analytics</h1>
          <p className="text-sm text-slate-500">Business intelligence and hospital performance metrics</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => alert('Filtering reports for current month...')}
            className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 transition-colors"
          >
            This Month
          </button>
          <button 
            onClick={() => alert('Generating full hospital performance report for download...')}
            className="px-4 py-2 bg-brand-primary text-white rounded-xl text-xs font-bold hover:bg-brand-primary/90 transition-colors shadow-lg shadow-brand-primary/20"
          >
            Download Full Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Metric Cards */}
        {[
          { label: 'Patient Growth', val: '+12%', sub: 'vs last month', color: 'text-emerald-500' },
          { label: 'Avg Waiting Time', val: '14m', sub: 'OPD Queue', color: 'text-brand-primary' },
          { label: 'Recovery Rate', val: '98.2%', sub: 'Surgical Outcome', color: 'text-blue-500' },
          { label: 'No-Show Rate', val: '4.5%', sub: 'Appointments', color: 'text-rose-500' },
        ].map((m, i) => (
          <div key={i} className="col-span-12 md:col-span-3 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm group hover:border-brand-primary transition-all">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{m.label}</p>
            <p className={`text-2xl font-bold ${m.color}`}>{m.val}</p>
            <p className="text-[10px] text-slate-500 font-medium mt-1">{m.sub}</p>
          </div>
        ))}

        {/* Big Charts */}
        <div className="col-span-12 lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm h-[400px]">
           <h3 className="text-lg font-bold text-slate-800 mb-6">Revenue Conversion (OPD vs IPD)</h3>
           <ResponsiveContainer width="100%" height="90%">
              <BarChart data={REVENUE_DATA}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                 <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                 <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                 <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                 <Bar dataKey="opd" fill="#0E848F" radius={[4, 4, 0, 0]} />
                 <Bar dataKey="ipd" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
           </ResponsiveContainer>
        </div>

        <div className="col-span-12 lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
           <h3 className="text-lg font-bold text-slate-800 mb-6">Patient Queue Summary</h3>
           <div className="space-y-6">
              {[
                { label: 'New Registrations', val: 142, icon: 'Patients', color: 'bg-blue-50 text-blue-600' },
                { label: 'Consultations done', val: 89, icon: 'Calendar', color: 'bg-emerald-50 text-emerald-600' },
                { label: 'Follow-ups pending', val: 24, icon: 'Clock', color: 'bg-amber-50 text-amber-600' },
                { label: 'Pharmacy checkouts', val: 104, icon: 'Billing', color: 'bg-purple-50 text-purple-600' },
              ].map((item, i) => {
                const Icon = ICONS[item.icon as keyof typeof ICONS];
                return (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}>
                        <Icon size={18} />
                      </div>
                      <span className="text-sm font-semibold text-slate-700">{item.label}</span>
                    </div>
                    <span className="text-lg font-bold text-slate-800">{item.val}</span>
                  </div>
                );
              })}
           </div>
        </div>
      </div>
    </div>
  );
}
