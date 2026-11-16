'use client';

import React, { useState } from 'react';
import { X, Calculator, ArrowRight } from 'lucide-react';
import { calculateFare } from '@majuligo/shared';

export interface FareSimulatorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FareSimulatorDrawer({ isOpen, onClose }: FareSimulatorDrawerProps) {
  const [baseFare, setBaseFare] = useState(20);
  const [baseIncludedKm, setBaseIncludedKm] = useState(1.5);
  const [perKmRate, setPerKmRate] = useState(10);
  const [perMinuteRate, setPerMinuteRate] = useState(1);
  const [commissionPercent, setCommissionPercent] = useState(15);

  if (!isOpen) return null;

  // Simulate routes across Majuli
  const routes = [
    {
      name: 'Kamalabari Ghat → Garamur Satra',
      distance: 8.5,
      duration: 18,
    },
    {
      name: 'Garamur Satra → Auniati Satra',
      distance: 6.2,
      duration: 14,
    },
    {
      name: 'Kamalabari → Jengraimukh Commercial Hub',
      distance: 24.0,
      duration: 50,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-amber-500" />
            <div>
              <h3 className="font-bold text-slate-900 text-base">Majuli Fare Simulator</h3>
              <p className="text-xs text-slate-500">Live pricing and driver split simulator</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sliders Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Base Fare */}
          <div>
            <div className="flex justify-between items-center mb-1 text-xs">
              <span className="font-semibold text-slate-700">Base Fare (Includes {baseIncludedKm} km)</span>
              <span className="font-bold text-amber-600 font-mono">₹{baseFare}</span>
            </div>
            <input
              type="range"
              min="15"
              max="40"
              step="1"
              value={baseFare}
              onChange={(e) => setBaseFare(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Per Km Rate */}
          <div>
            <div className="flex justify-between items-center mb-1 text-xs">
              <span className="font-semibold text-slate-700">Per Kilometer Rate</span>
              <span className="font-bold text-amber-600 font-mono">₹{perKmRate}/km</span>
            </div>
            <input
              type="range"
              min="8"
              max="25"
              step="1"
              value={perKmRate}
              onChange={(e) => setPerKmRate(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Platform Commission */}
          <div>
            <div className="flex justify-between items-center mb-1 text-xs">
              <span className="font-semibold text-slate-700">Platform Commission %</span>
              <span className="font-bold text-emerald-600 font-mono">{commissionPercent}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="30"
              step="1"
              value={commissionPercent}
              onChange={(e) => setCommissionPercent(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Captain receives {100 - commissionPercent}% of total trip fare.
            </p>
          </div>

          {/* Route Simulation Results */}
          <div className="pt-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Route Simulation Outputs
            </h4>
            <div className="space-y-3">
              {routes.map((r) => {
                const res = calculateFare({
                  distanceKm: r.distance,
                  durationMinutes: r.duration,
                  baseFare,
                  baseIncludedKm,
                  perKmRate,
                  perMinuteRate,
                  commissionPercent,
                });

                return (
                  <div
                    key={r.name}
                    className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">{r.name}</span>
                      <span className="text-sm font-black text-amber-600 font-mono">
                        ₹{res.totalFare}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>{r.distance} km • {r.duration} mins</span>
                      <span className="font-semibold text-emerald-700">
                        Driver Earns: ₹{res.captainEarnings}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden flex">
                      <div
                        style={{ width: `${100 - commissionPercent}%` }}
                        className="bg-emerald-500 h-full"
                      />
                      <div
                        style={{ width: `${commissionPercent}%` }}
                        className="bg-amber-500 h-full"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500">Zone: Majuli Island District</span>
          <button
            onClick={() => {
              alert('Fare configuration updated for Majuli Service Area!');
              onClose();
            }}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 flex items-center gap-1.5"
          >
            <span>Save to Zone Rules</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
