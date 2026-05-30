import React, { useState } from 'react';
import { MOCK_TASKS, ICONS } from '../constants';
import { motion, AnimatePresence } from 'motion/react';

export default function TaskList() {
  const [tasks, setTasks] = useState(MOCK_TASKS);
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const newTask = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTaskTitle,
      completed: false,
      priority: 'normal'
    };
    setTasks([newTask, ...tasks]);
    setNewTaskTitle('');
    setIsAdding(false);
  };

  const deleteTask = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 h-full shadow-sm flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-800 tracking-tight">Task List</h3>
        <button className="text-slate-400 hover:text-slate-600 transition-colors">
          <ICONS.More size={20} />
        </button>
      </div>

      <div className="space-y-2 flex-grow overflow-y-auto max-h-[300px] pr-2 scrollbar-none">
        <AnimatePresence initial={false}>
          {tasks.map((task) => (
            <motion.div 
              key={task.id} 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onClick={() => toggleTask(task.id)}
              className="flex items-center justify-between group p-3 rounded-xl bg-slate-50 border border-transparent hover:border-brand-primary/20 cursor-pointer transition-all"
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                  task.completed ? 'bg-brand-primary border-brand-primary text-white' : 'border-slate-300 bg-white text-transparent'
                }`}>
                  <ICONS.Check size={12} strokeWidth={4} />
                </div>
                <span className={`text-sm font-medium transition-all ${
                  task.completed ? 'text-slate-400 line-through' : 'text-slate-700'
                }`}>
                  {task.title}
                </span>
              </div>
              <button 
                onClick={(e) => deleteTask(task.id, e)}
                className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
              >
                <ICONS.Plus className="rotate-45" size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {tasks.length === 0 && (
          <div className="text-center py-10">
            <p className="text-sm text-slate-400 italic">No tasks yet</p>
          </div>
        )}
      </div>
      
      {isAdding ? (
        <form onSubmit={addTask} className="mt-4 flex gap-2">
          <input 
            autoFocus
            className="flex-1 bg-slate-50 border border-brand-primary/20 rounded-xl p-3 text-sm font-medium outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all"
            placeholder="What needs to be done?"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onBlur={() => {
              if (!newTaskTitle) setIsAdding(false);
            }}
          />
          <button 
            type="submit"
            className="p-3 bg-brand-primary text-white rounded-xl shadow-lg shadow-brand-primary/20 hover:scale-105 active:scale-95 transition-all"
          >
            <ICONS.Plus size={20} />
          </button>
        </form>
      ) : (
        <button 
          onClick={() => setIsAdding(true)}
          className="w-full mt-4 flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-slate-300 text-slate-400 text-sm font-bold hover:border-brand-primary hover:text-brand-primary hover:bg-brand-primary/5 transition-all"
        >
          <ICONS.Plus size={16} />
          Add New Task
        </button>
      )}
    </div>
  );
}
