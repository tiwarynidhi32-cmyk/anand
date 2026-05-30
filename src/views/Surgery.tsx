import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ICONS } from '../constants';
import { motion, AnimatePresence } from 'motion/react';

export default function Surgery() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { id: 'schedule-surgery', label: 'Schedule Surgery', icon: 'Dashboard' },
    { id: 'ot-checklist', label: 'OT Checklist', icon: 'Check' },
    { id: 'surgical-record', label: 'Surgical Record', icon: 'Reports' },
    { id: 'post-op', label: 'Post-Op Instructions', icon: 'Clock' },
  ];

  const currentTab = tabs.find(t => location.pathname.includes(t.id))?.id || 'schedule-surgery';

  return (
    <div className="p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 font-display">Surgery & OT Management</h1>
          <p className="text-sm text-slate-500">Operation Theater scheduling and clinical documentation</p>
        </div>
        <div className="flex gap-2">
            <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-xs font-bold border border-blue-100">
              OT 1: Occupied (Cataract)
            </div>
            <div className="bg-green-50 text-green-600 px-4 py-2 rounded-xl text-xs font-bold border border-green-100">
              OT 2: Available
            </div>
        </div>
      </div>

      <div className="flex gap-2 mb-8 bg-white p-1 rounded-2xl border border-slate-200 w-fit shadow-sm overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = ICONS[tab.icon as keyof typeof ICONS] || ICONS.Dashboard;
          return (
            <button
              key={tab.id}
              onClick={() => navigate(`/surgery/${tab.id}`)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                currentTab === tab.id 
                  ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' 
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="min-h-[500px]">
        <Routes>
          <Route index element={<SurgeryScheduler />} />
          <Route path="schedule-surgery" element={<SurgeryScheduler />} />
          <Route path="ot-checklist" element={<PreOpChecklist />} />
          <Route path="surgical-record" element={<SurgicalRecordForm />} />
          <Route path="*" element={<div className="p-20 text-center text-slate-400 font-bold">Module Active - Interface Ready</div>} />
        </Routes>
      </div>
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 mb-6">
      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-50 pb-4">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {children}
      </div>
    </div>
  );
}

function FormInput({ label, placeholder, type = 'text', suffix }: { label: string; placeholder?: string; type?: string; suffix?: string }) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">{label}</label>
      <input 
        type={type} 
        className="w-full bg-slate-50 border-transparent border-2 focus:border-brand-primary/20 focus:bg-white rounded-xl py-3 px-4 text-sm outline-none transition-all" 
        placeholder={placeholder}
      />
    </div>
  );
}

function SurgeryScheduler() {
  const navigate = useNavigate();
  return (
    <div className="max-w-5xl">
      <SectionCard title="OT Booking Information">
        <FormInput label="Surgery Type" placeholder="e.g. Cataract Phaco" />
        <FormInput label="Surgeon" placeholder="Select Doctor..." />
        <FormInput label="Anesthetist" placeholder="Select..." />
        <FormInput label="OT Room" placeholder="Select OT 1/2..." />
        <FormInput label="Start Time" type="datetime-local" />
        <FormInput label="Expected Duration" placeholder="60 Mins" />
      </SectionCard>
      
      <div className="bg-white rounded-3xl border border-slate-200 p-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-slate-800">Check Anesthetist Availability</p>
          <p className="text-xs text-slate-500">Dr. Rajesh is assigned to 3 surgeries today</p>
        </div>
        <button 
          onClick={() => navigate('/appointments/calendar')}
          className="px-6 py-2 bg-slate-100 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors"
        >
          View OT Calendar
        </button>
      </div>
    </div>
  );
}

function PreOpChecklist() {
  const items = [
    "Patient Identity Verified",
    "Consent Form Signed",
    "Operative Site Marked",
    "Allergies Noted",
    "Blood Reports Verified",
    "NPO Status (Nil Per Oral) Confirmed",
  ];

  return (
    <div className="max-w-3xl bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="bg-amber-50 p-4 border-b border-amber-100 flex items-center gap-3">
        <ICONS.Check className="text-amber-600" size={20} />
        <span className="text-sm font-bold text-amber-800">Mandatory Safety Checks</span>
      </div>
      <div className="p-8 space-y-4">
        {items.map((item, i) => (
          <label key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
            <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-brand-primary focus:ring-brand-primary" />
            <span className="text-sm font-semibold text-slate-700">{item}</span>
          </label>
        ))}
        <button className="w-full mt-6 py-4 bg-brand-primary text-white rounded-2xl font-bold shadow-lg shadow-brand-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">Mark Ready for Surgery</button>
      </div>
    </div>
  );
}

function SurgicalRecordForm() {
  return (
    <div className="max-w-6xl">
      <SectionCard title="Surgical Documentation">
        <FormInput label="Eye Operated" placeholder="Left / Right / Both" />
        <FormInput label="Lens Serial No" placeholder="e.g., SN102931" />
        <FormInput label="IOL Power" placeholder="18.5D" />
        <FormInput label="Instruments Used" placeholder="Phaco Tip, Speculum..." />
        <FormInput label="Complications" placeholder="None / Details..." />
        <FormInput label="Outcome" placeholder="Successful / Partial..." />
      </SectionCard>
      
      <div className="bg-white rounded-3xl border border-slate-200 p-8">
        <label className="block text-xs font-bold text-slate-700 mb-4 uppercase tracking-wide">Detailed Surgery Notes</label>
        <textarea className="w-full min-h-[200px] bg-slate-50 rounded-2xl p-6 text-sm border-2 border-transparent focus:border-brand-primary/20 outline-none" placeholder="Describe the procedure steps and any anatomical variants..."></textarea>
      </div>
    </div>
  );
}
