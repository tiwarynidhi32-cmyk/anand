import { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ICONS } from '../constants';

export default function OPD() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: 'Registration', path: 'registration', icon: 'Patients' },
    { name: 'Clinical Exam', path: 'clinical-exam', icon: 'Search' },
    { name: 'Eye Tests', path: 'eye-tests', icon: 'Reports' },
    { name: 'Diagnosis', path: 'diagnosis', icon: 'Check' },
    { name: 'Billing', path: 'billing', icon: 'Billing' },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 font-display">OPD (Outpatient Department)</h1>
        <p className="text-sm text-slate-500">Clinical examination and outpatient care management</p>
      </div>

      <div className="flex gap-2 mb-8 bg-white p-1 rounded-2xl border border-slate-200 w-fit shadow-sm overflow-x-auto">
        {menuItems.map((item) => {
          const Icon = ICONS[item.icon as keyof typeof ICONS];
          const isActive = location.pathname.includes(`/opd/${item.path}`) || (location.pathname.endsWith('/opd') && item.path === 'registration');
          return (
            <button
              key={item.path}
              onClick={() => navigate(`/opd/${item.path}`)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive 
                  ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' 
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <Icon size={14} />
              {item.name}
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 min-h-[400px]">
        <Routes>
          <Route index element={<OPDRegistration />} />
          <Route path="registration" element={<OPDRegistration />} />
          <Route path="clinical-exam" element={<ClinicalExam />} />
          <Route path="eye-tests" element={<EyeTests />} />
          <Route path="diagnosis" element={<Diagnosis />} />
          <Route path="billing" element={<OPDBilling />} />
          <Route path="*" element={<div className="text-center py-20 text-slate-400">Operational Module Ready - Data Binding Pending</div>} />
        </Routes>
      </div>
    </div>
  );
}

function Diagnosis() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Diagnosis & Prescription</h3>
        <button className="text-xs font-bold text-brand-primary flex items-center gap-1">
          <ICONS.Plus size={14} />
          Load ICD-10 Codes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <label className="block text-[10px] font-bold text-slate-400 uppercase">Diagnosis Notes</label>
          <textarea 
            className="w-full bg-slate-50 rounded-2xl p-4 text-sm min-h-[150px] border border-slate-100 focus:bg-white focus:ring-4 focus:ring-brand-primary/5 transition-all outline-none" 
            placeholder="Describe findings, impressions, and ICD codes..."
          ></textarea>
        </div>
        <div className="space-y-4">
          <label className="block text-[10px] font-bold text-slate-400 uppercase">Prescription (Eye Drops / Meds)</label>
          <div className="space-y-2">
            {[1, 2].map(i => (
              <div key={i} className="flex gap-2">
                <input className="flex-1 bg-slate-50 p-3 rounded-xl text-sm border border-slate-100" placeholder="Medicine Name" />
                <input className="w-24 bg-slate-50 p-3 rounded-xl text-sm border border-slate-100" placeholder="Dosage" />
              </div>
            ))}
            <button className="w-full py-2 border-2 border-dashed border-slate-100 rounded-xl text-[10px] font-bold text-slate-400 uppercase hover:border-brand-primary/30 hover:text-brand-primary transition-all">
              + Add Medicine
            </button>
          </div>
        </div>
      </div>

      <div className="pt-8 border-top border-slate-100 flex justify-end gap-3">
        <button className="px-8 py-3 bg-slate-100 rounded-xl text-xs font-bold text-slate-500">Save Draft</button>
        <button className="px-10 py-3 bg-brand-primary text-white rounded-xl text-xs font-bold shadow-lg shadow-brand-primary/20">Finalize Diagnosis</button>
      </div>
    </div>
  );
}

function OPDBilling() {
  const opdServices = [
    { id: 'O1', name: 'OPD Consultation', price: 500 },
    { id: 'O2', name: 'Refraction / Vision Test', price: 100 },
    { id: 'O3', name: 'Fundus Examination', price: 300 },
    { id: 'O4', name: 'IOP Measurement', price: 150 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Direct OPD Billing</h3>
        <p className="text-[10px] font-bold text-slate-400">PATIENT: WALK-IN / REGISTERED</p>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8">
          <div className="border border-slate-100 rounded-2xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase">Service</th>
                  <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase text-right">Amount</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {opdServices.map(s => (
                  <tr key={s.id}>
                    <td className="px-6 py-4 text-sm font-bold text-slate-700">{s.name}</td>
                    <td className="px-6 py-4 text-sm font-black text-slate-800 text-right italic">₹{s.price}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-1 text-slate-300 hover:text-brand-primary">
                        <ICONS.Plus size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 bg-slate-50 rounded-3xl p-6 border border-slate-100">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Summary</h4>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-xs font-bold text-slate-600">
              <span>Subtotal</span>
              <span>₹0.00</span>
            </div>
            <div className="flex justify-between text-xs font-bold text-slate-600">
              <span>Tax (GST 5%)</span>
              <span>₹0.00</span>
            </div>
            <div className="pt-3 border-t border-slate-200 flex justify-between text-lg font-black text-brand-primary">
              <span>Total</span>
              <span>₹0.00</span>
            </div>
          </div>
          <button className="w-full py-4 bg-brand-primary text-white rounded-2xl font-bold shadow-lg shadow-brand-primary/20 hover:scale-102 transition-all">
            Collect Payment & Print
          </button>
        </div>
      </div>
    </div>
  );
}

function OPDRegistration() {
  return (
    <div className="max-w-4xl space-y-8">
       <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4">
             <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select Patient</label>
             <div className="relative">
                <ICONS.Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input className="w-full bg-slate-50 rounded-xl py-3 pl-10 pr-4 text-sm" placeholder="Search by name/ID..." />
             </div>
          </div>
          <div className="space-y-4">
             <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Assigned Doctor</label>
             <select className="w-full bg-slate-50 rounded-xl p-3 text-sm">
                <option>Dr. Anita Mehta (Retina)</option>
                <option>Dr. Rajesh Gupta (Glaucoma)</option>
             </select>
          </div>
       </div>

       <div className="grid grid-cols-3 gap-6">
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
             <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Token No</p>
             <p className="text-3xl font-bold text-brand-primary">#42</p>
          </div>
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
             <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Queue Status</p>
             <p className="text-xl font-bold text-slate-700">3 Ahead</p>
          </div>
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
             <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Wait Time</p>
             <p className="text-xl font-bold text-slate-700">~15 Mins</p>
          </div>
       </div>
       
       <button className="px-10 py-3 bg-brand-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-brand-primary/20">Check-in Patient</button>
    </div>
  );
}

function ClinicalExam() {
  return (
    <div className="space-y-10">
       <div>
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest border-b pb-4 mb-6">Vision & Refraction</h3>
          <div className="grid grid-cols-2 gap-10">
             <div className="space-y-4">
                <p className="text-xs font-bold text-brand-primary">Right Eye (OD)</p>
                <div className="grid grid-cols-2 gap-4">
                   <FormInput label="Distant Vision" placeholder="6/6" />
                   <FormInput label="Near Vision" placeholder="N6" />
                </div>
             </div>
             <div className="space-y-4">
                <p className="text-xs font-bold text-brand-primary">Left Eye (OS)</p>
                <div className="grid grid-cols-2 gap-4">
                   <FormInput label="Distant Vision" placeholder="6/9" />
                   <FormInput label="Near Vision" placeholder="N6" />
                </div>
             </div>
          </div>
       </div>

       <div>
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest border-b pb-4 mb-6">Anterior Segment</h3>
          <textarea className="w-full bg-slate-50 rounded-2xl p-4 text-sm min-h-[100px]" placeholder="Exam notes for Cornea, Iris, Lens..."></textarea>
       </div>
    </div>
  );
}

function EyeTests() {
  const [tests, setTests] = useState([
    { name: 'Intraocular Pressure', shortName: 'IOP', category: 'Diagnostics', charges: 150 },
    { name: 'Computerized Perimetry', shortName: 'HFA', category: 'Glaucoma', charges: 1200 },
    { name: 'B-Scan Ultrasonography', shortName: 'B-SCAN', category: 'Retina', charges: 800 },
    { name: 'Optical Coherence Tomography', shortName: 'OCT', category: 'General', charges: 2500 },
    { name: 'Pachymetry', shortName: 'PACHY', category: 'Cornea', charges: 500 },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newTest, setNewTest] = useState({ name: '', shortName: '', category: '', charges: '' });

  const handleAddTest = () => {
    if (!newTest.name || !newTest.charges) return;
    setTests([...tests, { ...newTest, charges: Number(newTest.charges) }]);
    setShowAddModal(false);
    setNewTest({ name: '', shortName: '', category: '', charges: '' });
    alert('Eye test added to master list successfully.');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Eye Test Master</h3>
          <p className="text-xs text-slate-500">Configure diagnostic tests and their base pricing</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="px-6 py-2.5 bg-brand-primary text-white rounded-xl text-xs font-bold shadow-lg shadow-brand-primary/20 hover:scale-105 transition-all flex items-center gap-2"
        >
          <ICONS.Plus size={14} />
          Add New Test
        </button>
      </div>

      <div className="border border-slate-100 rounded-3xl overflow-hidden shadow-sm bg-white">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100">
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Test Name</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Short Name</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Charges (₹)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-sm">
            {tests.map((test, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4 font-bold text-slate-700 group-hover:text-brand-primary transition-colors">
                  {test.name}
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-black uppercase tracking-wider">
                    {test.shortName}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-500">{test.category}</td>
                <td className="px-6 py-4 text-right font-black text-slate-800 tabular-nums italic">
                  ₹{test.charges.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Test Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-8"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-800">Register New Eye Test</h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                  <ICONS.Plus className="rotate-45" size={20} />
                </button>
              </div>
              <div className="p-8 grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Test Name</label>
                  <input 
                    className="w-full bg-slate-50 rounded-xl p-3 text-sm border-none outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all" 
                    placeholder="e.g. Visual Field Analysis"
                    value={newTest.name}
                    onChange={e => setNewTest({...newTest, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Short Name</label>
                  <input 
                    className="w-full bg-slate-50 rounded-xl p-3 text-sm border-none outline-none" 
                    placeholder="e.g. VFA"
                    value={newTest.shortName}
                    onChange={e => setNewTest({...newTest, shortName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Category</label>
                  <select 
                    className="w-full bg-slate-50 rounded-xl p-3 text-sm border-none outline-none"
                    value={newTest.category}
                    onChange={e => setNewTest({...newTest, category: e.target.value})}
                  >
                    <option value="">Select Category</option>
                    <option>General</option>
                    <option>Retina</option>
                    <option>Glaucoma</option>
                    <option>Diagnostics</option>
                    <option>Cornea</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Standard Charges (₹)</label>
                  <input 
                    type="number"
                    className="w-full bg-slate-50 rounded-xl p-3 text-sm border-none outline-none font-bold text-brand-primary" 
                    placeholder="Cost per test"
                    value={newTest.charges}
                    onChange={e => setNewTest({...newTest, charges: e.target.value})}
                  />
                </div>
              </div>
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddTest}
                  className="flex-1 py-3 bg-brand-primary text-white rounded-xl text-xs font-bold shadow-lg shadow-brand-primary/20 hover:scale-105 transition-all"
                >
                  Save Test Master
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FormInput({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <div>
      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-wide">{label}</label>
      <input className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-brand-primary/20 transition-all outline-none" placeholder={placeholder} />
    </div>
  );
}
