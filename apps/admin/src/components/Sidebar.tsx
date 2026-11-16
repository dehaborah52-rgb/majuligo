'use client';

import React from 'react';
import {
  LayoutDashboard,
  Users,
  Bike,
  Route,
  FileCheck2,
  Settings,
  ShieldAlert,
  BarChart3,
  CreditCard,
} from 'lucide-react';

const navigationItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '#', active: true },
  { name: 'Live Rides', icon: Route, href: '#', badge: 'Active' },
  { name: 'Captains', icon: Bike, href: '#' },
  { name: 'KYC Document Approval', icon: FileCheck2, href: '#', badge: '3 Pending' },
  { name: 'Riders', icon: Users, href: '#' },
  { name: 'Fare & Geo-Fencing', icon: BarChart3, href: '#' },
  { name: 'Payments & Settlement', icon: CreditCard, href: '#' },
  { name: 'Audit Logs', icon: ShieldAlert, href: '#' },
  { name: 'Settings', icon: Settings, href: '#' },
];

export function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen flex flex-col border-r border-slate-800">
      {/* Brand Logo Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800 gap-3">
        <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center font-bold text-slate-950 text-xl shadow-md shadow-amber-500/20">
          M
        </div>
        <div>
          <span className="font-bold text-lg tracking-tight text-white">Majuli</span>
          <span className="font-bold text-lg tracking-tight text-amber-500">Go</span>
          <span className="text-[10px] block text-slate-400 font-medium tracking-wider uppercase">
            Admin Console
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.name}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                item.active
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${item.active ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    item.active
                      ? 'bg-slate-950 text-amber-400'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </a>
          );
        })}
      </nav>

      {/* Service Region Pill */}
      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800/60 rounded-lg p-3 border border-slate-700/60 text-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-slate-400 font-medium">Service Area</span>
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
          <p className="font-semibold text-slate-200">Majuli, Assam</p>
          <p className="text-[11px] text-slate-400">Kamalabari & Garamur Zone</p>
        </div>
      </div>
    </aside>
  );
}
