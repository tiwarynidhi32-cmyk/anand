import { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ICONS, MOCK_ADMISSIONS } from '../constants';
import { motion, AnimatePresence } from 'motion/react';
import { PrescriptionTemplate } from '../components/PrescriptionTemplate';

export default function Appointments() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showToken, setShowToken] = useState<any>(null);
  const [showPrescription, setShowPrescription] = useState<any>(null);

  const tabs = [
    { name: 'Doctor Schedule', path: 'doctor-schedule', icon: 'Dashboard' },
    { name: 'Book Appointment', path: 'book-appointment', icon: 'Patients' },
    { name: 'Calendar', path: 'calendar', icon: 'Search' },
  ];

  const currentTab = tabs.find(t => location.pathname.includes(t.path))?.path || 'doctor-schedule';

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 font-display">Appointment Scheduling</h1>
          <p className="text-sm text-slate-500">Manage doctor visits and patient schedules</p>
        </div>
        <div className="flex gap-2 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.path}
              onClick={() => navigate(`/appointments/${tab.path}`)}
              className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${
                currentTab === tab.path ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
        <Routes>
          <Route index element={<ScheduleView onPrintToken={setShowToken} onPrintPrescription={setShowPrescription} />} />
          <Route path="doctor-schedule" element={<ScheduleView onPrintToken={setShowToken} onPrintPrescription={setShowPrescription} />} />
          <Route path="book-appointment" element={<BookAppointment onShowToken={setShowToken} />} />
          <Route path="calendar" element={<CalendarGridView />} />
          <Route path="*" element={<div className="p-20 text-center text-slate-400">Section Active - Interface Initializing</div>} />
        </Routes>
      </div>

      <AnimatePresence>
        {showToken && (
          <TokenPrint patient={showToken} onClose={() => setShowToken(null)} />
        )}
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

function CalendarGridView() {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  const currentMonth = today.toLocaleString('default', { month: 'long', year: 'numeric' });
  
  // Simple view of current month days
  const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-black text-slate-800 tracking-tight">{currentMonth}</h3>
        <div className="flex gap-2">
           <button className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"><ICONS.Plus className="rotate-180" size={16} /></button>
           <button className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"><ICONS.Plus size={16} /></button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-slate-100 border border-slate-100 rounded-2xl overflow-hidden flex-1">
        {days.map(day => (
          <div key={day} className="bg-slate-50 p-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">{day}</div>
        ))}
        {calendarDays.map(day => {
          const hasEvent = day % 4 === 1;
          const isToday = day === today.getDate();
          return (
            <div key={day} className={`bg-white p-4 min-h-[100px] transition-colors hover:bg-slate-50 relative group ${isToday ? 'ring-2 ring-inset ring-brand-primary' : ''}`}>
               <span className={`text-xs font-bold ${isToday ? 'text-brand-primary' : 'text-slate-400'}`}>{day}</span>
               {hasEvent && (
                 <div className="mt-2 space-y-1">
                   <div className="bg-brand-primary/10 text-brand-primary p-1.5 rounded-lg text-[9px] font-bold border border-brand-primary/20 truncate">
                     Cataract - OT 1
                   </div>
                   {day === 9 && (
                     <div className="bg-amber-100 text-amber-700 p-1.5 rounded-lg text-[9px] font-bold border border-amber-200 truncate">
                       Glaucoma Review
                     </div>
                   )}
                 </div>
               )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TokenPrint({ patient, onClose }: { patient: any, onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl flex flex-col"
      >
        <div className="flex-1 bg-white print-content">
          <div className="p-8 text-center border-b border-dashed border-slate-200">
            <div className="flex flex-col items-center mb-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 bg-[#cc0066] text-white flex items-center justify-center rounded-sm font-bold text-xl">
                  +
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[#cc0066] font-black text-lg leading-tight uppercase tracking-tighter">आनन्द हॉस्पिटल</span>
                  <span className="text-brand-primary text-[10px] font-bold leading-none uppercase">आई केयर सेन्टर</span>
                </div>
              </div>
              <h3 className="text-lg font-black text-slate-800 tracking-tight text-center">Anand Hospital and Eye Care Center</h3>
              <p className="text-[10px] text-slate-500 font-medium text-center">Near New Maruti showroom Bansi Road Bargadwa, Basti UP - 272002</p>
              <p className="text-[10px] text-slate-500 font-bold text-center mt-0.5">Phone: +91 7015022218</p>
            </div>
          </div>
          
          <div className="p-6">
            <div className="text-center mb-6 print:mt-4">
              <p className="text-xs text-brand-primary font-bold uppercase tracking-widest border-b border-brand-primary/20 pb-2 inline-block px-4">Token / Receipt</p>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
              <table className="w-full text-[11px]">
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="p-2 bg-slate-50 font-bold text-slate-600 w-1/2 border-r border-slate-200">Appointment ID / Token No.</td>
                    <td className="p-2 text-slate-700">A00680 / {patient.token || '5'}</td>
                  </tr>
                  <tr>
                    <td className="p-2 bg-slate-50 font-bold text-slate-600 border-r border-slate-200">Patient Name</td>
                    <td className="p-2 text-slate-700 uppercase">{patient.patientName}</td>
                  </tr>
                  <tr>
                    <td className="p-2 bg-slate-50 font-bold text-slate-600 border-r border-slate-200">Age / Gender</td>
                    <td className="p-2 text-slate-700">32 / {patient.gender || 'Male'}</td>
                  </tr>
                  <tr>
                    <td className="p-2 bg-slate-50 font-bold text-slate-600 border-r border-slate-200">Doctor</td>
                    <td className="p-2 text-slate-700 uppercase">{patient.doctor || 'DR RAJU SINGH'}</td>
                  </tr>
                  <tr>
                    <td className="p-2 bg-slate-50 font-bold text-slate-600 border-r border-slate-200">Date</td>
                    <td className="p-2 text-slate-700">01-05-2026</td>
                  </tr>
                  <tr>
                    <td className="p-2 bg-slate-50 font-bold text-slate-600 border-r border-slate-200">Time</td>
                    <td className="p-2 text-slate-700">{patient.time || '11:17'}</td>
                  </tr>
                  <tr>
                    <td className="p-2 bg-slate-50 font-bold text-slate-600 border-r border-slate-200">Fees</td>
                    <td className="p-2 text-slate-700 font-bold">₹ 500.00</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-8 text-center space-y-4">
              <p className="text-[10px] text-slate-400 max-w-[240px] mx-auto leading-relaxed">
                Thank you for visiting Anand Hospital and Eye Care Center. Wishing you good health and speedy recovery.
              </p>
              
              <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-left print:hidden">
                 <p className="text-xs font-bold text-slate-700 mb-2">नोट :-</p>
                 <ul className="text-[10px] text-slate-600 space-y-1 list-disc pl-4">
                    <li>खुलने का समय (सोमवार से शनिवार) <span className="font-bold">सुबह 9 बजे से शाम 6 बजे तक</span></li>
                    <li>रविवार बन्दी</li>
                 </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 pt-0 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors"
          >
            Close
          </button>
          <button 
            onClick={() => {
              window.print();
              onClose();
            }}
            className="flex-1 px-4 py-3 bg-brand-primary text-white rounded-xl text-xs font-bold shadow-lg shadow-brand-primary/20 hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            <ICONS.Check size={14} />
            Print Receipt
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function ScheduleView({ onPrintToken, onPrintPrescription }: { onPrintToken: (data: any) => void, onPrintPrescription: (patient: any) => void }) {
  const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'];
  
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-slate-700">Today's Schedule</h3>
        <div className="flex items-center gap-4">
           <button className="p-2 hover:bg-slate-50 rounded-lg"><ICONS.Search size={18} className="text-slate-400" /></button>
           <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold border border-slate-200">
             Filter: All Doctors
           </button>
        </div>
      </div>

      <div className="space-y-4">
        {timeSlots.map((time, idx) => (
          <div key={time} className="flex gap-6 items-start group">
            <span className="text-xs font-bold text-slate-400 w-20 pt-1">{time}</span>
            <div className={`flex-1 p-4 rounded-2xl border transition-all ${idx % 3 === 0 ? 'bg-brand-primary/5 border-brand-primary/20' : 'border-slate-100 group-hover:border-slate-200 bg-white'}`}>
               {idx % 3 === 0 ? (
                 <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-sm text-slate-800">Mahesh Kumar - <span className="text-brand-primary">Check-up</span></p>
                      <p className="text-[10px] text-slate-500 font-medium mt-1">Ref by: Self | Dr. Gupta</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => onPrintPrescription && onPrintPrescription({ id: idx, name: 'Mahesh Kumar', age: 42, gender: 'Male', vitals: { bp: '130/85', pulse: '78', weight: '70kg', temp: '98.6F', spo2: '98%' } })}
                        className="p-2 text-slate-400 hover:text-brand-primary hover:bg-white rounded-lg transition-all"
                        title="Generate Prescription Template"
                      >
                        <ICONS.Plus size={16} />
                      </button>
                      <button 
                        onClick={() => onPrintToken({ patientName: 'Mahesh Kumar', time, doctor: 'Dr. Gupta', token: '42' })}
                        className="p-2 text-slate-400 hover:text-brand-primary hover:bg-white rounded-lg transition-all"
                        title="Print Token"
                      >
                        <ICONS.Reports size={16} />
                      </button>
                      <span className="px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-full text-[10px] font-bold">Confirmed</span>
                    </div>
                 </div>
               ) : (
                 <button className="text-[10px] font-bold text-slate-300 uppercase tracking-widest hover:text-brand-primary transition-colors text-left">+ Book Slot</button>
               )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BookAppointment({ onShowToken }: { onShowToken: (data: any) => void }) {
  const [patientName, setPatientName] = useState('');
  
  const handleBooking = () => {
    if (!patientName) return;
    onShowToken({ 
      patientName, 
      time: '11:45 AM', 
      doctor: 'Dr. Anita Mehta', 
      token: Math.floor(Math.random() * 100).toString() 
    });
  };

  return (
    <div className="p-10 max-w-2xl mx-auto space-y-6">
       <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Patient Name</label>
          <input 
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            className="w-full bg-slate-50 rounded-xl p-4 text-sm border-none outline-none focus:ring-2 focus:ring-brand-primary/10" 
            placeholder="Type name or scan ID..." 
          />
       </div>
       <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
             <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</label>
             <input type="date" className="w-full bg-slate-50 rounded-xl p-4 text-sm border-none outline-none" defaultValue={new Date().toISOString().split('T')[0]} />
          </div>
          <div className="space-y-2">
             <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Department</label>
             <select className="w-full bg-slate-50 rounded-xl p-4 text-sm border-none outline-none">
                <option>General Eye Care</option>
                <option>Retina Services</option>
                <option>Glaucoma Dept</option>
             </select>
          </div>
       </div>

       <div className="p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <div className="flex items-center justify-between">
             <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Appointment Fee (Standard)</p>
                <p className="text-sm font-bold text-slate-700">Payable at counter or online</p>
             </div>
             <p className="text-2xl font-black text-brand-primary tracking-tighter">₹ 500.00</p>
          </div>
       </div>

       <button 
        onClick={handleBooking}
        className="w-full py-4 bg-brand-primary text-white rounded-xl font-bold shadow-xl shadow-brand-primary/20 mt-4 hover:scale-[1.02] active:scale-100 transition-all"
       >
         Confirm & Print Token
       </button>
    </div>
  );
}
