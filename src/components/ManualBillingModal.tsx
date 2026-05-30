import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ICONS, MOCK_ADMISSIONS } from '../constants';
import { saveBill } from '../lib/store';

export function ManualBillingModal({ onClose }: { onClose: () => void }) {
  const [selectedPatient, setSelectedPatient] = useState<any>(MOCK_ADMISSIONS[0]);
  const [charges, setCharges] = useState<any[]>([]);
  const [discount, setDiscount] = useState(0);
  const [roundOff, setRoundOff] = useState(0);
  const [refund, setRefund] = useState(0);

  // Clear all on initial mount to ensure a fresh billing session
  useEffect(() => {
    setCharges([]);
    setDiscount(0);
    setRoundOff(0);
    setRefund(0);
  }, []);

  const handlePatientChange = (patientId: string) => {
    const patient = MOCK_ADMISSIONS.find(p => p.id === patientId);
    if (patient) {
      setSelectedPatient(patient);
      setCharges([]);
      setDiscount(0);
      setRoundOff(0);
      setRefund(0);
    }
  };
  const [showAddItem, setShowAddItem] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [newItem, setNewItem] = useState({
    category: 'Operation Charges',
    name: '',
    date: new Date().toISOString().split('T')[0],
    from: new Date().toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0],
    rate: 0,
    qty: 1,
    days: 1,
    tech: 'DR RAJU SINGH',
    doctor: 'DR ALOK SHARMA',
    referrer: 'DR RAJU SINGH'
  });

  const addCharge = () => {
    if (!newItem.name && newItem.category !== 'Consultant Charges') return;
    const itemToAdd = {
      ...newItem,
      id: Math.random().toString(36).substr(2, 9),
      total: newItem.category === 'Bed Charges' ? newItem.rate * newItem.days : newItem.rate * newItem.qty
    };
    setCharges([...charges, itemToAdd]);
    setShowAddItem(false);
    setNewItem({ 
      ...newItem, 
      name: '', 
      rate: 0, 
      qty: 1, 
      days: 1,
      category: 'Operation Charges' 
    });
  };

  const removeItem = (id: string) => {
    setCharges(charges.filter(c => c.id !== id));
  };

  const formatDate = (date: Date | string) => {
    if (!date || date === 'N/A') return 'N/A';
    const d = new Date(date);
    if (isNaN(d.getTime())) return String(date); // Return as is if invalid (e.g., "Today")
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const grandTotal = charges.reduce((sum, item) => sum + item.total, 0);
  const netTotal = grandTotal - discount + roundOff - refund;

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 print:p-0 print:bg-white"
    >
      <motion.div 
        initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
        className="bg-white rounded-3xl w-full max-w-6xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] print:shadow-none print:rounded-none print:max-h-none print:h-auto"
      >
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 print:hidden">
          <div className="flex items-center gap-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <ICONS.Billing className="text-brand-primary" size={18} />
              Manual IPD Bill Generator
            </h3>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Select Patient:</span>
              <select 
                className="bg-white border border-slate-200 rounded-lg px-3 py-1 text-xs outline-none font-bold"
                onChange={(e) => handlePatientChange(e.target.value)}
                value={selectedPatient?.id}
              >
                {MOCK_ADMISSIONS.map(p => (
                  <option key={p.id} value={p.id}>{p.name} (#PAT-00{p.id})</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            {confirmClear ? (
              <div className="flex items-center gap-2 bg-red-50 p-1 rounded-xl border border-red-200">
                <span className="text-[10px] font-bold text-red-600 px-2">Clear all entries?</span>
                  <button 
                  onClick={() => {
                    setCharges([]);
                    setDiscount(0);
                    setRoundOff(0);
                    setRefund(0);
                    setConfirmClear(false);
                  }}
                  className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-[10px] font-bold shadow-sm"
                >
                  Yes, Clear
                </button>
                <button 
                  onClick={() => setConfirmClear(false)}
                  className="px-3 py-1.5 bg-white text-slate-600 border border-slate-200 rounded-lg text-[10px] font-bold shadow-sm"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setConfirmClear(true)}
                className="px-4 py-2 bg-white border border-red-200 text-red-500 rounded-xl text-xs font-bold hover:bg-red-50 transition-colors flex items-center gap-2"
              >
                <ICONS.Plus className="rotate-45" size={14} />
                Clear All Entries
              </button>
            )}
            <button 
              onClick={() => setShowAddItem(true)}
              className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold shadow-lg flex items-center gap-2"
            >
              <ICONS.Plus size={14} />
              Add Bill Item
            </button>
            <button 
              onClick={() => {
                const bill = {
                  id: `B-${Date.now().toString().slice(-6)}`,
                  patient: selectedPatient?.name,
                  type: 'IPD',
                  date: new Date().toLocaleDateString('en-IN'),
                  items: charges.length,
                  amount: netTotal,
                  status: 'Completed',
                  payment: 'Cash'
                };
                saveBill(bill);
                window.focus();
                window.print();
              }}
              className="px-4 py-2 bg-brand-primary text-white rounded-xl text-xs font-bold shadow-lg shadow-brand-primary/20 flex items-center gap-2 active:scale-95 transition-transform hover:bg-brand-secondary"
            >
              <ICONS.Billing size={14} />
              Print Final Bill
            </button>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600">
              <ICONS.Plus className="rotate-45" size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-12 print:p-0 print-content print:overflow-visible">
          <div className="w-full max-w-[800px] mx-auto bg-white min-h-[1000px] flex flex-col items-center print:min-h-0">
            
            {/* Hospital Header */}
            <div className="w-full text-center py-6 border-b-2 border-brand-primary mb-8 px-8">
               <h1 className="text-3xl font-black text-brand-primary tracking-tight">Anand Hospital and Eye Care Center</h1>
               <p className="text-sm font-bold text-slate-600 mt-1">Near New Maruti showroom Bansi Road Bargadwa, Basti UP - 272002</p>
               <p className="text-xs font-medium text-slate-400">Phone: +91 7015022218 | Email: info@anand.com</p>
               <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">Bill Report Generated: {new Date().toLocaleString('en-IN')}</p>
            </div>

            {/* Patient Info Card */}
            <div className="w-full px-8 mb-8">
               <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6">
                  <h2 className="text-sm font-black text-brand-primary uppercase tracking-widest mb-6 border-b border-brand-primary/10 pb-2">Patient Information</h2>
                  <div className="grid grid-cols-2 gap-y-4 gap-x-12">
                     {[
                        { label: 'Patient Name', value: selectedPatient?.name },
                        { label: 'Father Name', value: selectedPatient?.fatherName || 'NA' },
                        { label: 'Patient ID', value: `PAT-00${selectedPatient?.id}` },
                        { label: 'Consultant Doctor', value: 'DR ALOK SHARMA' },
                        { label: 'Admission Date', value: formatDate(selectedPatient?.date) },
                        { label: 'Discharge Date', value: formatDate(new Date()) },
                        { label: 'Mobile Number', value: selectedPatient?.mobile || 'NA' }
                     ].map((item, i) => (
                        <div key={i}>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{item.label}</p>
                           <p className="text-sm font-black text-slate-800 uppercase print:text-xs">{item.value}</p>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            {/* Bed Charges Section */}
            <div className="w-full px-8 mb-8">
               <div className="overflow-hidden border border-brand-primary/20 rounded-2xl">
                  <div className="bg-brand-primary/10 px-6 py-3 flex justify-between items-center">
                     <h3 className="text-sm font-black text-brand-primary uppercase tracking-widest">Bed Charges</h3>
                  </div>
                  <table className="w-full text-xs">
                     <thead className="bg-brand-primary text-white">
                        <tr>
                           <th className="px-4 py-2 text-left">Bed Type</th>
                           <th className="px-4 py-2">From Date</th>
                           <th className="px-4 py-2">To Date</th>
                           <th className="px-4 py-2">Days</th>
                           <th className="px-4 py-2 text-right">Charge/Day</th>
                           <th className="px-4 py-2 text-right">Total</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                        {charges.filter(c => c.category === 'Bed Charges').map((c, i) => (
                           <tr key={c.id}>
                              <td className="px-4 py-3 font-bold text-slate-700">{c.name}</td>
                              <td className="px-4 py-3 text-center">{formatDate(c.from)}</td>
                              <td className="px-4 py-3 text-center">{formatDate(c.to)}</td>
                              <td className="px-4 py-3 text-center">{c.days}</td>
                              <td className="px-4 py-3 text-right">₹ {c.rate.toFixed(2)}</td>
                              <td className="px-4 py-3 text-right font-bold flex items-center justify-end gap-2">
                                 <span>₹ {c.total.toFixed(2)}</span>
                                 <button onClick={() => removeItem(c.id)} className="p-1 text-red-400 hover:text-red-600 print:hidden">
                                  <ICONS.Plus className="rotate-45" size={14} />
                                 </button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>

            {/* Consultant Charges Section */}
            <div className="w-full px-8 mb-8">
               <div className="overflow-hidden border border-red-200 rounded-2xl">
                  <div className="bg-red-50 px-6 py-3">
                     <h3 className="text-sm font-black text-red-700 uppercase tracking-widest text-center">Consultant Register</h3>
                  </div>
                  <p className="text-[10px] font-black text-red-500 uppercase p-3 border-b border-red-100">Consultant Charges</p>
                  <table className="w-full text-[10px]">
                     <thead className="bg-green-500 text-white">
                        <tr>
                           <th className="px-4 py-2 text-left">Applied Date</th>
                           <th className="px-4 py-2 text-left">Consultant Date</th>
                           <th className="px-4 py-2 text-left">Consultant Doctor</th>
                           <th className="px-4 py-2 text-left">Referrer Doctor</th>
                           <th className="px-4 py-2 text-right">Charges (₹)</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-red-50">
                        {charges.filter(c => c.category === 'Consultant Charges').map((c, i) => (
                           <tr key={c.id}>
                              <td className="px-4 py-3">{formatDate(c.date)}</td>
                              <td className="px-4 py-3">ST01</td>
                              <td className="px-4 py-3 font-bold">{c.doctor}</td>
                              <td className="px-4 py-3">{c.referrer}</td>
                              <td className="px-4 py-3 text-right font-black flex items-center justify-end gap-2">
                                 <span>₹ {c.total.toFixed(2)}</span>
                                 <button onClick={() => removeItem(c.id)} className="p-1 text-red-400 hover:text-red-600 print:hidden">
                                  <ICONS.Plus className="rotate-45" size={14} />
                                 </button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                     <tfoot className="bg-red-200">
                        <tr>
                           <td colSpan={4} className="px-4 py-2 text-right font-black uppercase text-[10px]">Grand Total</td>
                           <td className="px-4 py-2 text-right font-black">₹ {charges.filter(c => c.category === 'Consultant Charges').reduce((sum, item) => sum + item.total, 0).toFixed(2)}</td>
                        </tr>
                     </tfoot>
                  </table>
               </div>
            </div>

            {/* Pharmacy Bill Section */}
            <div className="w-full px-8 mb-8">
               <div className="overflow-hidden border border-blue-200 rounded-2xl">
                  <div className="bg-blue-50 px-6 py-3 flex justify-between items-center border-b border-blue-200">
                     <h3 className="text-sm font-black text-blue-800 uppercase tracking-widest mx-auto">Pharmacy Bill Details</h3>
                  </div>
                  <table className="w-full text-[10px]">
                     <thead className="bg-blue-600 text-white">
                        <tr>
                           <th className="px-4 py-2 text-left">Date</th>
                           <th className="px-4 py-2 text-left">Description</th>
                           <th className="px-4 py-2 text-right">Items</th>
                           <th className="px-4 py-2 text-right">Amount</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-blue-50">
                        {charges.filter(c => c.category === 'Pharmacy Bill').map((c) => (
                           <tr key={c.id}>
                              <td className="px-4 py-3">{formatDate(c.date)}</td>
                              <td className="px-4 py-3 font-bold text-slate-700">{c.name}</td>
                              <td className="px-4 py-3 text-right">{c.qty}</td>
                              <td className="px-4 py-3 text-right font-black text-blue-800 tabular-nums flex items-center justify-end gap-2">
                                 <span>₹ {c.total.toFixed(2)}</span>
                                 <button onClick={() => removeItem(c.id)} className="p-1 px-2 bg-red-50 text-red-500 rounded hover:bg-red-100 print:hidden font-bold">✕</button>
                              </td>
                           </tr>
                        ))}
                        {charges.filter(c => c.category === 'Pharmacy Bill').length === 0 && (
                          <tr><td colSpan={4} className="p-8 text-center text-slate-300 italic">No pharmacy charges added</td></tr>
                        )}
                     </tbody>
                     <tfoot className="bg-blue-50">
                        <tr>
                           <td colSpan={3} className="px-4 py-2 text-right font-black uppercase text-[10px]">Pharmacy Total</td>
                           <td className="px-4 py-2 text-right font-black">₹ {charges.filter(c => c.category === 'Pharmacy Bill').reduce((sum, item) => sum + item.total, 0).toFixed(2)}</td>
                        </tr>
                     </tfoot>
                  </table>
               </div>
            </div>

            {/* Investigation Charges Section */}
            <div className="w-full px-8 mb-8">
               <div className="overflow-hidden border border-emerald-200 rounded-2xl">
                  <div className="bg-emerald-50 px-6 py-3 flex justify-between items-center border-b border-emerald-200">
                     <h3 className="text-sm font-black text-emerald-800 uppercase tracking-widest mx-auto">Lab / Investigation Details</h3>
                  </div>
                  <table className="w-full text-[10px]">
                     <thead className="bg-emerald-600 text-white">
                        <tr>
                           <th className="px-4 py-2 text-left">Date</th>
                           <th className="px-4 py-2 text-left">Test Name</th>
                           <th className="px-4 py-2 text-right">Qty</th>
                           <th className="px-4 py-2 text-right">Amount</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-emerald-50">
                        {charges.filter(c => c.category === 'Investigation Charges').map((c) => (
                           <tr key={c.id}>
                              <td className="px-4 py-3">{formatDate(c.date)}</td>
                              <td className="px-4 py-3 font-bold text-slate-700">{c.name}</td>
                              <td className="px-4 py-3 text-right">{c.qty}</td>
                              <td className="px-4 py-3 text-right font-black text-emerald-800 tabular-nums flex items-center justify-end gap-2">
                                 <span>₹ {c.total.toFixed(2)}</span>
                                 <button onClick={() => removeItem(c.id)} className="p-1 px-2 bg-red-50 text-red-500 rounded hover:bg-red-100 print:hidden font-bold">✕</button>
                              </td>
                           </tr>
                        ))}
                        {charges.filter(c => c.category === 'Investigation Charges').length === 0 && (
                          <tr><td colSpan={4} className="p-8 text-center text-slate-300 italic">No investigations added</td></tr>
                        )}
                     </tbody>
                     <tfoot className="bg-emerald-50">
                        <tr>
                           <td colSpan={3} className="px-4 py-2 text-right font-black uppercase text-[10px]">Lab Total</td>
                           <td className="px-4 py-2 text-right font-black">₹ {charges.filter(c => c.category === 'Investigation Charges').reduce((sum, item) => sum + item.total, 0).toFixed(2)}</td>
                        </tr>
                     </tfoot>
                  </table>
               </div>
            </div>

            {/* OT Charges Section */}
            <div className="w-full px-8 mb-8">
               <div className="overflow-hidden border border-slate-200 rounded-2xl">
                  <div className="bg-slate-50 px-6 py-3 flex justify-between items-center border-b border-slate-200">
                     <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mx-auto">OT Billing Summary</h3>
                  </div>
                  <div className="p-3 bg-brand-primary/5 border-b border-slate-100">
                     <p className="text-[10px] font-black text-brand-primary uppercase">Operation Charges</p>
                  </div>
                  <table className="w-full text-[10px]">
                     <thead className="bg-brand-primary text-white">
                        <tr>
                           <th className="px-4 py-2 text-left">Date</th>
                           <th className="px-4 py-2 text-left">Operation Name</th>
                           <th className="px-4 py-2 text-left">Category</th>
                           <th className="px-4 py-2 text-left">OT Technician</th>
                           <th className="px-4 py-2 text-right">Amount</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                        {charges.filter(c => c.category === 'Operation Charges').map((c) => (
                           <tr key={c.id}>
                              <td className="px-4 py-3">{formatDate(c.date)}</td>
                              <td className="px-4 py-3 font-bold text-slate-700">{c.name}</td>
                              <td className="px-4 py-3 italic text-slate-400">Eye Surgery</td>
                              <td className="px-4 py-3 font-medium">{c.tech}</td>
                              <td className="px-4 py-3 text-right font-black text-slate-800 tabular-nums flex items-center justify-end gap-2">
                                 <span>₹ {c.total.toLocaleString()}</span>
                                 <button onClick={() => removeItem(c.id)} className="p-1 px-2 bg-red-50 text-red-500 rounded hover:bg-red-100 print:hidden font-bold">✕</button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                     <tfoot className="bg-slate-50 border-t border-slate-200">
                        <tr>
                           <td colSpan={4} className="px-4 py-2 text-right font-black uppercase text-[10px] tracking-widest text-slate-500">Grand Total</td>
                           <td className="px-4 py-2 text-right font-black text-brand-primary tabular-nums">₹ {charges.filter(c => c.category === 'Operation Charges').reduce((sum, item) => sum + item.total, 0).toFixed(2)}</td>
                        </tr>
                     </tfoot>
                  </table>
               </div>
            </div>

            {/* Final Summary Card */}
            <div className="w-full px-8 mb-12">
               <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-brand-primary">
                  <div className="bg-brand-primary p-4 flex items-center gap-3">
                     <ICONS.Billing className="text-white" size={24} />
                     <h3 className="text-lg font-black text-white uppercase tracking-tighter">Patient Billing Summary</h3>
                  </div>
                  <div className="bg-white">
                     {[
                        { label: 'Bed Charges', value: charges.filter(c => c.category === 'Bed Charges').reduce((s, i) => s + i.total, 0), icon: 'Dashboard' },
                        { label: 'Consultant Register', value: charges.filter(c => c.category === 'Consultant Charges').reduce((s, i) => s + i.total, 0), icon: 'Patients' },
                        { label: 'Pharmacy Bill', value: charges.filter(c => c.category === 'Pharmacy Bill').reduce((s, i) => s + i.total, 0), icon: 'Billing' },
                        { label: 'Lab/Investigations', value: charges.filter(c => c.category === 'Investigation Charges').reduce((s, i) => s + i.total, 0), icon: 'Search' },
                        { label: 'Operation Bill', value: charges.filter(c => c.category === 'Operation Charges').reduce((s, i) => s + i.total, 0), icon: 'Settings', color: 'text-orange-600' },
                     ].map((row, i) => {
                        const Icon = (ICONS as any)[row.icon] || ICONS.Check;
                        return (
                           <div key={i} className="flex justify-between items-center p-4 border-b border-slate-50">
                              <div className="flex items-center gap-4">
                                 <Icon size={16} className="text-slate-400" />
                                 <span className="text-sm font-bold text-slate-600">{row.label}</span>
                              </div>
                              <span className={`text-md font-mono font-black ${row.color || 'text-slate-800'}`}>{row.value.toFixed(2)}</span>
                           </div>
                        );
                     })}

                     <div className="p-6 bg-slate-50 print:hidden grid grid-cols-3 gap-6 border-b border-slate-200">
                        <div>
                           <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Discount (₹)</label>
                           <input 
                              type="number" 
                              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm font-bold focus:border-brand-primary outline-none transition-colors"
                              value={discount || ''}
                              onChange={e => setDiscount(Number(e.target.value))}
                              placeholder="0.00"
                           />
                        </div>
                        <div>
                           <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Round Off (+/- ₹)</label>
                           <input 
                              type="number" 
                              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm font-bold focus:border-brand-primary outline-none transition-colors"
                              value={roundOff || ''}
                              onChange={e => setRoundOff(Number(e.target.value))}
                              placeholder="0.00"
                           />
                        </div>
                        <div>
                           <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Refund (₹)</label>
                           <input 
                              type="number" 
                              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm font-bold focus:border-brand-primary outline-none transition-colors"
                              value={refund || ''}
                              onChange={e => setRefund(Number(e.target.value))}
                              placeholder="0.00"
                           />
                        </div>
                     </div>

                      <div className="flex items-center justify-between gap-4">
                        <span className="text-sm text-slate-500 font-medium">Refund / Advance</span>
                        <input 
                           type="number" 
                           value={refund || ''}
                           onChange={e => setRefund(Number(e.target.value))}
                           placeholder="0.00"
                           className="w-20 bg-white border border-slate-200 rounded-lg px-2 py-1 text-right text-sm font-bold no-spinner" 
                        />
                     </div>

                     {(discount > 0 || roundOff !== 0 || refund > 0) && (
                        <div className="bg-slate-50/50">
                           {discount > 0 && (
                              <div className="flex justify-between items-center p-3 border-b border-white">
                                 <span className="text-[10px] font-bold text-slate-400 uppercase ml-4">Discount Applied (-)</span>
                                 <span className="text-sm font-mono font-black text-red-500 mr-4">-₹ {discount.toFixed(2)}</span>
                              </div>
                           )}
                           {roundOff !== 0 && (
                              <div className="flex justify-between items-center p-3 border-b border-white">
                                 <span className="text-[10px] font-bold text-slate-400 uppercase ml-4">Round Off ({roundOff > 0 ? '+' : '-'})</span>
                                 <span className={`text-sm font-mono font-black mr-4 ${roundOff > 0 ? 'text-green-600' : 'text-red-500'}`}>{roundOff > 0 ? '+' : '-'}₹ {Math.abs(roundOff).toFixed(2)}</span>
                              </div>
                           )}
                           {refund > 0 && (
                              <div className="flex justify-between items-center p-3 border-b border-white">
                                 <span className="text-[10px] font-bold text-slate-400 uppercase ml-4">Refund / Advance (-)</span>
                                 <span className="text-sm font-mono font-black text-orange-600 mr-4">-₹ {refund.toFixed(2)}</span>
                              </div>
                           )}
                        </div>
                     )}

                     <div className="bg-brand-primary p-6 flex justify-between items-center">
                        <div className="flex items-center gap-4 text-white">
                           <ICONS.Check size={24} />
                           <div>
                              <span className="text-xl font-black uppercase tracking-tighter block">Net Payable</span>
                              <span className="text-[10px] font-bold opacity-70">Incl. Tax & Adjustments</span>
                           </div>
                        </div>
                        <span className="text-3xl font-black text-white italic tabular-nums">₹ {netTotal.toFixed(2)}</span>
                     </div>
                  </div>
               </div>
            </div>

            {/* Footer Disclaimer */}
            <div className="w-full px-8 border-t border-slate-100 pt-6 pb-12 flex justify-between items-end">
               <div className="max-w-xs">
                  <p className="text-[10px] font-bold text-slate-400 uppercase leading-relaxed italic">
                     * This is a computer-generated summary for internal billing auditing. Please verify details before final discharge signature.
                  </p>
               </div>
               <div className="text-right">
                  <div className="w-48 border-b-2 border-slate-200 mt-12 mb-2"></div>
                  <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Authorized Signatory</p>
               </div>
            </div>

          </div>
        </div>

        {/* Add Item Modal */}
        <AnimatePresence>
          {showAddItem && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[300] flex items-center justify-center p-8"
            >
              <motion.div 
                initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-8"
              >
                <h3 className="text-lg font-bold text-slate-800 mb-6">Add Bill Charge</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Category</label>
                    <select 
                      className="w-full bg-slate-50 rounded-xl p-3 text-sm border border-slate-200"
                      value={newItem.category}
                      onChange={e => setNewItem({...newItem, category: e.target.value})}
                    >
                      <option>Bed Charges</option>
                      <option>Consultant Charges</option>
                      <option>Pharmacy Bill</option>
                      <option>Investigation Charges</option>
                      <option>Operation Charges</option>
                    </select>
                  </div>
                  
                  {newItem.category === 'Bed Charges' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Bed Type</label>
                        <select 
                          className="w-full bg-slate-50 rounded-xl p-3 text-sm border border-slate-200"
                          value={newItem.name}
                          onChange={e => setNewItem({...newItem, name: e.target.value})}
                        >
                          <option value="">Select Bed Type</option>
                          <option>General Ward</option>
                          <option>Semi-Private</option>
                          <option>Private AC</option>
                          <option>ICU / NICU</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Days</label>
                          <input type="number" value={newItem.days} onChange={e => setNewItem({...newItem, days: Number(e.target.value)})} className="w-full bg-slate-50 rounded-xl p-3 text-sm border border-slate-200" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Rate / Day</label>
                          <input type="number" value={newItem.rate} onChange={e => setNewItem({...newItem, rate: Number(e.target.value)})} className="w-full bg-slate-50 rounded-xl p-3 text-sm border border-slate-200" />
                        </div>
                      </div>
                    </div>
                  )}

                  {newItem.category === 'Consultant Charges' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Doctor</label>
                        <input value={newItem.doctor} onChange={e => setNewItem({...newItem, doctor: e.target.value})} className="w-full bg-slate-50 rounded-xl p-3 text-sm border border-slate-200" placeholder="Doctor Name" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Charge (₹)</label>
                        <input type="number" value={newItem.rate} onChange={e => setNewItem({...newItem, rate: Number(e.target.value)})} className="w-full bg-slate-50 rounded-xl p-3 text-sm border border-slate-200" />
                      </div>
                    </div>
                  )}

                  {(newItem.category === 'Operation Charges' || newItem.category === 'Pharmacy Bill' || newItem.category === 'Investigation Charges') && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Item/Service Name</label>
                        <input 
                          className="w-full bg-slate-50 rounded-xl p-3 text-sm border border-slate-200"
                          placeholder={newItem.category === 'Pharmacy Bill' ? "Medicine Total" : newItem.category === 'Investigation Charges' ? "e.g. Lab Test" : "e.g. Lens / OT Charge"}
                          value={newItem.name}
                          onChange={e => setNewItem({...newItem, name: e.target.value})}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Rate (₹)</label>
                          <input 
                            type="number"
                            className="w-full bg-slate-50 rounded-xl p-3 text-sm border border-slate-200"
                            value={newItem.rate}
                            onChange={e => setNewItem({...newItem, rate: Number(e.target.value)})}
                          />
                        </div>
                        {newItem.category === 'Operation Charges' ? (
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Technician</label>
                            <input value={newItem.tech} onChange={e => setNewItem({...newItem, tech: e.target.value})} className="w-full bg-slate-50 rounded-xl p-3 text-sm border border-slate-200" />
                          </div>
                        ) : (
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Qty</label>
                            <input type="number" value={newItem.qty} onChange={e => setNewItem({...newItem, qty: Number(e.target.value)})} className="w-full bg-slate-50 rounded-xl p-3 text-sm border border-slate-200" />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex gap-3 mt-8">
                  <button onClick={() => setShowAddItem(false)} className="flex-1 py-3 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50">Cancel</button>
                  <button onClick={addCharge} className="flex-1 py-3 bg-brand-primary text-white rounded-xl text-xs font-bold shadow-lg shadow-brand-primary/20">Add to Bill</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </motion.div>
  );
}
