import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import MessagesPanel from './MessagesPanel';
import { AnimatePresence } from 'motion/react';

export default function Layout() {
  const [showMessages, setShowMessages] = useState(false);

  return (
    <div className="flex min-h-screen bg-brand-bg relative overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Header onOpenMessages={() => setShowMessages(true)} />
        
        <div className="flex-1 overflow-y-auto">
          <Outlet context={{ onOpenMessages: () => setShowMessages(true) }} />
        </div>
      </main>

      <AnimatePresence>
        {showMessages && <MessagesPanel onClose={() => setShowMessages(false)} />}
      </AnimatePresence>
    </div>
  );
}
