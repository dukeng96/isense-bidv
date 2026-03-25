import React from 'react';
import { Home, PhoneCall, BarChart2, Settings } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';

export const Sidebar: React.FC = () => {
  const navItems = [
    { name: 'Trang chủ', path: '/', icon: Home, exact: true },
    { name: 'Cuộc gọi', path: '/calls', icon: PhoneCall },
    { name: 'Phân tích', path: '/analytics', icon: BarChart2 },
    { 
      name: 'Cài đặt', 
      path: '/settings', 
      icon: Settings,
      subItems: [
        { name: 'Quản lý Scorecards', path: '/management' },
        { name: 'Smart AI Importer', path: '/importer' }
      ]
    },
  ];

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-64px)] w-64 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-40 py-6 px-4 flex flex-col gap-2">
      <div className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider px-4">
        Management v2.4.0
      </div>
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const hasSub = item.subItems && item.subItems.length > 0;
          
          return (
            <div key={item.path} className="flex flex-col">
              <NavLink
                to={hasSub ? item.subItems![0].path : item.path}
                className={({ isActive }) => clsx(
                  "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive || (hasSub && item.subItems!.some(sub => location.pathname.startsWith(sub.path)))
                    ? "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300" 
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                )}
              >
                <Icon size={18} />
                {item.name}
              </NavLink>
              
              {hasSub && (
                <div className="ml-11 mt-1 flex flex-col gap-1 border-l-2 border-slate-100 transition-all">
                  {item.subItems!.map(sub => (
                    <NavLink
                      key={sub.path}
                      to={sub.path}
                      className={({ isActive }) => clsx(
                        "text-xs font-medium px-4 py-2 rounded-lg transition-colors border-l-2 -ml-[2px]",
                        isActive 
                          ? "border-violet-500 text-violet-700 bg-violet-50/50" 
                          : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                      )}
                    >
                      {sub.name}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Support Box */}
      <div className="mt-auto px-4 py-4 rounded-xl bg-violet-50 dark:bg-slate-800 border border-violet-100 dark:border-slate-700 mx-1">
        <h4 className="text-sm font-bold text-violet-900 dark:text-violet-200 mb-1">Cần hỗ trợ?</h4>
        <p className="text-xs text-violet-700/80 dark:text-violet-300/80 leading-relaxed">
          Xem tài liệu hướng dẫn sử dụng hệ thống iSense.
        </p>
      </div>
    </aside>
  );
};
