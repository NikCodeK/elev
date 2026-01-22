/**
 * FourMonthEnhancements Component
 *
 * Shows the capabilities added in the 4-month enterprise-ready version.
 * Answers the question: "Can we trust it at scale?"
 */

'use client';

import { MOCK_AUDIT_LOG, MOCK_SYSTEM_METRICS, EVALUATION_VERSIONS } from '@/lib/mockData';

export function FourMonthEnhancements() {
  return (
    <div className="space-y-4">
      <GovernancePanel />
      <ScaleOperationsPanel />
    </div>
  );
}

function GovernancePanel() {
  return (
    <div className="bg-purple-50 rounded-2xl p-5 border border-purple-200">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 bg-purple-500 rounded-full" />
        <h3 className="text-sm font-semibold text-purple-700 uppercase tracking-wide">
          Governance & Trust
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Audit Log */}
        <div className="bg-white rounded-xl p-4 border border-purple-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-500 font-semibold uppercase">Audit Log</span>
            <span className="text-[10px] text-purple-500 font-mono bg-purple-50 px-2 py-0.5 rounded">immutable</span>
          </div>

          <div className="space-y-2 max-h-40 overflow-y-auto">
            {MOCK_AUDIT_LOG.map((entry) => (
              <div key={entry.id} className="text-xs p-2 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-blue-600 font-mono font-medium">{entry.action}</span>
                  <span className="text-slate-400">{entry.timestamp.toLocaleTimeString()}</span>
                </div>
                <div className="text-slate-500">
                  <span className="text-slate-600">{entry.actor}</span>
                  {' → '}
                  <span>{entry.resource}</span>
                </div>
                {entry.details && (
                  <div className="text-slate-400 mt-1 italic">{entry.details}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Version Documentation */}
        <div className="bg-white rounded-xl p-4 border border-purple-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-500 font-semibold uppercase">Aktive Version-Dokumentation</span>
          </div>

          <div className="space-y-2">
            {EVALUATION_VERSIONS.map((version) => (
              <div
                key={version.version}
                className={`text-xs p-3 rounded-lg border ${
                  version.status === 'active'
                    ? 'bg-emerald-50 border-emerald-200'
                    : 'bg-slate-50 border-slate-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-mono font-bold ${
                    version.status === 'active' ? 'text-emerald-600' : 'text-slate-400'
                  }`}>
                    {version.version}
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                    version.status === 'active'
                      ? 'bg-emerald-100 text-emerald-600'
                      : 'bg-slate-100 text-slate-400'
                  }`}>
                    {version.status}
                  </span>
                </div>
                <div className="text-slate-500 mt-1">{version.changes}</div>
                <div className="text-slate-400 text-[10px] mt-1">{version.date}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ScaleOperationsPanel() {
  const metrics = MOCK_SYSTEM_METRICS;

  return (
    <div className="bg-cyan-50 rounded-2xl p-5 border border-cyan-200">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 bg-cyan-500 rounded-full" />
        <h3 className="text-sm font-semibold text-cyan-700 uppercase tracking-wide">
          Scale & Operations
        </h3>
        <span className="text-xs text-cyan-500 ml-auto font-mono bg-cyan-100 px-2 py-0.5 rounded">Kubernetes + Prometheus</span>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-4">
        <MetricCard label="Avg Latency" value={`${metrics.avgLatencyMs}ms`} status="good" threshold="<500ms" />
        <MetricCard label="Completion Rate" value={`${metrics.completionRate}%`} status="good" threshold=">90%" />
        <MetricCard label="Interviews Today" value={metrics.interviewsToday.toString()} status="neutral" />
        <MetricCard label="Queue Depth" value={metrics.queueDepth.toString()} status={metrics.queueDepth > 10 ? 'warning' : 'good'} threshold="<10" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-white rounded-xl border border-cyan-100">
          <div className="text-xs text-slate-500 mb-3 font-medium">Active Monitors</div>
          <div className="space-y-2">
            {['API Response Time', 'Error Rate', 'Queue Backlog', 'LLM Latency'].map((monitor) => (
              <div key={monitor} className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-slate-600">{monitor}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-cyan-100">
          <div className="text-xs text-slate-500 mb-3 font-medium">Alert Channels</div>
          <div className="space-y-2">
            {[
              { name: 'PagerDuty', status: 'active' },
              { name: 'Slack #ops', status: 'active' },
              { name: 'Email', status: 'active' },
            ].map((channel) => (
              <div key={channel.name} className="flex items-center justify-between text-sm">
                <span className="text-slate-600">{channel.name}</span>
                <span className="text-emerald-600 font-mono text-[10px] bg-emerald-50 px-1.5 py-0.5 rounded">{channel.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  status,
  threshold,
}: {
  label: string;
  value: string;
  status: 'good' | 'warning' | 'critical' | 'neutral';
  threshold?: string;
}) {
  const statusColors = {
    good: 'text-emerald-600',
    warning: 'text-amber-600',
    critical: 'text-red-600',
    neutral: 'text-slate-800',
  };

  return (
    <div className="p-3 bg-white rounded-xl border border-cyan-100 text-center">
      <div className="text-[10px] text-slate-500 mb-1">{label}</div>
      <div className={`text-xl font-bold font-mono ${statusColors[status]}`}>{value}</div>
      {threshold && <div className="text-[10px] text-slate-400 mt-1">target: {threshold}</div>}
    </div>
  );
}
