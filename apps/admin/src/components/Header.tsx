'use client';

import React from 'react';
import { Bell, Search, ShieldCheck } from 'lucide-react';

export function Header() {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10 shadow-sm">
      {/* Search Bar */}
      <div className="relative w-80">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by ride ID, phone, captain..."
          className="w-full pl-9 pr-4 py-1.5 text-sm bg-slate-100 border border-transparent rounded-lg focus:outline-none focus:bg-white focus:border-amber-500 transition-colors"
        />
      </div>

      {/* Right User Actions */}
      <div className="flex items-center gap-4">
        {/* System Health Status */}
        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>API & Realtime Online</span>
        </div>

        {/* Notifications */}
        <button
          aria-label="View notifications"
          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg relative"
        >
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-amber-500 absolute top-1.5 right-1.5"></span>
        </button>

        {/* Admin Profile */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-slate-800 text-white font-semibold flex items-center justify-center text-xs">
            SA
          </div>
          <div className="text-left">
            <p className="text-xs font-semibold text-slate-900 leading-tight">Super Administrator</p>
            <p className="text-[11px] text-slate-500">operations@majuligo.in</p>
          </div>
        </div>
      </div>
    </header>
  );
}
