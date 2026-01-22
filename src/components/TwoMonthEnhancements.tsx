/**
 * TwoMonthEnhancements Component
 *
 * Shows the capabilities added in the 2-month production-ready version.
 * Answers the question: "Can we rely on it?"
 */

'use client';

import { MOCK_INTERVIEW_HISTORY } from '@/lib/mockData';
import { InterviewHistoryEntry } from '@/lib/types';

export function TwoMonthEnhancements() {
  return (
    <div className="space-y-4">
      <PersistenceIndicators />
      <StabilityLayer />
      <InterviewHistory entries={MOCK_INTERVIEW_HISTORY} />
      <EvaluationHardening />
    </div>
  );
}

function PersistenceIndicators() {
  const indicators = [
    { label: 'Execution Logs', status: 'stored', icon: '📋' },
    { label: 'Transcripts', status: 'stored', icon: '📝' },
    { label: 'Evaluations', status: 'stored', icon: '📊' },
    { label: 'Candidate Data', status: 'stored', icon: '👤' },
  ];

  return (
    <div className="bg-blue-50 rounded-2xl p-5 border border-blue-200">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 bg-blue-500 rounded-full" />
        <h3 className="text-sm font-semibold text-blue-700 uppercase tracking-wide">
          Persistence Layer
        </h3>
        <span className="text-xs text-blue-500 ml-auto font-mono bg-blue-100 px-2 py-0.5 rounded">PostgreSQL</span>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {indicators.map((item) => (
          <div
            key={item.label}
            className="text-center p-3 bg-white rounded-xl border border-blue-100"
          >
            <div className="text-2xl mb-1">{item.icon}</div>
            <div className="text-xs text-slate-600 font-medium">{item.label}</div>
            <div className="text-xs text-emerald-600 font-mono mt-1 bg-emerald-50 rounded px-1.5 py-0.5 inline-block">
              {item.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StabilityLayer() {
  const states = [
    { state: 'pending', color: 'bg-slate-400' },
    { state: 'running', color: 'bg-blue-500' },
    { state: 'completed', color: 'bg-emerald-500' },
    { state: 'failed', color: 'bg-red-500' },
    { state: 'retrying', color: 'bg-amber-500' },
  ];

  return (
    <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-200">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 bg-emerald-500 rounded-full" />
        <h3 className="text-sm font-semibold text-emerald-700 uppercase tracking-wide">
          Stability Layer
        </h3>
        <span className="text-xs text-emerald-500 ml-auto font-mono bg-emerald-100 px-2 py-0.5 rounded">Bull Queue</span>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {states.map((item) => (
          <div
            key={item.state}
            className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-emerald-100 text-xs"
          >
            <div className={`w-2 h-2 rounded-full ${item.color}`} />
            <span className="text-slate-600 font-mono">{item.state}</span>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl p-4 border border-emerald-100">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-slate-500">Retry Policy</span>
          <span className="text-slate-700 font-mono">3 attempts, exponential backoff</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Dead Letter Queue</span>
          <span className="text-emerald-600 font-mono">enabled</span>
        </div>
      </div>
    </div>
  );
}

function InterviewHistory({ entries }: { entries: InterviewHistoryEntry[] }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 bg-purple-500 rounded-full" />
        <h3 className="text-sm font-semibold text-purple-700 uppercase tracking-wide">
          Interview History
        </h3>
        <span className="text-xs text-slate-400 ml-auto">{entries.length} records</span>
      </div>

      <div className="space-y-2">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100"
          >
            <div className="flex items-center gap-3">
              <StatusDot status={entry.status} />
              <div>
                <div className="text-sm font-medium text-slate-800">{entry.candidateName}</div>
                <div className="text-xs text-slate-500">{entry.position}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-400">{entry.date}</div>
              {entry.recommendation && (
                <RecommendationPill recommendation={entry.recommendation} />
              )}
              {entry.status === 'failed' && (
                <span className="text-xs text-red-500 font-mono">failed</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusDot({ status }: { status: string }) {
  const colors = {
    completed: 'bg-emerald-500',
    failed: 'bg-red-500',
    in_progress: 'bg-blue-500 animate-pulse',
  };
  return (
    <div className={`w-2.5 h-2.5 rounded-full ${colors[status as keyof typeof colors] || 'bg-slate-400'}`} />
  );
}

function RecommendationPill({ recommendation }: { recommendation: string }) {
  const colors = {
    Hire: 'text-emerald-600 bg-emerald-50',
    Maybe: 'text-amber-600 bg-amber-50',
    'No Hire': 'text-red-600 bg-red-50',
  };
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded ${colors[recommendation as keyof typeof colors]}`}>
      {recommendation}
    </span>
  );
}

function EvaluationHardening() {
  return (
    <div className="bg-pink-50 rounded-2xl p-5 border border-pink-200">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 bg-pink-500 rounded-full" />
        <h3 className="text-sm font-semibold text-pink-700 uppercase tracking-wide">
          Evaluation Hardening
        </h3>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 bg-white rounded-xl border border-pink-100 text-center">
          <div className="text-xs text-slate-500 mb-1">Confidence Score</div>
          <div className="text-2xl font-bold text-slate-800">85%</div>
          <div className="text-[10px] text-slate-400 mt-1">Based on response completeness</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-pink-100 text-center">
          <div className="text-xs text-slate-500 mb-1">Missing Answers</div>
          <div className="text-2xl font-bold text-emerald-600">0 / 3</div>
          <div className="text-[10px] text-slate-400 mt-1">All questions answered</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-pink-100 text-center">
          <div className="text-xs text-slate-500 mb-1">Rubric Version</div>
          <div className="text-2xl font-bold text-blue-600 font-mono">v2.3</div>
          <div className="text-[10px] text-slate-400 mt-1">Role: Backend Engineer</div>
        </div>
      </div>
    </div>
  );
}
