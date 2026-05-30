import React, { useState, useRef } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ICONS, MOCK_ADMISSIONS } from '../constants';
import { PrescriptionTemplate } from '../components/PrescriptionTemplate';

export default function Patients() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPrescription, setShowPrescription] = useState<any>(null);
  
  const tabs = [
    { name: 'Patient List', path: 'patient-list', icon: 'Patients' },
    { name: 'Register New Patient', path: 'register-new-patient', icon: 'Plus' },
    { name: 'Patient History', path: 'patient-history', icon: 'Reports' },
  ];

  const currentTab = tabs.find(t => location.pathname.includes(t.path))?.path || 'patient-list';

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 font-display">Patient Management</h1>
          <p className="text-sm text-slate-500">Manage and register your hospital patients</p>
        </div>
        <div className="flex gap-3 bg-white p-1 rounded-2xl border border-slate-200">
          {tabs.map((tab) => {
            const Icon = ICONS[tab.icon as keyof typeof ICONS] || ICONS.Dashboard;
            return (
              <button 
                key={tab.path}
                onClick={() => navigate(`/patients/${tab.path}`)}
                className={`flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-bold transition-all ${currentTab === tab.path ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <Icon size={14} />
                {tab.name}
              </button>
            );
          })}
        </div>
      </div>

      <Routes>
        <Route index element={<PatientList onPrint={setShowPrescription} />} />
        <Route path="patient-list" element={<PatientList onPrint={setShowPrescription} />} />
        <Route path="register-new-patient" element={<RegisterPatient />} />
        <Route path="patient-history" element={<PatientHistory />} />
      </Routes>

      <AnimatePresence>
        {showPrescription && (
          <PrescriptionTemplate 
            patient={showPrescription} 
            onClose={() => setShowPrescription(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function PatientHistory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  
  const patients = MOCK_ADMISSIONS.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.toString().includes(searchTerm)
  );

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-12 gap-8">
        {/* Left: Patient Selector */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Select Patient</h3>
            <span className="text-[10px] font-bold text-slate-400">{patients.length} Results</span>
          </div>
          <div className="relative mb-4">
            <ICONS.Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-10 pr-4 text-sm focus:bg-white focus:ring-4 focus:ring-brand-primary/5 transition-all outline-none" 
              placeholder="Search by name or ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {patients.map(p => (
              <button 
                key={p.id}
                onClick={() => setSelectedPatient(p)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${
                  selectedPatient?.id === p.id 
                    ? 'bg-brand-primary border-brand-primary shadow-lg shadow-brand-primary/20 text-white' 
                    : 'bg-white border-slate-100 hover:border-brand-primary/30 text-slate-600'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
                  selectedPatient?.id === p.id ? 'bg-white/20' : 'bg-slate-100 text-slate-400'
                }`}>
                  {p.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold truncate">{p.name}</p>
                  <p className={`text-[10px] font-mono ${selectedPatient?.id === p.id ? 'text-white/60' : 'text-slate-400'}`}>ID: PAT-00{p.id}</p>
                </div>
              </button>
            ))}
            {patients.length === 0 && (
              <div className="text-center py-10 text-slate-400 italic text-sm">No patients found</div>
            )}
          </div>
        </div>

        {/* Right: History View */}
        <div className="col-span-12 lg:col-span-8">
          {selectedPatient ? (
            <motion.div 
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
                <div className="flex justify-between items-start mb-8">
                  <div className="flex gap-6 items-center">
                    <img src={selectedPatient.avatar} className="w-20 h-20 rounded-3xl shadow-xl shadow-brand-primary/10" alt="" />
                    <div>
                      <h2 className="text-2xl font-black text-slate-800">{selectedPatient.name}</h2>
                      <p className="text-sm text-slate-400 font-medium">{selectedPatient.age} years • {selectedPatient.gender}</p>
                      <div className="flex gap-2 mt-2">
                        <span className="px-2 py-0.5 bg-brand-primary text-white rounded text-[9px] font-black uppercase tracking-widest">{selectedPatient.treatment}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                    <span className="px-3 py-1 bg-green-50 text-green-600 rounded-lg text-xs font-bold border border-green-100">Discharged</span>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-10 text-center">
                  {Object.entries(selectedPatient.vitals).map(([key, val]: [string, any]) => (
                    <div key={key} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-1">{key}</p>
                      <p className="text-sm font-black text-slate-800 tabular-nums">{val}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-6">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b pb-4">Clinical Timeline</h3>
                  {[
                    { date: '02/05/2026', title: 'Post-Op Review', desc: 'No inflammation, vision clear. IOP normal.', type: 'review' },
                    { date: '02/05/2026', title: 'Cataract Surgery (Left Eye)', desc: 'Phacoemulsification with IOL implantation completed.', type: 'surgery' },
                    { date: '01/05/2026', title: 'Pre-Op Diagnostics', desc: 'A-Scan, B-Scan, Blood sugar normal.', type: 'test' },
                    { date: '01/05/2026', title: 'Initial OPD Visit', desc: 'Patient complained of blurred vision.', type: 'consult' }
                  ].map((event, i) => (
                    <div key={i} className="flex gap-6 group">
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full mt-1.5 outline outline-4 outline-white ${
                          event.type === 'surgery' ? 'bg-red-500 shadow-lg shadow-red-500/20' :
                          event.type === 'review' ? 'bg-green-500' : 'bg-brand-primary'
                        }`}></div>
                        <div className="flex-1 w-0.5 bg-slate-100 my-2 group-last:hidden"></div>
                      </div>
                      <div className="pb-8">
                        <p className="text-[10px] font-mono text-slate-400 mb-1">{event.date}</p>
                        <h4 className="text-sm font-bold text-slate-800 mb-1">{event.title}</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">{event.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-20 text-center bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200">
              <ICONS.Patients size={64} className="text-slate-200 mb-6" />
              <h3 className="text-xl font-bold text-slate-800">No Patient Selected</h3>
              <p className="text-sm text-slate-500 max-w-sm mt-4">Select a patient from the list on the left to view their complete clinical history, vitals, and surgical records.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PatientList({ onPrint }: { onPrint: (patient: any) => void }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const filteredPatients = MOCK_ADMISSIONS.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.toString().includes(searchTerm) ||
    p.treatment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const suggestions = searchTerm.length >= 1 ? MOCK_ADMISSIONS.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.toString().includes(searchTerm)
  ).slice(0, 5) : [];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <div className="relative w-80">
          <ICONS.Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Search by ID, Name or Treatment" 
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-10 pr-4 text-xs focus:ring-2 focus:ring-brand-primary/10 outline-none transition-all"
          />

          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden"
              >
                <div className="p-2 border-b border-slate-50 text-[9px] font-black uppercase text-slate-400 tracking-widest bg-slate-50/50">
                  Quick Suggestions
                </div>
                {suggestions.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSearchTerm(p.name);
                      setShowSuggestions(false);
                    }}
                    className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 transition-colors text-left group"
                  >
                    <img src={p.avatar} className="w-8 h-8 rounded-full border border-slate-100 group-hover:border-brand-primary" alt="" />
                    <div>
                      <p className="text-xs font-bold text-slate-700 group-hover:text-brand-primary">{p.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">#PAT-00{p.id}</p>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate('/patients/patient-history')} className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg" title="Full Reports History"><ICONS.Reports size={18} /></button>
          <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg"><ICONS.Settings size={18} /></button>
        </div>
      </div>
      <table className="w-full">
        <thead>
          <tr className="bg-slate-50/50 text-left">
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Patient ID</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Patient Name</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Treatment</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Last Visit</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {filteredPatients.map((p, i) => (
            <tr key={p.id} className="hover:bg-slate-50/50 transition-colors cursor-pointer group">
              <td onClick={() => navigate('/patients/patient-history')} className="px-6 py-4 text-sm font-mono text-slate-500">#PAT-00{p.id}</td>
              <td onClick={() => navigate('/patients/patient-history')} className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <img src={p.avatar} className="w-8 h-8 rounded-full" alt="" />
                  <span className="text-sm font-semibold text-slate-700">{p.name}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="text-xs px-2 py-1 rounded-lg bg-brand-primary/5 text-brand-primary font-medium">{p.treatment}</span>
              </td>
              <td className="px-6 py-4 text-sm text-slate-500">{p.date}</td>
              <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onPrint(p);
                  }}
                  className="p-2 text-slate-400 hover:text-brand-primary hover:bg-slate-50 rounded-lg transition-all"
                  title="Generate Blank Prescription"
                >
                  <ICONS.Plus size={16} />
                </button>
                <button 
                  onClick={(e) => {
                     e.stopPropagation();
                     navigate('/patients/patient-history');
                  }}
                  className="p-2 text-slate-300 hover:text-brand-primary hover:bg-slate-50 rounded-lg transition-all group-hover:scale-110"
                  title="View History Details"
                >
                  <ICONS.Dashboard size={16} />
                </button>
                <button 
                  onClick={(e) => {
                     e.stopPropagation();
                  }}
                  className="p-2 text-slate-300 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                  title="Edit Patient"
                >
                  <ICONS.Settings size={16} />
                </button>
              </td>
            </tr>
          ))}
          {filteredPatients.length === 0 && (
            <tr>
              <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">No patients found matching your search</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function RegisterPatient() {
  const [gender, setGender] = useState('Male');
  const [relation, setRelation] = useState('Son of');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Update relation options based on gender
  const getRelationOptions = () => {
    if (gender === 'Male') return ['Son of', 'Guardian'];
    if (gender === 'Female') return ['Wife of', 'Daughter of', 'Guardian'];
    return ['Guardian'];
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 max-w-5xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
        {/* Left Column: Personal Information */}
        <div className="space-y-8">
          <div className="border-b border-slate-50 pb-4">
            <h3 className="text-lg font-bold text-slate-800">1. Basic Information</h3>
            <p className="text-xs text-slate-500">Essential contact and identity details</p>
          </div>
          
          <div className="space-y-5">
            <FormInput label="Full Name" placeholder="Ex: Rajesh Kumar Koppikar" />
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Gender</label>
                <select 
                  value={gender}
                  onChange={(e) => {
                    const newGender = e.target.value;
                    setGender(newGender);
                    // Reset relation to first valid option
                    if (newGender === 'Male') setRelation('Son of');
                    else if (newGender === 'Female') setRelation('Wife of');
                    else setRelation('Guardian');
                  }}
                  className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-brand-primary/20 transition-all outline-none"
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
              <FormInput label="Age / Date of Birth" placeholder="Ex: 28 or 12/05/1995" />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Relation</label>
                  <select 
                    value={relation}
                    onChange={(e) => setRelation(e.target.value)}
                    className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-brand-primary/20 transition-all outline-none"
                  >
                    {getRelationOptions().map(opt => <option key={opt}>{opt}</option>)}
                  </select>
               </div>
               <FormInput label="Relative / Guardian Name" placeholder="Enter name..." />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <FormInput label="Contact Number" placeholder="+91 00000 00000" />
               <FormInput label="Email ID" placeholder="patient@example.com" />
            </div>

            <FormInput label="Address" placeholder="Full residential address..." />
            
            <div className="grid grid-cols-2 gap-4">
               <FormInput label="Aadhar Card / ID Proof" placeholder="UID Number..." />
               <FormInput label="Blood Group" placeholder="Ex: O+" />
            </div>
          </div>
        </div>
        
        {/* Right Column: Emergency & Medical */}
        <div className="space-y-8">
          <div className="border-b border-slate-50 pb-4">
            <h3 className="text-lg font-bold text-slate-800">2. Medical & Emergency</h3>
            <p className="text-xs text-slate-500">Guardian and health history profile</p>
          </div>
          
          <div className="space-y-5">
            <FormInput label="Emergency Contact" placeholder="Name & Relationship..." />
            <FormInput label="Emergency Phone" placeholder="+91 00000 00000" />
            
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="p-5 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-center border-dashed group cursor-pointer hover:border-brand-primary transition-all overflow-hidden h-32 relative"
            >
               <input 
                 type="file" 
                 ref={fileInputRef} 
                 onChange={handlePhotoChange} 
                 className="hidden" 
                 accept="image/*" 
               />
               {photoPreview ? (
                 <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
               ) : (
                 <div className="text-center">
                    <ICONS.Plus className="mx-auto text-slate-300 group-hover:text-brand-primary transition-colors" size={24} />
                    <p className="text-[10px] font-bold text-slate-500 uppercase mt-2">Upload Photo / ID Scan</p>
                 </div>
               )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Past Medical History</label>
              <textarea className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm h-24" placeholder="Mention any serious conditions or allergies..."></textarea>
            </div>

            <div className="p-4 bg-brand-primary/5 rounded-2xl border border-brand-primary/10">
               <p className="text-[10px] font-bold text-brand-primary uppercase tracking-widest mb-1">Registration Note</p>
               <p className="text-xs text-slate-600 leading-relaxed">
                  Carefully verify identity proofs before completing registration. Unique Patient ID will be generated upon saving.
               </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-12 pt-8 border-t flex justify-end gap-3">
        <button className="px-6 py-3 rounded-xl text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all">Save Draft</button>
        <button className="px-10 py-3 rounded-xl text-sm font-bold text-white bg-brand-primary shadow-xl shadow-brand-primary/20 hover:scale-[1.03] active:scale-[0.97] transition-all">Complete Registration</button>
      </div>
    </div>
  );
}

function FormInput({ label, placeholder, type = 'text' }: { label: string; placeholder: string; type?: string }) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-wide">{label}</label>
      <input 
        type={type} 
        className="w-full bg-slate-50 border-transparent border-2 focus:border-brand-primary/20 focus:bg-white rounded-xl py-3 px-4 text-sm transition-all outline-none" 
        placeholder={placeholder} 
      />
    </div>
  );
}

