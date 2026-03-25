import React from 'react';
import { Bell, HelpCircle, User } from 'lucide-react';

export const Topbar: React.FC = () => {
  return (
    <header className="fixed top-0 w-full z-50 bg-violet-700 dark:bg-violet-950 text-white shadow-lg flex justify-between items-center px-6 h-16 transition-colors">
      <div className="flex items-center gap-4">
        {/* Logo or Brading */}
        <div className="text-xl font-bold tracking-tight">
          iSense Analytics
        </div>
      </div>
      
      {/* Right side actions */}
      <div className="flex items-center gap-6">
        <button className="text-white hover:text-white/80 transition-colors">
          <Bell size={20} />
        </button>
        <button className="text-white hover:text-white/80 transition-colors">
          <HelpCircle size={20} />
        </button>
        <div className="flex items-center gap-3 ml-2 border-l border-white/20 pl-6 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="text-right">
            <div className="text-sm font-semibold">Admin User</div>
            <div className="text-[10px] text-white/70 uppercase tracking-wider">Quản trị viên</div>
          </div>
          <div className="w-9 h-9 rounded-full bg-violet-900 border border-white/20 flex items-center justify-center overflow-hidden">
            <User size={18} />
          </div>
        </div>
      </div>
    </header>
  );
};
