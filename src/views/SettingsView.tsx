import { useState } from 'react';
import { ICONS } from '../constants';

export default function SettingsView() {
  const [activeTab, setActiveTab] = useState('general');

  const configTabs = [
    { id: 'general', label: 'Hospital Info', icon: 'Dashboard' },
    { id: 'users', label: 'User Roles', icon: 'Patients' },
    { id: 'doctors', label: 'Doctor Master', icon: 'Calendar' },
    { id: 'billing', label: 'Billing Config', icon: 'Billing' },
    { id: 'notifications', label: 'Notifications', icon: 'Bell' },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">System Configuration</h1>
        <p className="text-sm text-slate-500">Configure masters, user accounts, and global hospital parameters</p>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-3 space-y-2">
           {configTabs.map(tab => {
             const Icon = ICONS[tab.icon as keyof typeof ICONS];
             return (
               <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id)}
                 className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                   activeTab === tab.id ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'text-slate-500 hover:bg-slate-50'
                 }`}
               >
                 <Icon size={18} />
                 {tab.label}
               </button>
             );
           })}
        </div>

        <div className="col-span-12 lg:col-span-9 bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
           {activeTab === 'general' && <GeneralSettings />}
           {activeTab === 'doctors' && <DoctorMaster />}
           {activeTab === 'billing' && <BillingConfig />}
        </div>
      </div>
    </div>
  );
}

function BillingConfig() {
  const [fee, setFee] = useState('500');
  const [followup, setFollowup] = useState('300');
  
  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h2 className="text-lg font-bold text-slate-800 mb-6 border-b pb-4 flex items-center gap-2">
           <ICONS.Billing className="text-brand-primary" size={20} />
           Billing & Fee Masters
        </h2>
        <div className="space-y-6">
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-bold text-slate-800">Standard Appointment Fee</h4>
                <p className="text-xs text-slate-500">Default consultation charge for new appointments</p>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
                <input 
                  type="number" 
                  value={fee} 
                  onChange={(e) => setFee(e.target.value)}
                  className="w-32 bg-white rounded-xl py-2 pl-7 pr-4 text-sm font-bold border border-slate-200 focus:ring-2 focus:ring-brand-primary/20 outline-none" 
                />
              </div>
            </div>
            <div className="flex gap-2">
              <span className="px-2 py-0.5 bg-brand-primary/10 text-brand-primary rounded text-[10px] font-bold">ACTIVE</span>
              <span className="px-2 py-0.5 bg-slate-200 text-slate-500 rounded text-[10px] font-bold">UPDATED JUST NOW</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl">
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Follow-up Fee</label>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-bold">₹</span>
                <input 
                  type="number" 
                  value={followup} 
                  onChange={(e) => setFollowup(e.target.value)}
                  className="bg-transparent text-lg font-black text-slate-700 w-full outline-none"
                />
              </div>
            </div>
            <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl">
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Emergency Fee</p>
              <p className="text-lg font-black text-slate-700">₹ 1,000</p>
            </div>
          </div>
        </div>
      </div>
      <button 
        onClick={() => alert('Appointment fees updated successfully across the system.')}
        className="px-8 py-3 bg-brand-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-brand-primary/20 hover:scale-105 active:scale-95 transition-all"
      >
        Save All Changes
      </button>
    </div>
  );
}

function GeneralSettings() {
  return (
    <div className="space-y-10 max-w-2xl">
       <div>
         <h2 className="text-lg font-bold text-slate-800 mb-6 border-b pb-4">Hospital Branding</h2>
         <div className="space-y-6">
           <div className="flex items-center gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-100">
             <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center text-brand-primary border border-slate-200 shadow-sm relative group overflow-hidden">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-[#cc0066] text-white flex items-center justify-center rounded-sm font-bold text-lg">+</div>
                  <span className="text-[8px] font-bold text-[#cc0066] uppercase mt-1">आनन्द</span>
                </div>
                <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <ICONS.Plus size={24} className="text-white" />
                </div>
             </div>
             <div className="flex-1">
               <h4 className="text-sm font-bold text-slate-800 mb-1">Hospital Logo</h4>
               <p className="text-xs text-slate-500 mb-3">Upload a high-resolution logo for receipts and reports. Recommended size: 512x512px.</p>
               <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all">Change Logo</button>
             </div>
           </div>

           <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2 leading-none">Hospital Name</label>
              <input className="w-full bg-slate-50 rounded-xl p-4 text-sm border border-transparent focus:border-brand-primary/20 outline-none" defaultValue="Anand Hospital and Eye Care Center" />
           </div>

           <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 leading-none">Registration ID</label>
                <input className="w-full bg-slate-50 rounded-xl p-4 text-sm border border-transparent focus:border-brand-primary/20 outline-none" defaultValue="REG-70150-UP" />
             </div>
             <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 leading-none">Primary Email</label>
                <input className="w-full bg-slate-50 rounded-xl p-4 text-sm border border-transparent focus:border-brand-primary/20 outline-none" defaultValue="info@anandhospital.com" />
             </div>
           </div>

           <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2 leading-none">Phone Number(s)</label>
              <input className="w-full bg-slate-50 rounded-xl p-4 text-sm border border-transparent focus:border-brand-primary/20 outline-none" defaultValue="+91 7015022218, +91 22 2456 7890" />
           </div>

           <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2 leading-none">Full Address</label>
              <textarea 
                className="w-full bg-slate-50 rounded-xl p-4 text-sm border border-transparent focus:border-brand-primary/20 outline-none min-h-[100px]" 
                defaultValue="Near New Maruti showroom Bansi Road Bargadwa, Basti UP - 272002"
              />
           </div>
           <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Currency</label>
                <select className="w-full bg-slate-50 rounded-xl p-3 text-sm">
                  <option>INR (₹)</option>
                  <option>USD ($)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Time Zone</label>
                <select className="w-full bg-slate-50 rounded-xl p-3 text-sm">
                  <option>India (IST)</option>
                  <option>USA (EST)</option>
                </select>
              </div>
           </div>
         </div>
       </div>
       <button className="px-8 py-3 bg-brand-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-brand-primary/20 hover:scale-105 active:scale-95 transition-all">Save Changes</button>
    </div>
  );
}

function DoctorMaster() {
  const doctors = [
    { id: 'DOC01', name: 'Dr. Anita Mehta', spec: 'Retina Specialist', status: 'Online' },
    { id: 'DOC02', name: 'Dr. Sameer Kumar', spec: 'Cataract Surgeon', status: 'In Surgery' },
    { id: 'DOC03', name: 'Dr. Rajesh Gupta', spec: 'Glaucoma Expert', status: 'Offline' },
  ];

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-800">Doctor Directory</h2>
          <button className="px-4 py-2 bg-brand-secondary text-white rounded-xl text-xs font-bold">+ New Doctor</button>
       </div>
       <div className="space-y-3">
          {doctors.map(doc => (
            <div key={doc.id} className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between border border-transparent hover:border-slate-200 transition-all">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-brand-primary border border-slate-100 shadow-sm">
                    <ICONS.Patients size={24} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{doc.name}</h4>
                    <p className="text-xs text-slate-500">{doc.spec}</p>
                  </div>
               </div>
               <div className="flex items-center gap-6">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest ${
                    doc.status === 'Online' ? 'bg-green-100 text-green-700' : 
                    doc.status === 'In Surgery' ? 'bg-rose-100 text-rose-700' : 'bg-slate-200 text-slate-500'
                  }`}>{doc.status}</span>
                  <button className="text-slate-400 hover:text-brand-primary"><ICONS.Settings size={18} /></button>
               </div>
            </div>
          ))}
       </div>
    </div>
  );
}
