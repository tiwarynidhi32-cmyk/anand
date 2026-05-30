import { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ICONS, MOCK_ADMISSIONS } from '../constants';

export default function IPD() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { name: 'Registration', path: 'registration', icon: 'Patients' },
    { name: 'Bed Allotment', path: 'bed-allotment', icon: 'Dashboard' },
    { name: 'Surgery Details', path: 'surgery-details', icon: 'Check' },
    { name: 'Discharge', path: 'discharge', icon: 'Logout' },
  ];

  const currentTab = tabs.find(t => location.pathname.includes(t.path))?.path || 'registration';

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 font-display">IPD (Inpatient Department)</h1>
          <p className="text-sm text-slate-500">Manage admissions, surgery patients, and bed allocations</p>
        </div>
        <div className="flex gap-2 bg-white p-1 rounded-2xl border border-slate-200">
          {tabs.map((tab) => (
            <button
              key={tab.path}
              onClick={() => navigate(`/ipd/${tab.path}`)}
              className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${
                currentTab === tab.path ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm min-h-[500px]">
        <Routes>
          <Route index element={<AdmissionList />} />
          <Route path="registration" element={<AdmissionList />} />
          <Route path="bed-allotment" element={<BedManagement />} />
          <Route path="surgery-details" element={<SurgeryDetails />} />
          <Route path="discharge" element={<Discharge />} />
          <Route path="*" element={<div className="p-20 text-center text-slate-400">IPD Module Operational - Data Interface Ready</div>} />
        </Routes>
      </div>
    </div>
  );
}

function SurgeryDetails() {
  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-800">Surgical Planning</h3>
        <span className="px-3 py-1 bg-brand-primary text-white text-[10px] font-black uppercase rounded-lg">OT Schedule Today</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Procedure Team</label>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Surgeon</span>
                <span className="font-bold text-slate-800">Dr. Alok Mehta</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Anaesthetist</span>
                <span className="font-bold text-slate-800">Dr. S. K. Singh</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Scrub Nurse</span>
                <span className="font-bold text-slate-800">Sister Shiny</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
             <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">OT Checklist (Pre-Op)</label>
             {['Consent Form Signed', 'Vital Signs Stable', 'Site Marked', 'Pre-medication Given'].map(check => (
               <label key={check} className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl cursor-pointer hover:bg-slate-50 transition-all">
                 <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary" />
                 <span className="text-sm text-slate-600">{check}</span>
               </label>
             ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Surgery Notes (Post-Op)</label>
            <textarea 
              className="w-full bg-slate-50 rounded-2xl p-4 text-sm min-h-[200px] border border-slate-100 outline-none focus:bg-white transition-all"
              placeholder="Record operative findings, complications, and post-op advice..."
            ></textarea>
          </div>
          <button className="w-full py-4 bg-brand-primary text-white rounded-2xl font-bold shadow-lg shadow-brand-primary/20 hover:scale-102 transition-all">
            Seal Surgical Record
          </button>
        </div>
      </div>
    </div>
  );
}

function Discharge() {
  return (
    <div className="p-8 space-y-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center">
           <h3 className="text-xl font-bold text-slate-800">Initiate Discharge Protocol</h3>
           <p className="text-sm text-slate-500">Finalize patient records and billing for release</p>
        </div>

        <div className="space-y-4">
           <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Discharge Summary</label>
           <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                 <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Discharge Type</label>
                    <select className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-sm">
                       <option>Routine / Improved</option>
                       <option>Against Medical Advice (LAMA)</option>
                       <option>Transfer to Higher Center</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Follow-up Date</label>
                    <input type="date" className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-sm" />
                 </div>
              </div>
              <div>
                 <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Medication on Discharge</label>
                 <textarea className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm min-h-[100px]" placeholder="List take-home medicines..."></textarea>
              </div>
           </div>
        </div>

        <div className="bg-amber-50 border border-amber-100 p-6 rounded-3xl flex items-start gap-4">
           <div className="p-2 bg-amber-200 text-amber-600 rounded-xl">
              <ICONS.Bell size={20} />
           </div>
           <div>
              <p className="text-sm font-bold text-amber-800">Pending Financial Clearance</p>
              <p className="text-xs text-amber-600 mt-1">Patient billing must be settled at the billing counter before final gate pass generation.</p>
           </div>
        </div>

        <div className="flex gap-4">
           <button className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-bold">Print Discharge Summary</button>
           <button className="flex-1 py-4 bg-brand-primary text-white rounded-2xl font-bold shadow-lg shadow-brand-primary/20">Finalize Discharge</button>
        </div>
      </div>
    </div>
  );
}

function AdmissionList() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-slate-700">Currently Admitted Patients</h3>
        <button className="text-xs font-bold text-brand-primary uppercase hover:underline">+ New Admission</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-4">Patient</th>
              <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Adm. Date</th>
              <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bed No</th>
              <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Doctor</th>
              <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Condition</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {MOCK_ADMISSIONS.map((adm) => (
              <tr key={adm.id} className="group hover:bg-slate-50 transition-colors">
                <td className="py-4 pl-4">
                  <p className="text-sm font-bold text-slate-800">{adm.name}</p>
                  <p className="text-[10px] text-slate-400 uppercase">{adm.id}</p>
                </td>
                <td className="py-4 text-xs text-slate-600">{adm.date}</td>
                <td className="py-4">
                  <span className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-mono font-bold text-slate-600">{adm.id + 'A'}</span>
                </td>
                <td className="py-4 text-xs font-medium text-slate-700">Dr. Mehta</td>
                <td className="py-4">
                  <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                    parseInt(adm.id) % 2 === 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                  }`}>
                    {parseInt(adm.id) % 2 === 0 ? 'Stable' : 'Critical'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function BedManagement() {
  const wards = [
    { name: 'General Ward', total: 20, occupied: 14 },
    { name: 'Private Room', total: 8, occupied: 5 },
    { name: 'Semi-Private', total: 12, occupied: 10 },
    { name: 'ICU / Recovery', total: 4, occupied: 2 },
  ];

  return (
    <div className="p-8 space-y-8">
       <div className="grid grid-cols-4 gap-6">
          {wards.map(ward => (
            <div key={ward.name} className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
               <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">{ward.name}</p>
               <div className="flex items-end justify-between">
                  <p className="text-2xl font-bold text-slate-800">{ward.occupied}/{ward.total}</p>
                  <p className="text-[10px] font-bold text-brand-primary">{Math.round((ward.occupied/ward.total)*100)}% Used</p>
               </div>
               <div className="mt-4 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-primary" style={{ width: `${(ward.occupied/ward.total)*100}%` }}></div>
               </div>
            </div>
          ))}
       </div>

       <div className="grid grid-cols-10 gap-2">
          {Array.from({ length: 40 }).map((_, i) => (
             <div key={i} className={`aspect-square rounded-lg border flex items-center justify-center text-[10px] font-bold transition-all cursor-pointer ${
               i % 5 === 0 ? 'bg-red-50 border-red-100 text-red-400' : 'bg-white border-slate-100 text-slate-300 hover:border-brand-primary'
             }`}>
                {i + 1}
             </div>
          ))}
       </div>
    </div>
  );
}
