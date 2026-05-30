import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ICONS } from '../constants';
import { useAuth } from '../AuthContext';

interface Message {
  id: string;
  sender: string;
  content: string;
  time: string;
  isMe: boolean;
  avatar: string;
}

export default function MessagesPanel({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'Dr. Sameer', content: 'Patient in ward 4 needs immediate attention.', time: '10:30 AM', isMe: false, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sameer' },
    { id: '2', sender: 'Reception', content: 'Next surgery patient has arrived.', time: '10:45 AM', isMe: false, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Reception' },
    { id: '3', sender: 'You', content: 'Acknowledged. Heading there now.', time: '10:50 AM', isMe: true, avatar: user?.avatar || '' },
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'You',
      content: inputValue,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
      avatar: user?.avatar || '',
    };

    setMessages([...messages, newMessage]);
    setInputValue('');
  };

  return (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl border-l border-slate-200 z-50 flex flex-col"
    >
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white">
            <ICONS.MessageSquare size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 tracking-tight">Internal Comms</h3>
            <span className="text-[10px] text-green-500 font-bold uppercase tracking-widest flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              Live System
            </span>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-2 text-slate-400 hover:bg-slate-200 rounded-xl transition-all"
        >
          <ICONS.Plus className="rotate-45" size={20} />
        </button>
      </div>

      <div className="flex-grow overflow-y-auto p-4 space-y-4 scrollbar-none">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}
          >
            <div className={`flex gap-2 max-w-[85%] ${msg.isMe ? 'flex-row-reverse' : 'flex-row'}`}>
              <img src={msg.avatar} alt={msg.sender} className="w-6 h-6 rounded-full flex-shrink-0 mt-auto" />
              <div className={`p-3 rounded-2xl text-[11px] font-medium leading-relaxed shadow-sm ${
                msg.isMe ? 'bg-brand-primary text-white rounded-br-none' : 'bg-slate-100 text-slate-700 rounded-bl-none'
              }`}>
                {msg.content}
              </div>
            </div>
            <span className="text-[9px] text-slate-400 font-bold mt-1 uppercase tracking-widest">{msg.time}</span>
          </div>
        ))}
      </div>

      <div className="p-4 bg-white border-t border-slate-100">
        <form onSubmit={handleSendMessage} className="relative">
          <input 
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-4 pr-12 text-xs font-bold outline-none focus:border-brand-primary/50 transition-all"
            placeholder="Type a message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button 
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-brand-primary text-white rounded-xl shadow-lg shadow-brand-primary/20 hover:scale-105 active:scale-95 transition-all"
          >
            <ICONS.Hospital size={14} />
          </button>
        </form>
      </div>
    </motion.div>
  );
}
