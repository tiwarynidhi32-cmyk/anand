import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ICONS } from '../constants';
import { motion, AnimatePresence } from 'motion/react';
import { getPharmacySales, savePharmacySale } from '../lib/store';

export default function Pharmacy() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { name: 'Sales Billing', path: 'sales-billing', icon: 'Billing' },
    { name: 'Inventory', path: 'inventory', icon: 'Dashboard' },
    { name: 'Purchase Entry', path: 'purchase', icon: 'Plus' },
    { name: 'Medicine Master', path: 'master', icon: 'Patients' },
    { name: 'Sales Register', path: 'register', icon: 'Reports' },
  ];

  const currentTab = tabs.find(t => location.pathname.includes(t.path))?.path || 'sales-billing';

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 font-display">Pharmacy Management</h1>
          <p className="text-sm text-slate-500">Retail sales, inventory tracking, and purchase management</p>
        </div>
        <div className="flex gap-2 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
          {tabs.map((tab) => {
            const Icon = ICONS[tab.icon as keyof typeof ICONS] || ICONS.Dashboard;
            return (
              <button
                key={tab.path}
                onClick={() => navigate(`/pharmacy/${tab.path}`)}
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

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[600px]">
        <Routes>
          <Route index element={<PharmacyBilling />} />
          <Route path="sales-billing" element={<PharmacyBilling />} />
          <Route path="inventory" element={<StockInventory />} />
          <Route path="purchase" element={<PurchaseEntry />} />
          <Route path="master" element={<MedicineMaster />} />
          <Route path="register" element={<SalesRegister />} />
        </Routes>
      </div>
    </div>
  );
}

function MedicineMaster() {
  const [medicines, setMedicines] = useState([
    { category: 'Tablet', product: 'Moxikind-CV 625', generic: 'Amoxicillin + Clavulanic Acid', hsn: '3004', boxSize: '10x10', unit: 'Strips' },
    { category: 'Drop', product: 'Refresh Tears', generic: 'Carboxymethylcellulose', hsn: '3004', boxSize: '1x1', unit: 'Bottle' },
    { category: 'Tablet', product: 'Predmet', generic: 'Prednisolone Acetate', hsn: '3004', boxSize: '10x10', unit: 'Strips' },
  ]);

  const [showAdd, setShowAdd] = useState(false);
  const [newMed, setNewMed] = useState({ category: '', product: '', generic: '', hsn: '', boxSize: '', unit: '' });

  const handleAdd = () => {
    if(!newMed.product) return;
    setMedicines([newMed, ...medicines]);
    setShowAdd(false);
    setNewMed({ category: '', product: '', generic: '', hsn: '', boxSize: '', unit: '' });
    alert('Medicine added to Master list successfully.');
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="font-bold text-slate-800">Medicine Master List</h3>
          <p className="text-xs text-slate-500">Manage your product catalog and HSN codes</p>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="px-6 py-2.5 bg-brand-primary text-white rounded-xl text-xs font-bold shadow-lg shadow-brand-primary/20 hover:scale-105 transition-all"
        >
          + Add New Product
        </button>
      </div>

      <div className="border border-slate-100 rounded-3xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Product Details</th>
              <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category</th>
              <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Generic (Salt)</th>
              <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Box/Unit</th>
              <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">HSN</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {medicines.map((med, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-slate-700 group-hover:text-brand-primary transition-colors">{med.product}</p>
                </td>
                <td className="px-4 py-4">
                  <span className="px-2 py-1 bg-slate-100 rounded text-[10px] font-bold text-slate-500 uppercase">{med.category}</span>
                </td>
                <td className="px-4 py-4 text-xs text-slate-500 italic">{med.generic}</td>
                <td className="px-4 py-4">
                  <p className="text-xs font-bold text-slate-600">{med.boxSize}</p>
                  <p className="text-[10px] text-slate-400">{med.unit}</p>
                </td>
                <td className="px-4 py-4 text-right font-mono text-xs text-slate-400">{med.hsn}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Medicine Modal */}
      <AnimatePresence>
        {showAdd && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-8"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-800">Add New Medicine to Master</h3>
                <button onClick={() => setShowAdd(false)} className="text-slate-400 hover:text-slate-600">
                  <ICONS.Plus className="rotate-45" size={20} />
                </button>
              </div>
              <div className="p-8 grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Product Name</label>
                  <input 
                    className="w-full bg-slate-50 rounded-xl p-3 text-sm focus:ring-2 focus:ring-brand-primary/10 border-none outline-none transition-all" 
                    placeholder="e.g. Moxikind-CV 625"
                    value={newMed.product}
                    onChange={e => setNewMed({...newMed, product: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Category</label>
                  <select 
                    className="w-full bg-slate-50 rounded-xl p-3 text-sm border-none outline-none"
                    value={newMed.category}
                    onChange={e => setNewMed({...newMed, category: e.target.value})}
                  >
                    <option value="">Select Category</option>
                    <option>Tablet</option>
                    <option>Capsule</option>
                    <option>Drop</option>
                    <option>Syrup</option>
                    <option>Injection</option>
                    <option>Ointment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">HSN Code</label>
                  <input 
                    className="w-full bg-slate-50 rounded-xl p-3 text-sm border-none outline-none" 
                    placeholder="3004"
                    value={newMed.hsn}
                    onChange={e => setNewMed({...newMed, hsn: e.target.value})}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Generic / Salt Name</label>
                  <input 
                    className="w-full bg-slate-50 rounded-xl p-3 text-sm border-none outline-none italic" 
                    placeholder="e.g. Amoxicillin + Clavulanic Acid"
                    value={newMed.generic}
                    onChange={e => setNewMed({...newMed, generic: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Box Size</label>
                  <input 
                    className="w-full bg-slate-50 rounded-xl p-3 text-sm border-none outline-none" 
                    placeholder="e.g. 10x10"
                    value={newMed.boxSize}
                    onChange={e => setNewMed({...newMed, boxSize: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Unit</label>
                  <input 
                    className="w-full bg-slate-50 rounded-xl p-3 text-sm border-none outline-none" 
                    placeholder="e.g. Strips / Bottle / Ml"
                    value={newMed.unit}
                    onChange={e => setNewMed({...newMed, unit: e.target.value})}
                  />
                </div>
              </div>
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
                <button 
                  onClick={() => setShowAdd(false)}
                  className="flex-1 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition-all font-display"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAdd}
                  className="flex-1 py-3 bg-brand-primary text-white rounded-xl text-xs font-bold shadow-lg shadow-brand-primary/20 hover:scale-105 transition-all font-display"
                >
                  Save Product to Master
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StockInventory() {
  const [searchTerm, setSearchTerm] = useState('');
  const inventory = [
    { name: 'Moxikind-CV 625', salt: 'Amoxicillin + Clavulanic Acid', stock: 450, batch: 'B-902', expiry: '2025-08', power: '625mg' },
    { name: 'Refresh Tears', salt: 'Carboxymethylcellulose', stock: 120, batch: 'B-112', expiry: '2026-11', power: '0.5%' },
    { name: 'Predmet', salt: 'Prednisolone Acetate', stock: 15, batch: 'B-741', expiry: '2024-05', power: '1%' },
    { name: 'Atropine Eye Ointment', salt: 'Atropine Sulfate', stock: 85, batch: 'B-220', expiry: '2025-12', power: '1%' },
  ];

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.salt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
         <div>
            <h3 className="font-bold text-slate-800">Pharmacy Inventory</h3>
            <p className="text-xs text-slate-500">Live stock levels across all medication categories</p>
         </div>
         <div className="flex gap-3">
            <button className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600">Download Low Stock Report</button>
            <div className="relative">
               <ICONS.Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
               <input 
                 className="bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-xs w-64 outline-none focus:border-brand-primary/20" 
                 placeholder="Search salt or medicine..." 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>
         </div>
      </div>

      <div className="border border-slate-100 rounded-3xl overflow-hidden">
         <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
               <tr>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Medicine Details</th>
                  <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Batch & Expiry</th>
                  <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Curr. Stock</th>
                  <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
               {filteredInventory.map((item, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                     <td className="px-6 py-4">
                        <p className="text-sm font-bold text-slate-700">{item.name} <span className="text-xs font-medium text-slate-400 ml-1">({item.power})</span></p>
                        <p className="text-[10px] text-slate-400 italic mt-0.5">{item.salt}</p>
                     </td>
                     <td className="px-4 py-4">
                        <p className="text-xs font-bold text-slate-600">{item.batch}</p>
                        <p className={`text-[10px] font-bold ${new Date(item.expiry) < new Date('2024-12') ? 'text-red-400' : 'text-slate-400'}`}>{item.expiry}</p>
                     </td>
                     <td className="px-4 py-4 text-sm font-black text-slate-700">{item.stock}</td>
                     <td className="px-4 py-4">
                        <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-wider ${
                           item.stock < 50 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                        }`}>
                           {item.stock < 50 ? 'Low Stock' : 'In Stock'}
                        </span>
                     </td>
                     <td className="px-4 py-4 text-right">
                        <button className="text-brand-primary text-xs font-bold hover:underline">Update Stock</button>
                     </td>
                  </tr>
               ))}
               {filteredInventory.length === 0 && (
                 <tr>
                    <td colSpan={5} className="px-6 py-20 text-center text-slate-400 italic">No medicine found matching your search</td>
                 </tr>
               )}
            </tbody>
         </table>
      </div>
    </div>
  );
}

function PurchaseEntry() {
  const [purchaseItems, setPurchaseItems] = useState([
    { id: '1', name: 'Refresh Tears Drops', hsn: '3004', batch: 'B-112', expiry: '2026-11', qty: 50, purRate: 140, total: 7000 },
  ]);
  const [showMasterList, setShowMasterList] = useState(false);

  const MASTER_MEDICINES = [
    { name: 'Moxikind-CV 625', power: '625mg', salt: 'Amoxicillin + Clavulanic Acid', hsn: '3004' },
    { name: 'Refresh Tears', power: '0.5%', salt: 'Carboxymethylcellulose', hsn: '3004' },
    { name: 'Predmet', power: '1%', salt: 'Prednisolone Acetate', hsn: '3004' },
    { name: 'Atropine Eye Ointment', power: '1%', salt: 'Atropine Sulfate', hsn: '3004' },
    { name: 'Ciplox D', power: '5ml', salt: 'Ciprofloxacin + Dexamethasone', hsn: '3004' },
    { name: 'Toba Eye Drops', power: '5ml', salt: 'Tobramycin', hsn: '3004' },
  ];

  const addItemToPurchase = (item: typeof MASTER_MEDICINES[0]) => {
    const newItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: item.name,
      hsn: item.hsn,
      batch: 'NEW-BATCH',
      expiry: '2026-01',
      qty: 1,
      purRate: 0,
      total: 0
    };
    setPurchaseItems([...purchaseItems, newItem]);
    setShowMasterList(false);
  };

  const removeItem = (id: string) => {
    setPurchaseItems(purchaseItems.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: string, value: any) => {
    setPurchaseItems(purchaseItems.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'qty' || field === 'purRate') {
          updated.total = (updated.qty || 0) * (updated.purRate || 0);
        }
        return updated;
      }
      return item;
    }));
  };

  const subtotal = purchaseItems.reduce((sum, item) => sum + item.total, 0);
  const gst = subtotal * 0.12;
  const netTotal = subtotal + gst;

  const handleSavePurchase = () => {
    alert('Purchase entry saved successfully and inventory updated.');
    setPurchaseItems([]);
  };

  return (
    <div className="grid grid-cols-12 min-h-[600px] relative">
       <div className="col-span-12 lg:col-span-9 p-8 border-r border-slate-100 overflow-y-auto">
          <div className="flex items-center justify-between mb-8">
             <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">New Purchase Entry (GRN)</h3>
             <div className="flex gap-4">
                <select className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-600">
                   <option>Select Vendor / Distributor</option>
                   <option>Universal Medico Labs</option>
                   <option>Global Eye Care Supplies</option>
                </select>
             </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-8">
             <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Invoice No</label>
                <input className="w-full bg-slate-50 rounded-xl p-3 text-sm font-mono border border-transparent focus:border-brand-primary/20" placeholder="PUR-XXXXX" />
             </div>
             <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Invoice Date</label>
                <input type="date" className="w-full bg-slate-50 rounded-xl p-3 text-sm border border-transparent focus:border-brand-primary/20" />
             </div>
             <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">GST Type</label>
                <select className="w-full bg-slate-50 rounded-xl p-3 text-sm border border-transparent focus:border-brand-primary/20">
                   <option>Local (SGST+CGST)</option>
                   <option>Interstate (IGST)</option>
                </select>
             </div>
          </div>

          <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
             <div className="grid grid-cols-12 gap-2 mb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <div className="col-span-4">Medicine Name</div>
                <div className="col-span-2">Batch/Exp</div>
                <div className="col-span-1 text-center">Qty</div>
                <div className="col-span-2 text-right">Pur. Rate</div>
                <div className="col-span-2 text-right">Total</div>
                <div className="col-span-1"></div>
             </div>

             <div className="space-y-2">
                {purchaseItems.map(item => (
                   <div key={item.id} className="grid grid-cols-12 gap-2 p-1 items-center">
                      <div className="col-span-4 italic">
                        <input 
                          className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold" 
                          value={item.name} 
                          onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                        />
                      </div>
                      <div className="col-span-2">
                        <div className="flex gap-1">
                          <input 
                            className="w-1/2 bg-white border border-slate-200 rounded-lg p-2 text-[10px] font-mono" 
                            value={item.batch} 
                            onChange={(e) => updateItem(item.id, 'batch', e.target.value)}
                          />
                          <input 
                            className="w-1/2 bg-white border border-slate-200 rounded-lg p-2 text-[10px] font-mono" 
                            value={item.expiry} 
                            onChange={(e) => updateItem(item.id, 'expiry', e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-span-1">
                         <input 
                           type="number" 
                           className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-center font-bold" 
                           value={item.qty} 
                           onChange={(e) => updateItem(item.id, 'qty', Number(e.target.value))}
                         />
                      </div>
                      <div className="col-span-2">
                         <input 
                           type="number" 
                           className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-right font-bold" 
                           value={item.purRate} 
                           onChange={(e) => updateItem(item.id, 'purRate', Number(e.target.value))}
                         />
                      </div>
                      <div className="col-span-2 text-right">
                         <p className="text-xs font-black text-slate-700 p-2">₹ {item.total.toFixed(2)}</p>
                      </div>
                      <div className="col-span-1 flex justify-center">
                         <button 
                           onClick={() => removeItem(item.id)}
                           className="text-slate-300 hover:text-red-500"
                         >
                           <ICONS.Plus size={14} className="rotate-45" />
                         </button>
                      </div>
                   </div>
                ))}
                <button 
                  onClick={() => setShowMasterList(true)}
                  className="w-full py-3 mt-4 border-2 border-dashed border-slate-200 rounded-2xl text-[10px] font-black uppercase text-slate-400 hover:border-brand-primary hover:text-brand-primary transition-all"
                >
                   + Add Item from Master List
                </button>
             </div>
          </div>
       </div>

       <div className="col-span-12 lg:col-span-3 bg-slate-50/50 p-8 flex flex-col">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Purchase Summary</h3>
          <div className="space-y-4 flex-1">
             <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Breakup</div>
                <div className="space-y-3">
                   <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Taxable Amt</span>
                      <span className="font-bold text-slate-700">₹{subtotal.toFixed(2)}</span>
                   </div>
                   <div className="flex justify-between text-sm">
                      <span className="text-slate-500">GST (12%)</span>
                      <span className="font-bold text-slate-700">₹{gst.toFixed(2)}</span>
                   </div>
                   <div className="pt-3 border-t border-slate-100 flex justify-between">
                      <span className="font-bold text-slate-800">Net Total</span>
                      <span className="font-black text-brand-primary">₹{netTotal.toFixed(2)}</span>
                   </div>
                </div>
             </div>
          </div>

          <button 
            onClick={handleSavePurchase}
            className="w-full py-4 bg-brand-primary text-white rounded-2xl font-bold shadow-xl shadow-brand-primary/20 hover:scale-[1.02] active:scale-100 transition-all"
          >
             Save Purchase (Inward)
          </button>
          <p className="text-[9px] text-center text-slate-400 font-bold uppercase mt-4 tracking-widest">Inventory will be auto-updated</p>
       </div>

       {/* Master List Modal */}
       <AnimatePresence>
         {showMasterList && (
           <motion.div 
             initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
             className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-8"
           >
             <motion.div 
               initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
               className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[80vh]"
             >
               <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                 <div>
                   <h3 className="font-bold text-slate-800">Medicine Master List</h3>
                   <p className="text-xs text-slate-500">Select medicine to add to purchase invoice</p>
                 </div>
                 <button onClick={() => setShowMasterList(false)} className="text-slate-400 hover:text-slate-600">
                   <ICONS.Plus className="rotate-45" size={20} />
                 </button>
               </div>
               <div className="p-4 overflow-y-auto space-y-2">
                 {MASTER_MEDICINES.map((med, idx) => (
                   <button 
                     key={idx}
                     onClick={() => addItemToPurchase(med)}
                     className="w-full text-left p-4 rounded-2xl border border-slate-100 hover:border-brand-primary hover:bg-brand-primary/5 transition-all group"
                   >
                     <div className="flex justify-between items-center">
                       <div>
                         <span className="block text-sm font-bold text-slate-700 group-hover:text-brand-primary">{med.name}</span>
                         <span className="text-[10px] text-slate-400 uppercase font-bold">{med.salt} • {med.power}</span>
                       </div>
                       <ICONS.Plus size={16} className="text-slate-200 group-hover:text-brand-primary" />
                     </div>
                   </button>
                 ))}
               </div>
             </motion.div>
           </motion.div>
         )}
       </AnimatePresence>
    </div>
  );
}

function PharmacyBilling() {
  const [cart, setCart] = useState([
    { id: '1', name: 'Moxikind-CV 625', type: 'Tablet', qty: 2, price: 120, total: 240 },
    { id: '2', name: 'Carboxy Methyl Cellulose Eye Drops', type: 'Drops', qty: 1, price: 180, total: 180 },
  ]);
  const [discount, setDiscount] = useState(0);
  const [showItemModal, setShowItemModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const MASTER_MEDICINES = [
    { name: 'Moxikind-CV 625', type: 'Tablet', price: 120 },
    { name: 'Refresh Tears', type: 'Drops', price: 180 },
    { name: 'Predmet', type: 'Drops', price: 150 },
    { name: 'Atropine Eye Ointment', type: 'Ointment', price: 95 },
    { name: 'Ciplox D', type: 'Drops', price: 65 },
    { name: 'Toba Eye Drops', type: 'Drops', price: 145 },
  ];

  const addToCart = (med: typeof MASTER_MEDICINES[0]) => {
    const existing = cart.find(c => c.name === med.name);
    if (existing) {
      updateCartQty(existing.id, existing.qty + 1);
    } else {
      const newItem = {
        id: Math.random().toString(36).substr(2, 9),
        name: med.name,
        type: med.type,
        qty: 1,
        price: med.price,
        total: med.price
      };
      setCart([...cart, newItem]);
    }
    setShowItemModal(false);
  };

  const updateCartQty = (id: string, qty: number) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, qty);
        return { ...item, qty: newQty, total: newQty * item.price };
      }
      return item;
    }).filter(item => item.qty > 0));
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const handleCompleteSale = () => {
    if (cart.length === 0) return;
    
    const newSale = {
      billNo: `PH-${Date.now().toString().slice(-6)}`,
      patient: 'Walk-in Patient',
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      items: cart.length,
      total: finalTotal,
      discount: discount,
      payment: 'Cash',
      status: 'Completed'
    };

    savePharmacySale(newSale);
    setCart([]);
    setDiscount(0);
    alert(`Billing successful! Bill # ${newSale.billNo}`);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
  const finalTotal = Math.round(subtotal - discount);

  return (
    <div className="grid grid-cols-12 h-full min-h-[600px] relative">
      <div className="col-span-12 lg:col-span-8 p-8 border-r border-slate-100">
         <div className="flex items-center justify-between mb-8">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Sales Billing Terminal</h3>
            <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-lg border border-green-100 uppercase tracking-wider">Online Sync Active</span>
         </div>

         <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
               <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Patient Search</label>
               <div className="relative">
                  <ICONS.Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input className="w-full bg-slate-50 rounded-xl py-3 pl-10 pr-4 text-sm" placeholder="Walk-in or Search Patient ID..." />
               </div>
            </div>
            <div>
               <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Prescription ID</label>
               <input className="w-full bg-slate-50 rounded-xl py-3 px-4 text-sm font-mono" placeholder="RX-2024-XXXX" />
            </div>
         </div>

         <div className="mb-6">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Add Items to Cart</label>
            <div className="flex gap-2">
               <input 
                 className="flex-1 bg-slate-50 rounded-xl py-3 px-4 text-sm" 
                 placeholder="Search Medicine by Name..." 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 onFocus={() => setShowItemModal(true)}
               />
               <button 
                onClick={() => setShowItemModal(true)}
                className="px-6 py-3 bg-brand-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-brand-primary/20 hover:scale-105 transition-all"
               >
                 Search Master
               </button>
            </div>
         </div>

         <div className="space-y-3">
            {cart.map(item => (
               <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group transition-all hover:bg-slate-100/50">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 border border-slate-100 shadow-sm group-hover:text-brand-primary transition-colors">
                        <ICONS.Check size={18} />
                     </div>
                     <div>
                        <p className="text-sm font-bold text-slate-700">{item.name}</p>
                        <p className="text-[10px] text-slate-400 uppercase font-medium">{item.type} • Batch: B-4521</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-8">
                     <div className="text-center">
                        <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Qty</p>
                        <input 
                          type="number" 
                          value={item.qty} 
                          onChange={(e) => updateCartQty(item.id, Number(e.target.value))}
                          className="w-12 bg-white border border-slate-200 rounded px-1 py-0.5 text-center text-xs font-bold font-mono" 
                        />
                     </div>
                     <div className="text-right w-24">
                        <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Total</p>
                        <p className="text-sm font-black text-slate-800 font-mono">₹{item.total.toFixed(2)}</p>
                     </div>
                     <button onClick={() => removeFromCart(item.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                        <ICONS.Plus size={16} className="rotate-45" />
                     </button>
                  </div>
               </div>
            ))}
            {cart.length === 0 && (
              <div className="py-20 text-center text-slate-400 italic">
                No items in cart. Search for medicine to add.
              </div>
            )}
         </div>
      </div>

      <div className="col-span-12 lg:col-span-4 bg-slate-50/50 p-8">
         <div className="sticky top-0">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Pharmacy Billing Summary</h3>
            
            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 mb-6 shadow-sm">
               <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Gross Subtotal</span>
                  <span className="font-bold text-slate-700">₹{subtotal.toFixed(2)}</span>
               </div>
               <div className="flex justify-between text-sm items-center">
                  <span className="text-slate-500">Discount (₹)</span>
                  <input 
                    type="number" 
                    value={discount} 
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="w-20 bg-slate-50 border border-slate-100 rounded-lg px-2 py-1 text-right text-xs font-bold text-slate-700 outline-none" 
                  />
               </div>
               <div className="pt-4 border-t border-slate-100 flex justify-between items-end">
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total (Round off)</p>
                    <p className="text-3xl font-black text-brand-primary tracking-tighter leading-none">₹ {finalTotal.toLocaleString('en-IN')}.00</p>
                  </div>
                  <span className="text-[9px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded">PAID</span>
               </div>
            </div>

            <div className="space-y-4">
               <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Payment Option</label>
                  <select className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm font-bold text-slate-600 outline-none">
                     <option>Cash Collection</option>
                     <option>Bank / Online UPI</option>
                     <option>Card Payment</option>
                  </select>
               </div>
               <button 
                 onClick={handleCompleteSale}
                 className="w-full py-4 bg-slate-800 text-white rounded-2xl font-bold shadow-xl shadow-slate-900/10 hover:scale-[1.02] active:scale-100 transition-all flex items-center justify-center gap-2"
               >
                  <ICONS.Billing size={18} />
                  Complete Sale & Print
               </button>
               <p className="text-[9px] text-center text-slate-400 font-medium">Automatic sync enabled with Centralized Hospital Ledger</p>
            </div>
         </div>
      </div>

      {/* Item Selection Modal */}
      <AnimatePresence>
        {showItemModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-8"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-800">Select Medicine</h3>
                <button onClick={() => setShowItemModal(false)} className="text-slate-400 hover:text-slate-600">
                  <ICONS.Plus className="rotate-45" size={20} />
                </button>
              </div>
              <div className="p-4 max-h-[400px] overflow-y-auto space-y-2">
                {MASTER_MEDICINES.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase())).map((med, idx) => (
                  <button 
                    key={idx}
                    onClick={() => addToCart(med)}
                    className="w-full text-left p-4 rounded-2xl border border-slate-100 hover:border-brand-primary hover:bg-brand-primary/5 transition-all group"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="block text-sm font-bold text-slate-700 group-hover:text-brand-primary">{med.name}</span>
                        <span className="text-[10px] text-slate-400 uppercase font-bold">{med.type}</span>
                      </div>
                      <span className="text-sm font-black text-slate-800 font-mono">₹{med.price}</span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SalesRegister() {
  const [searchTerm, setSearchTerm] = useState('');
  const [allSales, setAllSales] = useState(() => getPharmacySales());

  useEffect(() => {
    const handleStorage = () => setAllSales(getPharmacySales());
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const filteredSales = allSales.filter((s: any) => 
    s.patient.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.billNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <h3 className="font-bold text-slate-800">Pharmacy Sales Register</h3>
          <p className="text-xs text-slate-500">Track daily billing and revenue performance</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="flex bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
             <input type="date" className="p-2 text-xs bg-transparent outline-none border-r border-slate-200" />
             <input type="date" className="p-2 text-xs bg-transparent outline-none" />
          </div>
          <div className="relative">
             <ICONS.Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
             <input 
               className="bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-xs w-64 outline-none focus:border-brand-primary/20" 
               placeholder="Search by Bill No or Patient..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
          <button className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold shadow-lg shadow-slate-900/10 flex items-center gap-2">
            <ICONS.Reports size={14} />
            Export GST Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
         <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Today's Sales</p>
            <p className="text-2xl font-black text-slate-800">₹ 2,694.80</p>
         </div>
         <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Bills</p>
            <p className="text-2xl font-black text-slate-800">32</p>
         </div>
         <div className="p-6 bg-brand-primary/5 rounded-3xl border border-brand-primary/10">
            <p className="text-[10px] font-black text-brand-primary uppercase tracking-widest mb-1">Cash Collection</p>
            <p className="text-2xl font-black text-brand-primary">₹ 1,450.80</p>
         </div>
         <div className="p-6 bg-green-50 rounded-3xl border border-green-100">
            <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-1">Digital (UPI/Card)</p>
            <p className="text-2xl font-black text-green-600">₹ 1,244.00</p>
         </div>
      </div>

      <div className="border border-slate-100 rounded-3xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bill Info</th>
              <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Patient Details</th>
              <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Items</th>
              <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Payment</th>
              <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Total Amount</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-[11px]">
            {filteredSales.map((sale) => (
              <tr key={sale.billNo} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <p className="font-bold text-slate-700">{sale.billNo}</p>
                  <p className="text-slate-400 mt-0.5">{sale.date} • {sale.time}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="font-bold text-slate-700">{sale.patient}</p>
                  <p className="text-slate-400 flex items-center gap-1 uppercase text-[9px] font-bold tracking-wider">
                     <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                     {sale.status}
                  </p>
                </td>
                <td className="px-4 py-4 text-center">
                   <span className="px-2 py-1 bg-slate-100 rounded-lg font-bold text-slate-500">{sale.items} Items</span>
                </td>
                <td className="px-4 py-4">
                   <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase ${
                      sale.payment === 'Cash' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                   }`}>{sale.payment}</span>
                </td>
                <td className="px-4 py-4 text-right">
                  <p className="font-black text-slate-800">₹ {sale.total.toFixed(2)}</p>
                  <p className="text-[9px] text-slate-400 italic">Disc: ₹{sale.discount}</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-slate-400 hover:text-brand-primary bg-white rounded-lg border border-slate-100 shadow-sm transition-all" title="View Detail">
                      <ICONS.Dashboard size={14} />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-brand-primary bg-white rounded-lg border border-slate-100 shadow-sm transition-all" title="Print Duplicate Bill">
                      <ICONS.Billing size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
