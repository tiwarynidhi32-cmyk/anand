import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ICONS } from '../constants';
import { motion, AnimatePresence } from 'motion/react';
import { ManualBillingModal } from '../components/ManualBillingModal';
import { getBills, getPharmacySales } from '../lib/store';

export default function Billing() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showManualBill, setShowManualBill] = useState(false);

  const tabs = [
    { name: 'OPD Billing', path: 'opd-billing', icon: 'Billing' },
    { name: 'IPD Billing', path: 'ipd-billing', icon: 'Patients' },
    { name: 'Pharmacy/Optical', path: 'pharmacy/optical', icon: 'Dashboard' },
    { name: 'Accounts', path: 'ledgers', icon: 'Reports' },
    { name: 'Sales Register', path: 'register', icon: 'Billing' },
  ];

  const currentTab = tabs.find(t => location.pathname.includes(t.path))?.path || 'opd-billing';

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 font-display">Centralized Billing System</h1>
          <p className="text-sm text-slate-500">Manage all hospital revenues, patient accounts, and financials</p>
        </div>
        <div className="flex flex-wrap gap-2 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
          {tabs.map((tab) => {
            const Icon = ICONS[tab.icon as keyof typeof ICONS] || ICONS.Dashboard;
            return (
              <button
                key={tab.path}
                onClick={() => navigate(`/billing/${tab.path}`)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  currentTab === tab.path ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <Icon size={14} />
                {tab.name}
              </button>
            );
          })}
        </div>
      </div>

      <div key={location.pathname} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[600px]">
        <Routes>
          <Route index element={<BillEntry />} />
          <Route path="opd-billing" element={<BillEntry />} />
          <Route path="ipd-billing" element={<BillEntry onShowManual={() => setShowManualBill(true)} />} />
          <Route path="pharmacy/optical" element={<PharmacyReport />} />
          <Route path="ledgers" element={<PatientLedger />} />
          <Route path="register" element={<SalesRegister />} />
          <Route path="accounts" element={<BookOfAccounts />} />
        </Routes>
      </div>

      <AnimatePresence>
        {showManualBill && (
          <ManualBillingModal onClose={() => setShowManualBill(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function BillEntry({ onShowManual }: { onShowManual?: () => void }) {
  const [items, setItems] = useState<any[]>([]);
  const [discountType, setDiscountType] = useState<'amt' | 'pct'>('amt');
  const [discountValue, setDiscountValue] = useState(0);
  const [refundValue, setRefundValue] = useState(0);
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showPharmacyModal, setShowPharmacyModal] = useState(false);

  const clearAll = () => {
    setItems([]);
    setDiscountValue(0);
    setRefundValue(0);
  };

  const HOSPITAL_SERVICES = [
    { id: 'S1', desc: 'Cataract Surgery (Phaco)', rate: 25000 },
    { id: 'S2', desc: 'Glaucoma Screening', rate: 1200 },
    { id: 'S3', desc: 'Retinal Examination', rate: 1500 },
    { id: 'S4', desc: 'IOP Measurement', rate: 300 },
    { id: 'S5', desc: 'A-Scan Biometry', rate: 800 },
  ];

  const PENDING_PHARMACY = [
    { id: 'PH1', batch: 'B-902', name: 'Moxikind-CV 625', qty: 1, rate: 120 },
    { id: 'PH2', batch: 'B-112', name: 'Refresh Tears Drops', qty: 2, rate: 240 },
    { id: 'PH3', batch: 'B-741', name: 'Prednisolone Eye Drops', qty: 1, rate: 150 },
  ];

  const addItem = (desc: string, rate: number, qty: number = 1) => {
    const newItem = {
      id: Math.random().toString(36).substr(2, 9),
      desc,
      qty,
      rate,
      amount: rate * qty,
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const discountAmount = discountType === 'pct' ? (subtotal * discountValue) / 100 : discountValue;
  const taxable = subtotal - discountAmount - refundValue;
  const rounding = Math.round(taxable) - taxable;
  const total = Math.max(0, Math.round(taxable));

  return (
    <div className="grid grid-cols-12 h-full min-h-[600px] relative">
      <div className="col-span-8 p-8 border-r border-slate-100">
        <div className="flex items-center justify-between mb-8">
           <h3 className="font-bold text-slate-800 uppercase text-xs tracking-widest">New Bill Generation</h3>
           <div className="flex gap-2">
              <button 
                onClick={clearAll}
                className="px-3 py-1.5 border border-red-200 text-red-500 rounded-lg text-[10px] font-bold hover:bg-red-50 active:scale-95 transition-all"
              >
                Clear All
              </button>
              {onShowManual && (
                <button 
                  onClick={onShowManual}
                  className="px-4 py-2 bg-orange-500 text-white rounded-xl text-[10px] font-bold shadow-lg shadow-orange-500/20 hover:scale-105 transition-all flex items-center gap-2"
                >
                  <ICONS.Reports size={12} />
                  Comprehensive Manual Bill
                </button>
              )}
              <select className="bg-slate-50 border-none rounded-lg px-3 py-1.5 text-xs font-bold text-slate-600 outline-none border border-slate-200">
                <option>OPD Patient</option>
                <option>IPD Patient</option>
              </select>
           </div>
        </div>

        <div className="space-y-4 mb-8">
           <div className="relative">
              <ICONS.Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                className="w-full bg-slate-50 rounded-xl py-3 pl-10 pr-4 text-sm border-2 border-transparent focus:border-brand-primary/10 outline-none transition-all" 
                placeholder="Search patient by Name, ID or IPD No..." 
              />
           </div>
        </div>

        <div className="space-y-2">
           <div className="grid grid-cols-12 px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <div className="col-span-1 border-r border-transparent"></div>
              <div className="col-span-5">Description</div>
              <div className="col-span-2 text-center">Qty</div>
              <div className="col-span-2 text-right">Rate</div>
              <div className="col-span-2 text-right">Amount</div>
           </div>
           
           <div className="space-y-1">
              {items.map(item => (
                <div key={item.id} className="grid grid-cols-12 px-4 py-3 bg-slate-50 rounded-xl items-center text-sm group">
                   <div className="col-span-1">
                     <button onClick={() => removeItem(item.id)} className="p-1 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                       <ICONS.Plus size={14} className="rotate-45" />
                     </button>
                   </div>
                   <div className="col-span-5 font-bold text-slate-700">{item.desc}</div>
                   <div className="col-span-2 text-center text-slate-500 font-mono">{item.qty}</div>
                   <div className="col-span-2 text-right text-slate-500 font-mono">₹{item.rate.toFixed(2)}</div>
                   <div className="col-span-2 text-right font-black text-slate-800">₹{item.amount.toFixed(2)}</div>
                </div>
              ))}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <button 
                  onClick={() => setShowServiceModal(true)}
                  className="py-4 border-2 border-dashed border-slate-200 rounded-2xl text-xs font-bold text-slate-400 hover:border-brand-primary hover:text-brand-primary transition-all flex items-center justify-center gap-2"
                >
                   <ICONS.Plus size={14} /> Add Hospital Service
                </button>
                <button 
                  onClick={() => setShowPharmacyModal(true)}
                  className="py-4 border-2 border-dashed border-slate-200 rounded-2xl text-xs font-bold text-slate-400 hover:border-brand-primary hover:text-brand-primary transition-all flex items-center justify-center gap-2"
                >
                   <ICONS.Settings size={14} /> Pull Pharmacy Items
                </button>
              </div>
           </div>
        </div>
      </div>

      {/* Side Summary */}
      <div className="col-span-4 bg-slate-50/50 p-8 flex flex-col">
         {/* ... (Existing summary section remains unchanged) */}
         <h3 className="font-bold text-slate-800 uppercase text-xs tracking-widest mb-6">Summary & Payment</h3>
         
         <div className="space-y-4 flex-1">
            <div className="space-y-2">
               <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">Subtotal</span>
                  <span className="font-bold text-slate-700">₹{subtotal.toFixed(2)}</span>
               </div>
               
               <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500 font-medium">Discount</span>
                    <div className="flex bg-white rounded-lg border border-slate-200 p-0.5">
                       <button onClick={() => setDiscountType('amt')} className={`px-2 py-0.5 text-[9px] font-bold rounded ${discountType === 'amt' ? 'bg-brand-primary text-white' : 'text-slate-400'}`}>₹</button>
                       <button onClick={() => setDiscountType('pct')} className={`px-2 py-0.5 text-[9px] font-bold rounded ${discountType === 'pct' ? 'bg-brand-primary text-white' : 'text-slate-400'}`}>%</button>
                    </div>
                  </div>
                  <input 
                    type="number" 
                    value={discountValue || ''}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-20 bg-white border border-slate-200 rounded-lg px-2 py-1 text-right text-sm font-bold no-spinner" 
                  />
               </div>

               <div className="flex items-center justify-between gap-4 pb-2 border-b border-slate-100">
                  <span className="text-sm text-slate-500 font-medium">Refund / Advance</span>
                  <input 
                    type="number" 
                    value={refundValue || ''}
                    onChange={(e) => setRefundValue(Number(e.target.value))}
                    className="w-20 bg-white border border-slate-200 rounded-lg px-2 py-1 text-right text-sm font-bold no-spinner" 
                  />
               </div>

               <div className="flex justify-between text-sm items-center pt-2 border-t border-slate-200">
                  <span className="text-slate-400 text-xs italic">Rounding</span>
                  <span className="text-xs font-mono text-slate-400">{(rounding >= 0 ? '+' : '') + rounding.toFixed(2)}</span>
               </div>
            </div>

            <div className="p-6 bg-brand-primary rounded-2xl text-white shadow-xl shadow-brand-primary/20">
               <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">Total Amount Payable</p>
               <p className="text-4xl font-black tracking-tighter">₹ {total.toLocaleString('en-IN')}.00</p>
            </div>

            <div className="space-y-4 pt-6">
               <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Payment Mode</label>
                  <div className="grid grid-cols-3 gap-2">
                     {['Cash', 'Bank', 'Card'].map(mode => (
                        <button 
                          key={mode} 
                          onClick={() => setPaymentMode(mode)}
                          className={`py-2.5 rounded-xl border text-[10px] font-bold transition-all ${
                            paymentMode === mode ? 'bg-white border-brand-primary text-brand-primary shadow-sm' : 'bg-transparent border-slate-200 text-slate-400'
                          }`}
                        >
                           {mode === 'Bank' ? 'UPI/Online' : mode}
                        </button>
                     ))}
                  </div>
               </div>

               {paymentMode !== 'Cash' && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                     <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Trans. ID / Ref No.</label>
                     <input className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm font-mono" placeholder="TXN1234567890" />
                  </motion.div>
               )}
            </div>
         </div>

          <button 
            onClick={() => {
              window.focus();
              window.print();
            }}
            className="w-full py-4 bg-brand-primary text-white rounded-2xl font-bold font-display shadow-xl shadow-brand-primary/30 mt-8 hover:scale-[1.02] active:scale-100 transition-all active:bg-brand-secondary"
          >
            Generate Final Invoice & Print
          </button>
      </div>

      {/* Service Selection Modal */}
      <AnimatePresence>
        {showServiceModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-8"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-800">Add Hospital Service</h3>
                <button onClick={() => setShowServiceModal(false)} className="text-slate-400 hover:text-slate-600">
                  <ICONS.Plus className="rotate-45" size={20} />
                </button>
              </div>
              <div className="p-4 max-h-[400px] overflow-y-auto space-y-2">
                {HOSPITAL_SERVICES.map(service => (
                  <button 
                    key={service.id}
                    onClick={() => { addItem(service.desc, service.rate); setShowServiceModal(false); }}
                    className="w-full text-left p-4 rounded-2xl border border-slate-100 hover:border-brand-primary hover:bg-brand-primary/5 transition-all group"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-slate-700 group-hover:text-brand-primary">{service.desc}</span>
                      <span className="text-sm font-black text-slate-800 font-mono">₹{service.rate}</span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pharmacy Pull Modal */}
      <AnimatePresence>
        {showPharmacyModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-8"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-800">Pull Pending Pharmacy Items</h3>
                <button onClick={() => setShowPharmacyModal(false)} className="text-slate-400 hover:text-slate-600">
                  <ICONS.Plus className="rotate-45" size={20} />
                </button>
              </div>
              <div className="p-4 max-h-[400px] overflow-y-auto space-y-2">
                {PENDING_PHARMACY.map(item => (
                  <button 
                    key={item.id}
                    onClick={() => { addItem(item.name, item.rate, item.qty); setShowPharmacyModal(false); }}
                    className="w-full text-left p-4 rounded-2xl border border-slate-100 hover:border-brand-primary hover:bg-brand-primary/5 transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="block text-sm font-bold text-slate-700">{item.name}</span>
                        <span className="text-[10px] text-slate-400 uppercase font-bold">Qty: {item.qty} • Batch: {item.batch}</span>
                      </div>
                      <span className="text-sm font-black text-slate-800 font-mono">₹{item.rate * item.qty}</span>
                    </div>
                  </button>
                ))}
                {PENDING_PHARMACY.length === 0 && (
                  <div className="p-8 text-center text-slate-400 italic text-sm">No pending items found for this patient</div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PatientLedger() {
  return (
    <div className="p-8">
       <div className="flex items-center justify-between mb-8">
          <h3 className="font-bold text-slate-800">Financial Data: Patient Accounts</h3>
          <div className="flex gap-2">
             <input className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs" placeholder="Search accounts..." />
          </div>
       </div>

       <div className="border border-slate-100 rounded-3xl overflow-hidden">
          <table className="w-full text-left">
             <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                   <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Patient Details</th>
                   <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Type</th>
                   <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Billed</th>
                   <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Paid</th>
                   <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Outstanding</th>
                   <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-50">
                {[
                  { name: 'Girish Kumar', id: 'P0102', type: 'IPD', billed: 45000, paid: 40000, status: 'Active' },
                  { name: 'Shanti Devi', id: 'P0145', type: 'OPD', billed: 1200, paid: 1200, status: 'Cleared' },
                  { name: 'Rahul Mehra', id: 'P0298', type: 'IPD', billed: 18500, paid: 5000, status: 'Due' },
                ].map((ledger, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors cursor-pointer group">
                     <td className="px-6 py-4">
                        <p className="text-sm font-bold text-slate-700">{ledger.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">ID: {ledger.id}</p>
                     </td>
                     <td className="px-4 py-4"><span className="text-xs font-bold text-slate-500">{ledger.type}</span></td>
                     <td className="px-4 py-4 text-xs font-mono text-slate-600">₹{ledger.billed.toLocaleString()}</td>
                     <td className="px-4 py-4 text-xs font-mono text-green-600">₹{ledger.paid.toLocaleString()}</td>
                     <td className="px-4 py-4 text-xs font-mono text-red-500 font-bold">₹{(ledger.billed - ledger.paid).toLocaleString()}</td>
                     <td className="px-4 py-4">
                        <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-wider ${
                          ledger.status === 'Cleared' ? 'bg-green-100 text-green-700' : 
                          ledger.status === 'Active' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                        }`}>
                           {ledger.status}
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

function PharmacyReport() {
  const [sales, setSales] = useState(() => getPharmacySales());

  useEffect(() => {
    const handleStorage = () => setSales(getPharmacySales());
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const totalSales = sales.reduce((sum: number, s: any) => sum + s.total, 0);

  return (
    <div className="p-8">
       <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="font-bold text-slate-800">Pharmacy Revenue Sync</h3>
            <p className="text-xs text-slate-500">Live sales data compiled from Pharmacy module</p>
          </div>
          <div className="flex gap-4">
             <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Sales</p>
                <p className="text-xl font-black text-brand-primary">₹ {totalSales.toLocaleString('en-IN')}.00</p>
             </div>
          </div>
       </div>
       
       <div className="space-y-4">
          {sales.map((sale: any, i: number) => (
             <div key={i} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl group hover:border-brand-primary/20 transition-all">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 group-hover:bg-brand-primary group-hover:text-white transition-all">
                      <ICONS.Check size={20} />
                   </div>
                   <div>
                      <p className="text-sm font-bold text-slate-700">Bill #{sale.billNo}</p>
                      <p className="text-[10px] text-slate-400 uppercase">{sale.patient} • {sale.time}</p>
                   </div>
                </div>
                <div className="text-right">
                   <p className="text-sm font-black text-slate-800 italic">₹ {sale.total.toFixed(2)}</p>
                   <p className="text-[10px] font-bold text-green-600 uppercase">Synced</p>
                </div>
             </div>
          ))}
          {sales.length === 0 && (
            <div className="p-20 text-center text-slate-400 italic">No pharmacy transactions found</div>
          )}
       </div>
    </div>
  );
}

function SalesRegister() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [allSales, setAllSales] = useState(() => getBills());

  useEffect(() => {
    const handleStorage = () => setAllSales(getBills());
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const filteredSales = allSales.filter((s: any) => 
    (filterType === 'All' || s.type === filterType) &&
    (s.patient.toLowerCase().includes(searchTerm.toLowerCase()) || s.id.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <h3 className="font-bold text-slate-800">Hospital Consolidated Sales Register</h3>
          <p className="text-xs text-slate-500">Real-time revenue tracking across all hospital departments</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <select 
            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-600 outline-none"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option>All</option>
            <option>OPD</option>
            <option>IPD</option>
            <option>Pharmacy</option>
            <option>Optical</option>
          </select>
          <div className="relative">
            <ICONS.Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input 
              className="bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-xs w-56 outline-none" 
              placeholder="Search Bill No or Patient..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors">Download Excel</button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="p-6 bg-slate-800 rounded-3xl text-white">
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-1">Total Revenue (Today)</p>
          <p className="text-2xl font-black italic">₹ 55,404.00</p>
        </div>
        <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100">
          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">OPD/IPD Billing</p>
          <p className="text-2xl font-black text-blue-800">₹ 49,350.00</p>
        </div>
        <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Pharmacy Sales</p>
          <p className="text-2xl font-black text-emerald-800">₹ 454.00</p>
        </div>
        <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100">
          <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1">Optical Sales</p>
          <p className="text-2xl font-black text-amber-800">₹ 5,600.00</p>
        </div>
      </div>

      <div className="border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bill #</th>
              <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
              <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Patient</th>
              <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Department</th>
              <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Payment</th>
              <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Amount</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Print</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredSales.map((sale) => (
              <tr key={sale.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4 font-mono text-xs font-bold text-slate-500">{sale.id}</td>
                <td className="px-4 py-4 text-xs font-medium text-slate-400">{sale.date}</td>
                <td className="px-4 py-4">
                  <p className="text-sm font-bold text-slate-700">{sale.patient}</p>
                </td>
                <td className="px-4 py-4">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                    sale.type === 'IPD' ? 'bg-indigo-50 text-indigo-600' :
                    sale.type === 'OPD' ? 'bg-sky-50 text-sky-600' :
                    sale.type === 'Pharmacy' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    {sale.type}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-[10px] font-bold text-slate-500">{sale.payment}</span>
                </td>
                <td className="px-4 py-4 text-right">
                  <p className="text-sm font-black text-slate-800 italic">₹ {sale.amount.toLocaleString()}.00</p>
                </td>
                <td className="px-6 py-4 text-center">
                  <button className="p-2 text-slate-300 hover:text-brand-primary transition-colors">
                    <ICONS.Billing size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function BookOfAccounts() {
  return (
     <div className="p-8 flex flex-col h-full">
        <div className="grid grid-cols-3 gap-6 mb-10">
           <div className="p-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl text-white">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-50 mb-2">Total Receivables</p>
              <p className="text-3xl font-black tracking-tighter">₹ 1,42,800</p>
              <div className="mt-4 flex items-center gap-2 text-green-400 text-[10px] font-bold">
                 <ICONS.Plus size={12} /> 12% vs last month
              </div>
           </div>
           <div className="p-6 bg-white rounded-3xl border border-slate-200">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Total Collections</p>
              <p className="text-3xl font-black text-slate-800 tracking-tighter">₹ 85,240</p>
              <p className="mt-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Cash: 40k | Bank: 45k</p>
           </div>
           <div className="p-6 bg-white rounded-3xl border border-slate-200">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Outstanding Dues</p>
              <p className="text-3xl font-black text-red-500 tracking-tighter">₹ 57,560</p>
              <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                 <div className="h-full bg-red-400 w-1/3"></div>
              </div>
           </div>
        </div>

        <div className="flex-1 flex items-center justify-center text-center p-12 border-2 border-dashed border-slate-100 rounded-3xl">
           <div className="max-w-md">
              <ICONS.Billing className="mx-auto text-slate-200 mb-6" size={80} />
              <h3 className="text-xl font-bold text-slate-800">Financial Ledger Entry</h3>
              <p className="text-sm text-slate-500 mt-4 leading-relaxed">
                This central book of accounts tracks all hospital financial transitions. Audit logs are automatically synced from Billing, Pharmacy, and IPD advance payments.
              </p>
              <button className="mt-8 px-8 py-3 bg-brand-primary text-white rounded-xl font-bold text-sm shadow-xl shadow-brand-primary/20 hover:scale-105 transition-all">Generate P&L Statement</button>
           </div>
        </div>
     </div>
  );
}
