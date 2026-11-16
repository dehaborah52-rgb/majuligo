'use client';

import React from 'react';
import {
  Users,
  Bike,
  Route,
  TrendingUp,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

const stats = [
  {
    title: 'Active Rides',
    value: '4',
    change: '+2 in last hour',
    icon: Route,
    color: 'text-amber-500',
    bg: 'bg-amber-50',
  },
  {
    title: 'Captains Online',
    value: '12',
    change: '8 in Kamalabari, 4 in Garamur',
    icon: Bike,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    title: 'Completed Today',
    value: '38',
    change: '100% completion rate',
    icon: CheckCircle2,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    title: 'Gross Bookings',
    value: '₹3,420',
    change: 'Avg ₹90 / ride',
    icon: TrendingUp,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
];

const mockRides = [
  {
    id: 'RD-9021',
    rider: 'Pranjal Saikia',
    captain: 'Bhaskar Dutta',
    from: 'Kamalabari Ghat',
    to: 'Garamur Satra',
    fare: '₹120',
    status: 'IN_PROGRESS',
    statusColor: 'bg-emerald-100 text-emerald-800',
    time: '4 mins ago',
  },
  {
    id: 'RD-9022',
    rider: 'Anamika Borah',
    captain: 'Searching...',
    from: 'Jengraimukh Bazar',
    to: 'Kamalabari Ghat',
    fare: '₹180',
    status: 'SEARCHING',
    statusColor: 'bg-amber-100 text-amber-800 animate-pulse',
    time: '30 secs ago',
  },
  {
    id: 'RD-9020',
    rider: 'Rahul Das',
    captain: 'Deepak Hazarika',
    from: 'Auniati Satra',
    to: 'Kamalabari Center',
    fare: '₹85',
    status: 'COMPLETED',
    statusColor: 'bg-slate-100 text-slate-700',
    time: '18 mins ago',
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Majuli Operations Overview
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time ride activity, captain availability, and dispatch management in Majuli, Assam.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500 text-slate-950">
            Phase 1 Foundation Active
          </span>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  {stat.title}
                </span>
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-xs text-slate-500 mt-1.5">{stat.change}</p>
            </div>
          );
        })}
      </div>

      {/* Live Rides Feed */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent & Active Island Trips</h2>
            <p className="text-xs text-slate-500 mt-0.5">Live status streamed via Socket.io</p>
          </div>
          <button className="text-xs font-semibold text-amber-600 hover:text-amber-700">
            View All Rides →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <th className="py-3 px-5">Ride ID</th>
                <th className="py-3 px-5">Rider</th>
                <th className="py-3 px-5">Captain</th>
                <th className="py-3 px-5">Route</th>
                <th className="py-3 px-5">Fare</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {mockRides.map((ride) => (
                <tr key={ride.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-5 font-mono font-semibold text-slate-900">
                    {ride.id}
                  </td>
                  <td className="py-3.5 px-5 font-medium text-slate-800">{ride.rider}</td>
                  <td className="py-3.5 px-5 text-slate-600">{ride.captain}</td>
                  <td className="py-3.5 px-5 text-slate-600">
                    <span className="font-medium text-slate-800">{ride.from}</span> →{' '}
                    <span>{ride.to}</span>
                  </td>
                  <td className="py-3.5 px-5 font-semibold text-slate-900">{ride.fare}</td>
                  <td className="py-3.5 px-5">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${ride.statusColor}`}
                    >
                      {ride.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-slate-400">{ride.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
