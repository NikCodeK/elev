/**
 * DemoControlModal Component
 *
 * Popup für die Demo-Steuerung mit integriertem Execution Log.
 */

'use client';

import { Modal } from './Modal';
import { ExecutionLog } from './ExecutionLog';
import { PipelineEvent } from '@/lib/types';

type DemoPhase = 'idle' | 'running' | 'completed';

interface DemoControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  phase: DemoPhase;
  currentEventIndex: number;
  totalEvents: number;
  events: PipelineEvent[];
  onStart: () => void;
  onReset: () => void;
}

export function DemoControlModal({
  isOpen,
  onClose,
  phase,
  currentEventIndex,
  totalEvents,
  events,
  onStart,
  onReset,
}: DemoControlModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Demo Control" size="large">
      <div className="space-y-4">
        {/* Status & Actions Row */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <PhaseIndicator phase={phase} />
            <div>
              <div className="text-sm font-medium text-slate-700">
                {phase === 'idle' && 'Bereit zum Starten'}
                {phase === 'running' && 'Interview läuft...'}
                {phase === 'completed' && 'Interview abgeschlossen'}
              </div>
              {phase !== 'idle' && (
                <div className="text-xs text-slate-500">
                  {currentEventIndex + 1} / {totalEvents} Events
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            {phase === 'idle' && (
              <button
                onClick={onStart}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2 shadow-sm"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Starten
              </button>
            )}

            {phase === 'running' && (
              <div className="px-4 py-2 bg-slate-100 text-slate-400 text-sm font-medium rounded-lg flex items-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Läuft...
              </div>
            )}

            {phase === 'completed' && (
              <button
                onClick={onReset}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Neu starten
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {phase !== 'idle' && (
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                phase === 'completed' ? 'bg-emerald-500' : 'bg-blue-500'
              }`}
              style={{
                width: `${totalEvents > 0 ? ((currentEventIndex + 1) / totalEvents) * 100 : 0}%`,
              }}
            />
          </div>
        )}

        {/* Execution Log */}
        {phase === 'idle' ? (
          <div className="bg-slate-50 rounded-xl p-8 border border-slate-200 text-center">
            <div className="text-4xl mb-3 opacity-40">📋</div>
            <p className="text-sm text-slate-500">
              Klicke auf &quot;Starten&quot; um den Interview-Flow zu sehen
            </p>
          </div>
        ) : (
          <div className="max-h-[400px] overflow-y-auto">
            <ExecutionLog
              events={events}
              currentEventIndex={currentEventIndex}
            />
          </div>
        )}

        {/* Footer Info */}
        {phase !== 'idle' && (
          <div className="text-xs text-slate-400 text-center pt-2 border-t border-slate-100">
            Klicke auf Events für technische Details
          </div>
        )}
      </div>
    </Modal>
  );
}

function PhaseIndicator({ phase }: { phase: DemoPhase }) {
  const config = {
    idle: { color: 'bg-slate-400', text: 'Bereit', textColor: 'text-slate-600' },
    running: { color: 'bg-blue-500 animate-pulse', text: 'Aktiv', textColor: 'text-blue-600' },
    completed: { color: 'bg-emerald-500', text: 'Fertig', textColor: 'text-emerald-600' },
  };

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
      phase === 'idle' ? 'bg-slate-100' : phase === 'running' ? 'bg-blue-50' : 'bg-emerald-50'
    }`}>
      <div className={`w-2.5 h-2.5 rounded-full ${config[phase].color}`} />
      <span className={`text-sm font-medium ${config[phase].textColor}`}>
        {config[phase].text}
      </span>
    </div>
  );
}
