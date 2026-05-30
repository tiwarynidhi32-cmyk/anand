import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { ICONS } from '../constants';
import { motion } from 'motion/react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(username, password)) {
      // Login successful, AuthContext will update and reload
    } else {
      setError('Invalid credentials. Password is 123');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl shadow-brand-primary/10 p-12 border border-slate-100"
      >
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-brand-primary rounded-3xl flex items-center justify-center text-white shadow-xl shadow-brand-primary/20 mx-auto mb-6">
            <ICONS.Hospital size={40} />
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Anand Hospital</h1>
          <p className="text-slate-400 text-sm font-medium mt-2">Enter your credentials to access the panel</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-4">Username / User ID</label>
            <input 
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary outline-none transition-all placeholder:text-slate-300"
              placeholder="e.g. doctor, pharmacist..."
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-4">Password</label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary outline-none transition-all placeholder:text-slate-300"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-[10px] font-black uppercase text-center">{error}</p>
          )}

          <button 
            type="submit"
            className="w-full bg-brand-primary text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-brand-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            Sign In
          </button>
        </form>

        <div className="mt-12 grid grid-cols-2 gap-4">
           {[
             { label: 'Doctor', user: 'doctor' },
             { label: 'Pharmacist', user: 'pharmacist' },
             { label: 'Accountant', user: 'accountant' },
             { label: 'Receptionist', user: 'receptionist' },
             { label: 'Admin', user: 'admin' }
           ].map(role => (
             <button 
               key={role.user}
               onClick={() => setUsername(role.user)}
               className="p-3 bg-slate-50 rounded-xl text-[9px] font-black text-slate-400 uppercase hover:bg-brand-primary/5 hover:text-brand-primary transition-all border border-transparent hover:border-brand-primary/10"
             >
                {role.label} Login
             </button>
           ))}
        </div>
      </motion.div>
    </div>
  );
}
