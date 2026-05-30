import { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ICONS } from '../constants';

export default function Optical() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { name: 'Optical Billing', path: 'billing', icon: 'Billing' },
    { name: 'Glass Orders', path: 'glass-order', icon: 'Clock' },
    { name: 'Frames Inventory', path: 'inventory', icon: 'Dashboard' },
    { name: 'Sales Register', path: 'register', icon: 'Reports' },
  ];

  const currentTab = tabs.find(t => location.pathname.includes(t.path))?.path || 'billing';

  return (
    <div className="p-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Optical Store</h1>
          <p className="text-sm text-slate-500">Manage eyewear sales, prescription glass orders and frame inventory</p>
        </div>
        <div className="flex gap-2 bg-white p-1 rounded-2xl border border-slate-200">
          {tabs.map((tab) => {
            const Icon = ICONS[tab.icon as keyof typeof ICONS] || ICONS.Dashboard;
            return (
              <button 
                key={tab.path}
                onClick={() => navigate(`/optical/${tab.path}`)}
                className={`flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-bold transition-all ${currentTab === tab.path ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'text-slate-500 hover:bg-slate-50'}`}
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
          <Route index element={<OpticalBilling />} />
          <Route path="billing" element={<OpticalBilling />} />
          <Route path="glass-order" element={<GlassOrders />} />
          <Route path="inventory" element={<OpticalInventory />} />
          <Route path="register" element={<SalesRegister />} />
        </Routes>
      </div>
    </div>
  );
}

function SalesRegister() {
  const [searchTerm, setSearchTerm] = useState('');
  const sales = [
    { billNo: 'OPT/2026/088', patient: 'Rahul Mehta', date: '02/05/2026', time: '11:20 AM', type: 'Spectacles', amount: 5600, status: 'Ready', payment: 'UPI' },
    { billNo: 'OPT/2026/089', patient: 'Sana Khan', date: '02/05/2026', time: '02:15 PM', type: 'Contact Lens', amount: 1200, status: 'Delivered', payment: 'Cash' },
    { billNo: 'OPT/2026/090', patient: 'Deepak V.', date: '02/05/2026', time: '04:40 PM', type: 'Frame Only', amount: 2800, status: 'In Progress', payment: 'Card' },
  ];

  const filteredSales = sales.filter(s => 
    s.patient.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.billNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <h3 className="font-bold text-slate-800">Optical Sales Register</h3>
          <p className="text-xs text-slate-500">Daily eyewear sales and lab order revenue tracking</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
             <ICONS.Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
             <input 
               className="bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-xs w-64 outline-none focus:border-brand-primary/20" 
               placeholder="Search Bill or Patient..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
          <button className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600">Export PDF</button>
        </div>
      </div>

      <div className="border border-slate-100 rounded-3xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bill No</th>
              <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date & Time</th>
              <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Patient</th>
              <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Order Type</th>
              <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Amount</th>
              <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Payment</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-[11px]">
            {filteredSales.map((sale) => (
              <tr key={sale.billNo} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-bold text-brand-primary">{sale.billNo}</td>
                <td className="px-4 py-4 text-slate-500">{sale.date} <span className="text-[10px] opacity-50 px-1">|</span> {sale.time}</td>
                <td className="px-4 py-4 font-bold text-slate-700">{sale.patient}</td>
                <td className="px-4 py-4">
                  <span className="px-2 py-1 bg-slate-100 rounded text-[9px] font-bold text-slate-500 uppercase">{sale.type}</span>
                </td>
                <td className="px-4 py-4 text-right font-black text-slate-800">₹ {sale.amount.toFixed(2)}</td>
                <td className="px-4 py-4">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                    sale.payment === 'Cash' ? 'text-amber-600 bg-amber-50' : 'text-blue-600 bg-blue-50'
                  }`}>{sale.payment}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                    sale.status === 'Delivered' ? 'bg-green-100 text-green-600' : 
                    sale.status === 'Ready' ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'
                  }`}>
                    {sale.status}
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

function OpticalBilling() {
  const [cart, setCart] = useState<{id: string, name: string, type: string, qty: number, price: number, total: number}[]>([]);
  const [discount, setDiscount] = useState(0);

  const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
  const finalTotal = Math.round(subtotal - discount);

  const handleCompleteSale = () => {
    if (cart.length === 0) {
      alert('Please add items to the cart');
      return;
    }
    alert(`Optical Bill Generated for ₹${finalTotal}`);
    setCart([]);
  };

  return (
    <div className="grid grid-cols-12 min-h-[600px]">
      <div className="col-span-12 lg:col-span-8 p-8 border-r border-slate-100">
        <div className="flex items-center justify-between mb-8">
           <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Optical Sales Terminal</h3>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
           <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Patient Reference</label>
              <div className="flex gap-2">
                 <input className="flex-1 bg-white border border-slate-200 rounded-lg p-2 text-sm" placeholder="Patient ID or Name" />
                 <button className="px-3 bg-brand-primary text-white rounded-lg text-xs font-bold">Find</button>
              </div>
           </div>
           <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Prescription (Optional)</label>
              <select className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm">
                 <option>No prescription linked</option>
                 <option>Dr. Sharma (Today)</option>
              </select>
           </div>
        </div>

        <div className="space-y-4">
           {/* Add Item Trigger */}
           <button 
             onClick={() => {
                const newItem = { id: Math.random().toString(), name: 'Ray-Ban Aviator', type: 'Frame', qty: 1, price: 4500, total: 4500 };
                setCart([...cart, newItem]);
             }}
             className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-xs font-bold text-slate-400 hover:border-brand-primary hover:text-brand-primary transition-all"
           >
              + Add Frame / Lens / Accessory
           </button>

           {cart.map(item => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 border border-slate-100">
                       <ICONS.Check size={18} />
                    </div>
                    <div>
                       <p className="text-sm font-bold text-slate-700">{item.name}</p>
                       <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">{item.type}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-8">
                    <div className="text-right">
                       <p className="text-sm font-black text-slate-800">₹{item.total}</p>
                    </div>
                    <button onClick={() => setCart(cart.filter(c => c.id !== item.id))} className="text-slate-300 hover:text-red-500">
                       <ICONS.Plus size={16} className="rotate-45" />
                    </button>
                 </div>
              </div>
           ))}
        </div>
      </div>

      <div className="col-span-12 lg:col-span-4 bg-slate-50/30 p-8">
         <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Order Summary</h3>
         <div className="space-y-4 mb-8">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
               <div className="flex justify-between text-sm mb-3 text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-bold">₹{subtotal}</span>
               </div>
               <div className="flex justify-between text-sm mb-3">
                  <span className="text-slate-600">Discount</span>
                  <input 
                    type="number" 
                    value={discount} 
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="w-20 text-right bg-slate-50 border-none rounded p-1 text-xs font-bold text-brand-primary" 
                  />
               </div>
               <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                  <span className="font-bold text-slate-800">Order Total</span>
                  <span className="text-xl font-black text-brand-primary">₹{finalTotal}</span>
               </div>
            </div>
         </div>

         <button 
           onClick={handleCompleteSale}
           className="w-full py-4 bg-slate-800 text-white rounded-2xl font-bold shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
         >
            <ICONS.Billing size={18} />
            Place Order & Bill
         </button>
      </div>
    </div>
  );
}

function GlassOrders() {
  const orders = [
    { id: 'ORD-101', patient: 'Rajesh Kumar', prescription: 'DV: -2.50 Cyl: -0.75', status: 'In Production', date: 'Oct 12' },
    { id: 'ORD-102', patient: 'Anita Sharma', prescription: 'Progressive Lens', status: 'Ready', date: 'Oct 11' },
    { id: 'ORD-103', patient: 'Vihaan Singh', prescription: 'Anti-Glare coating', status: 'Pending Lab', date: 'Oct 12' },
  ];

  return (
    <div className="p-8">
       <div className="flex items-center justify-between mb-8">
          <h3 className="font-bold text-slate-800">Spectacle & Glass Orders</h3>
          <button className="px-4 py-2 bg-brand-primary/10 text-brand-primary rounded-xl text-xs font-bold">+ New Lab Order</button>
       </div>

       <div className="space-y-3">
          {orders.map(o => (
             <div key={o.id} className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-3xl hover:border-brand-primary transition-all group">
                <div className="flex items-center gap-6">
                   <div className="text-center w-16">
                      <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">{o.date}</p>
                      <p className="text-xs font-black text-slate-800">{o.id}</p>
                   </div>
                   <div className="h-10 w-[1px] bg-slate-100"></div>
                   <div>
                      <p className="text-sm font-bold text-slate-800">{o.patient}</p>
                      <p className="text-xs text-slate-500 italic mt-0.5">{o.prescription}</p>
                   </div>
                </div>
                <div className="flex items-center gap-8">
                   <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      o.status === 'Ready' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                   }`}>
                      {o.status}
                   </span>
                   <button className="text-slate-300 group-hover:text-brand-primary transition-colors">
                      <ICONS.Dashboard size={18} />
                   </button>
                </div>
             </div>
          ))}
       </div>
    </div>
  );
}

function OpticalInventory() {
  const stock = [
    { category: 'Frames', items: [
      { name: 'Titan Edge Slim', code: 'T-992', qty: 24, price: 3400 },
      { name: 'Ray-Ban Classic', code: 'RB-01', qty: 12, price: 4500 },
    ]},
    { category: 'Lenses', items: [
      { name: 'Blue Cut 1.6 Index', code: 'LNS-BC', qty: 40, price: 1200 },
      { name: 'Photochromic Grey', code: 'LNS-PG', qty: 15, price: 1800 },
    ]}
  ];

  return (
    <div className="p-8 space-y-10">
       {stock.map(cat => (
          <div key={cat.category}>
             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{cat.category} Inventory</h4>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cat.items.map(item => (
                   <div key={item.code} className="p-5 bg-slate-50 rounded-3xl border border-slate-100 group hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all cursor-pointer">
                      <div className="flex justify-between items-start mb-4">
                         <div>
                            <p className="text-sm font-bold text-slate-700">{item.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono">CODE: {item.code}</p>
                         </div>
                         <div className="text-right">
                            <p className="text-lg font-black text-brand-primary">₹{item.price}</p>
                         </div>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                         <span className="text-xs text-slate-500 font-medium">In Stock</span>
                         <span className="text-sm font-black text-slate-800">{item.qty} pcs</span>
                      </div>
                   </div>
                ))}
                <button className="border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center gap-2 p-5 text-slate-400 hover:text-brand-primary hover:border-brand-primary transition-all">
                   <ICONS.Plus size={24} />
                   <span className="text-[10px] font-bold uppercase">Add {cat.category}</span>
                </button>
             </div>
          </div>
       ))}
    </div>
  );
}
