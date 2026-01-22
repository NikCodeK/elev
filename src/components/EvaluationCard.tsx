/**
 * EvaluationCard Component
 *
 * Displays the AI-generated candidate evaluation report in a clear,
 * structured format. Shows scores, summary, strengths, risks, and
 * the final hiring recommendation.
 *
 * PRODUCTION vs DEMO MAPPING:
 * ---------------------------
 * In production:
 * - This data would come from an LLM (Claude/GPT) analyzing the interview transcript
 * - The prompt would include rubrics and evaluation criteria
 * - Results would be stored in a database and linked to the candidate record
 * - Scores would be calibrated based on historical data
 *
 * In this demo:
 * - All data is mocked but structured realistically
 * - Shows what the actual output format would look like
 */

'use client';

import { CandidateReport, CandidateScores, SystemVersion } from '@/lib/types';

interface EvaluationCardProps {
  report: CandidateReport;
  isVisible: boolean;
  version?: SystemVersion;
}

// Version-specific evaluation metadata
const EVALUATION_META: Record<SystemVersion, { label: string; description: string; color: string }> = {
  mvp: {
    label: 'Basic Evaluation',
    description: 'Single-model analysis without calibration',
    color: 'bg-slate-100 text-slate-600 border-slate-200',
  },
  '2-month': {
    label: 'Production Evaluation',
    description: 'Rubric v2.3 • Persisted • Quality-scored',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  '4-month': {
    label: 'Enterprise Evaluation',
    description: 'Multi-model consensus • Calibrated against 847 interviews',
    color: 'bg-purple-100 text-purple-700 border-purple-200',
  },
};

export function EvaluationCard({ report, isVisible, version = 'mvp' }: EvaluationCardProps) {
  if (!isVisible) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm opacity-60">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-3 h-3 bg-slate-300 rounded-full" />
          <h2 className="text-lg font-semibold text-slate-400">
            Candidate Evaluation
          </h2>
        </div>
        <div className="text-center py-16 text-slate-400">
          <div className="text-4xl mb-3 opacity-30">📊</div>
          <p className="text-sm">Evaluation will appear after pipeline completes</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-emerald-500 rounded-full" />
          <h2 className="text-lg font-semibold text-slate-900">
            Candidate Evaluation
          </h2>
        </div>
        <RecommendationBadge recommendation={report.recommendation} />
      </div>

      {/* Version Badge */}
      <div className={`rounded-lg px-3 py-2 mb-6 border ${EVALUATION_META[version].color}`}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{EVALUATION_META[version].label}</span>
          <span className="text-xs opacity-75">{EVALUATION_META[version].description}</span>
        </div>
      </div>

      {/* Candidate Info */}
      <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-100">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-slate-500">Candidate:</span>
            <span className="ml-2 text-slate-900 font-medium">
              {report.candidate_name}
            </span>
          </div>
          <div>
            <span className="text-slate-500">Position:</span>
            <span className="ml-2 text-slate-900">{report.position}</span>
          </div>
          <div>
            <span className="text-slate-500">Date:</span>
            <span className="ml-2 text-slate-900">{report.interview_date}</span>
          </div>
          <div>
            <span className="text-slate-500">Duration:</span>
            <span className="ml-2 text-slate-900">{report.duration_minutes} min</span>
          </div>
        </div>
      </div>

      {/* Scores Section */}
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-slate-500 mb-3 uppercase tracking-wide">
          Scores
        </h3>
        <ScoresGrid scores={report.scores} />
      </div>

      {/* Summary Section */}
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-slate-500 mb-3 uppercase tracking-wide">
          Summary
        </h3>
        <ul className="space-y-2">
          {report.summary.map((point, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
              <span className="text-blue-500 mt-0.5">•</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Strengths & Risks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Strengths */}
        <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
          <h3 className="text-xs font-semibold text-emerald-700 mb-3 flex items-center gap-2 uppercase tracking-wide">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Strengths
          </h3>
          <ul className="space-y-2">
            {report.strengths.map((item, i) => (
              <li key={i} className="text-sm text-slate-700">
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Risks */}
        <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
          <h3 className="text-xs font-semibold text-amber-700 mb-3 flex items-center gap-2 uppercase tracking-wide">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Risks
          </h3>
          <ul className="space-y-2">
            {report.risks.map((item, i) => (
              <li key={i} className="text-sm text-slate-700">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Confidence Score */}
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">AI Confidence</span>
          <span className="text-sm font-mono font-semibold text-slate-900">{report.confidence}%</span>
        </div>
        <div className="mt-2 h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-1000"
            style={{ width: `${report.confidence}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-slate-500">
          {version === 'mvp' && 'Based on single-model response analysis'}
          {version === '2-month' && 'Based on response quality, completeness, and rubric alignment'}
          {version === '4-month' && 'Multi-model consensus calibrated against historical hiring outcomes'}
        </p>
      </div>

      {/* JSON Preview Toggle - for technical interviewers */}
      <details className="mt-6">
        <summary className="cursor-pointer text-xs text-slate-400 hover:text-slate-600 transition-colors">
          View raw JSON (for technical review)
        </summary>
        <pre className="mt-2 p-4 bg-slate-900 text-slate-100 rounded-xl text-xs overflow-x-auto font-mono">
          {JSON.stringify(report, null, 2)}
        </pre>
      </details>
    </div>
  );
}

// Scores grid component
function ScoresGrid({ scores }: { scores: CandidateScores }) {
  const scoreEntries = [
    { key: 'communication', label: 'Communication' },
    { key: 'experience', label: 'Experience' },
    { key: 'motivation', label: 'Motivation' },
    { key: 'problem_solving', label: 'Problem Solving' },
    { key: 'culture_fit', label: 'Culture Fit' },
  ] as const;

  return (
    <div className="grid grid-cols-5 gap-2">
      {scoreEntries.map(({ key, label }) => (
        <ScoreCard key={key} label={label} score={scores[key]} />
      ))}
    </div>
  );
}

// Individual score card
function ScoreCard({ label, score }: { label: string; score: number }) {
  const getScoreColor = (score: number): string => {
    if (score >= 8) return 'text-emerald-600';
    if (score >= 6) return 'text-amber-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number): string => {
    if (score >= 8) return 'bg-emerald-50 border-emerald-100';
    if (score >= 6) return 'bg-amber-50 border-amber-100';
    return 'bg-red-50 border-red-100';
  };

  return (
    <div className={`rounded-xl p-3 text-center border ${getScoreBg(score)}`}>
      <div className={`text-2xl font-bold ${getScoreColor(score)}`}>
        {score}
      </div>
      <div className="text-[10px] text-slate-500 mt-1 leading-tight">{label}</div>
    </div>
  );
}

// Recommendation badge
function RecommendationBadge({
  recommendation,
}: {
  recommendation: string;
}) {
  const styles: Record<string, string> = {
    'Strong Hire': 'bg-emerald-200 text-emerald-800 border-emerald-300',
    Hire: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    Maybe: 'bg-amber-100 text-amber-700 border-amber-200',
    'No Hire': 'bg-red-100 text-red-700 border-red-200',
  };

  return (
    <span className={`
      px-3 py-1.5 rounded-full text-sm font-semibold border
      ${styles[recommendation] || styles['Maybe']}
    `}>
      {recommendation}
    </span>
  );
}
