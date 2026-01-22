/**
 * VersionDemo Component
 *
 * Zeigt eine einzelne Version der Demo (MVP, 2-Month, oder 4-Month)
 * mit Execution Log und Evaluation.
 */

'use client';

import { PipelineEvent, CandidateReport, SystemVersion } from '@/lib/types';
import { ExecutionLog } from './ExecutionLog';
import { VERSION_INFO } from '@/lib/mockData';

export type DemoPhase = 'idle' | 'running' | 'completed';

interface VersionDemoProps {
  version: SystemVersion;
  phase: DemoPhase;
  events: PipelineEvent[];
  currentEventIndex: number;
  report: CandidateReport | null;
}

const VERSION_COLORS: Record<SystemVersion, { bg: string; border: string; text: string; badge: string }> = {
  mvp: {
    bg: 'bg-slate-50',
    border: 'border-slate-200',
    text: 'text-slate-600',
    badge: 'bg-slate-200 text-slate-700',
  },
  '2-month': {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-600',
    badge: 'bg-blue-200 text-blue-700',
  },
  '4-month': {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-600',
    badge: 'bg-purple-200 text-purple-700',
  },
};

export function VersionDemo({
  version,
  phase,
  events,
  currentEventIndex,
  report,
}: VersionDemoProps) {
  const colors = VERSION_COLORS[version];
  const info = VERSION_INFO[version];

  return (
    <div className={`rounded-2xl border-2 ${colors.border} overflow-hidden`}>
      {/* Header */}
      <div className={`${colors.bg} px-4 py-3 border-b ${colors.border}`}>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${colors.badge}`}>
                {info.label}
              </span>
              {phase === 'running' && (
                <span className="flex items-center gap-1 text-xs text-blue-600">
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  Läuft...
                </span>
              )}
              {phase === 'completed' && (
                <span className="flex items-center gap-1 text-xs text-emerald-600">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Fertig
                </span>
              )}
            </div>
            <p className={`text-xs ${colors.text} mt-0.5`}>{info.tagline}</p>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-slate-700">{events.length}</div>
            <div className="text-[10px] text-slate-400 uppercase">Events</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white">
        {phase === 'idle' ? (
          <div className="p-6 text-center">
            <div className="text-3xl mb-2 opacity-30">⏸️</div>
            <p className="text-xs text-slate-400">Wartet auf Start</p>
          </div>
        ) : (
          <div className="max-h-[500px] overflow-y-auto">
            <ExecutionLog
              events={events}
              currentEventIndex={currentEventIndex}
              compact={true}
            />
          </div>
        )}
      </div>

      {/* Evaluation Summary */}
      {phase === 'completed' && report && (
        <div className={`${colors.bg} px-4 py-3 border-t ${colors.border}`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500 uppercase">Empfehlung</div>
              <div className={`font-bold ${
                report.recommendation === 'Strong Hire' ? 'text-emerald-600' :
                report.recommendation === 'Hire' ? 'text-emerald-600' :
                report.recommendation === 'Maybe' ? 'text-amber-600' :
                'text-red-600'
              }`}>
                {report.recommendation}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500 uppercase">Confidence</div>
              <div className="font-bold text-slate-700">{report.confidence}%</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500 uppercase">Avg Score</div>
              <div className="font-bold text-slate-700">
                {(Object.values(report.scores).reduce((a, b) => a + b, 0) / 5).toFixed(1)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
