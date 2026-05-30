import { motion } from 'motion/react';
import { ICONS } from '../constants';

export function PrescriptionTemplate({ patient, onClose }: { patient: any, onClose: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 print:p-0 print:bg-white"
    >
      <motion.div 
        initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
        className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] print:shadow-none print:rounded-none print:max-h-none print:h-auto"
      >
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 print:hidden">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <ICONS.Reports className="text-brand-primary" size={18} />
            Prescription Template Preview
          </h3>
          <div className="flex gap-2">
            <button 
              onClick={() => window.print()}
              className="px-4 py-2 bg-brand-primary text-white rounded-xl text-xs font-bold shadow-lg shadow-brand-primary/20 flex items-center gap-2"
            >
              <ICONS.Billing size={14} />
              Print Prescription
            </button>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600">
              <ICONS.Plus className="rotate-45" size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-12 print:p-0 print-content print:overflow-visible">
          <div className="w-full border-2 border-slate-900 min-h-[800px] flex flex-col bg-white print:min-h-0">
            {/* Header */}
            <div className="p-8 border-b-2 border-slate-900 flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Vision Hospital</h1>
                <p className="text-xs font-bold text-slate-600 mt-1 uppercase tracking-widest">Multi-Specialty Eye Care & Surgical Center</p>
                <div className="mt-4 text-[10px] text-slate-500 space-y-0.5 font-bold uppercase tracking-wider">
                  <p>123 Medical Avenue, Healthcare City</p>
                  <p>Phone: +91 98765 43210 | info@visionhospital.com</p>
                </div>
              </div>
              <div className="text-right">
                <h2 className="text-lg font-black text-slate-800 uppercase tracking-widest border-b-2 border-brand-primary inline-block mb-2">Prescription</h2>
                <p className="text-xs font-bold text-slate-400">DATE: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
              </div>
            </div>

            {/* Patient Info Bar */}
            <div className="grid grid-cols-4 border-b-2 border-slate-900 bg-slate-50">
              <div className="p-4 border-r-2 border-slate-900">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Patient Name</p>
                <p className="text-sm font-black text-slate-800 uppercase">{patient?.name || '________________'}</p>
              </div>
              <div className="p-4 border-r-2 border-slate-900">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">ID / Age / Gender</p>
                <p className="text-sm font-black text-slate-800">
                  #PAT-00{patient?.id || '____'} | {patient?.age || '__'}Y | {patient?.gender || '____'}
                </p>
              </div>
              <div className="p-4 border-r-2 border-slate-900">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Contact</p>
                <p className="text-sm font-black text-slate-800">+91 91234 56789</p>
              </div>
              <div className="p-4">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Consulting Doctor</p>
                <p className="text-sm font-black text-slate-800 uppercase">Dr. Avinash Sharma</p>
              </div>
            </div>

            {/* Vitals Record Section */}
            <div className="flex flex-1 border-slate-900">
              <div className="w-1/4 p-4 border-r-2 border-slate-900 bg-slate-50/50">
                <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <div className="w-2 h-2 bg-brand-primary rounded-full"></div>
                  Vital Signs
                </h4>
                <div className="space-y-6">
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">B.P. (mmHg)</p>
                    <p className="text-md font-black text-slate-800 border-b border-slate-200 pb-1 mt-1">{patient?.vitals?.bp || '___ / ___'}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Pulse (/min)</p>
                    <p className="text-md font-black text-slate-800 border-b border-slate-200 pb-1 mt-1">{patient?.vitals?.pulse || '___'}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Weight (Kg)</p>
                    <p className="text-md font-black text-slate-800 border-b border-slate-200 pb-1 mt-1">{patient?.vitals?.weight || '___'}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Temp (°F)</p>
                    <p className="text-md font-black text-slate-800 border-b border-slate-200 pb-1 mt-1">{patient?.vitals?.temp || '___'}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">SpO2 (%)</p>
                    <p className="text-md font-black text-slate-800 border-b border-slate-200 pb-1 mt-1">{patient?.vitals?.spo2 || '___'}</p>
                  </div>
                </div>
              </div>

              {/* Main Prescription Area */}
              <div className="w-3/4 p-10 relative bg-white">
                <div className="absolute top-8 left-8">
                  <span className="text-5xl font-black text-slate-100 select-none pointer-events-none">Rx</span>
                </div>
                <div className="mt-12 space-y-8">
                  <div className="h-6 w-full border-b border-slate-100 flex items-end">
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mr-4">Diagnosis / Notes:</span>
                  </div>
                  {[...Array(15)].map((_, i) => (
                    <div key={i} className="h-8 w-full border-b border-slate-100 opacity-30"></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-8 border-t-2 border-slate-900 flex justify-between items-end bg-slate-50/20">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Please bring this prescription for follow-up visits</p>
                <p className="text-[10px] font-black text-brand-primary uppercase tracking-wider">Validity: 15 Days from date of issue</p>
              </div>
              <div className="text-center w-64 border-t-2 border-slate-900 pt-2">
                <p className="text-xs font-black text-slate-800 mb-1">Dr. Avinash Sharma</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">MBBS, MS (Ophthalmology)</p>
                <p className="text-[10px] font-medium text-slate-300 mt-1 uppercase tracking-widest">Digital Signature</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
