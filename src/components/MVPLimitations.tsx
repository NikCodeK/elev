/**
 * MVPLimitations Component
 *
 * Explicitly communicates what the MVP does NOT handle.
 * This transparency shows system thinking and sets expectations.
 */

'use client';

import { MVP_LIMITATIONS } from '@/lib/mockData';

export function MVPLimitations() {
  return (
    <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 bg-amber-500 rounded-full" />
        <h3 className="text-sm font-semibold text-amber-700 uppercase tracking-wide">
          MVP Limitations
        </h3>
      </div>

      <p className="text-sm text-amber-800 mb-4">
        Das MVP zeigt den Core-Flow. Folgende Aspekte werden bewusst auf spätere Versionen verschoben:
      </p>

      {/* Limitations grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {MVP_LIMITATIONS.map((limitation) => (
          <div
            key={limitation.id}
            className="flex items-start gap-3 p-3 bg-white rounded-xl border border-amber-100"
          >
            <span className="text-xl">{limitation.icon}</span>
            <div>
              <div className="text-sm font-medium text-slate-800">
                {limitation.title}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                {limitation.description}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <div className="mt-4 pt-3 border-t border-amber-200">
        <p className="text-xs text-amber-700 italic">
          Diese Limitierungen werden in der 2-Monats- und 4-Monats-Version adressiert.
          Wechsle die Tabs oben um die Evolution zu sehen.
        </p>
      </div>
    </div>
  );
}
