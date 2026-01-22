/**
 * DemoRunner Component
 *
 * Zeigt den Execution Log und die Evaluation an.
 * Die Demo-Steuerung ist jetzt in einem separaten Modal.
 */

'use client';

import { useCallback, useRef, useImperativeHandle, forwardRef } from 'react';
import { PipelineEvent, CandidateReport, SystemVersion } from '@/lib/types';
import {
  generateMockEvents,
  getEventDelays,
  VERSION_CANDIDATE_REPORTS,
} from '@/lib/mockData';
import { EvaluationCard } from './EvaluationCard';
import { MVPLimitations } from './MVPLimitations';
import { TwoMonthEnhancements } from './TwoMonthEnhancements';
import { FourMonthEnhancements } from './FourMonthEnhancements';

export type DemoPhase = 'idle' | 'running' | 'completed';

export interface DemoRunnerRef {
  startDemo: () => void;
  resetDemo: () => void;
}

interface DemoRunnerProps {
  version: SystemVersion;
  phase: DemoPhase;
  setPhase: (phase: DemoPhase) => void;
  events: PipelineEvent[];
  setEvents: (events: PipelineEvent[]) => void;
  currentEventIndex: number;
  setCurrentEventIndex: (index: number) => void;
  report: CandidateReport | null;
  setReport: (report: CandidateReport | null) => void;
}

export const DemoRunner = forwardRef<DemoRunnerRef, DemoRunnerProps>(function DemoRunner(
  {
    version,
    phase,
    setPhase,
    events,
    setEvents,
    currentEventIndex,
    setCurrentEventIndex,
    report,
    setReport,
  },
  ref
) {
  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);

  const startDemo = useCallback(() => {
    setPhase('running');
    setCurrentEventIndex(-1);
    setReport(null);

    // Generate version-specific events
    const newEvents = generateMockEvents(version);
    setEvents(newEvents);

    const delays = getEventDelays(version);

    timeoutRefs.current.forEach(clearTimeout);
    timeoutRefs.current = [];

    let cumulativeDelay = 0;
    newEvents.forEach((_, index) => {
      cumulativeDelay += delays[index];

      const timeoutId = setTimeout(() => {
        setEvents(
          newEvents.map((e, i) =>
            i === index ? { ...e, timestamp: new Date() } : e
          )
        );

        setCurrentEventIndex(index);

        if (index === newEvents.length - 1) {
          setTimeout(() => {
            setPhase('completed');
            // Use version-specific report
            setReport(VERSION_CANDIDATE_REPORTS[version]);
          }, 500);
        }
      }, cumulativeDelay);

      timeoutRefs.current.push(timeoutId);
    });
  }, [version, setPhase, setCurrentEventIndex, setReport, setEvents]);

  const resetDemo = useCallback(() => {
    timeoutRefs.current.forEach(clearTimeout);
    timeoutRefs.current = [];

    setPhase('idle');
    setEvents([]);
    setCurrentEventIndex(-1);
    setReport(null);
  }, [setPhase, setEvents, setCurrentEventIndex, setReport]);

  useImperativeHandle(ref, () => ({
    startDemo,
    resetDemo,
  }));

  return (
    <div className="space-y-6">
      {/* Evaluation Card - shown when completed */}
      {phase === 'completed' && report && (
        <EvaluationCard
          report={report}
          isVisible={true}
          version={version}
        />
      )}

      {/* Idle State Message */}
      {phase === 'idle' && (
        <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center">
          <div className="text-5xl mb-4 opacity-30">🎯</div>
          <h3 className="text-lg font-medium text-slate-600 mb-2">
            Bereit für die Demo
          </h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Klicke oben auf &quot;Demo starten&quot; um das Interview-System zu sehen.
            Die Evaluation erscheint hier nach Abschluss.
          </p>
        </div>
      )}

      {/* Running State Message */}
      {phase === 'running' && (
        <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center">
          <div className="text-5xl mb-4 animate-pulse">⏳</div>
          <h3 className="text-lg font-medium text-slate-600 mb-2">
            Interview läuft...
          </h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Sieh dir den Execution Log im Demo-Popup an.
            Die Evaluation erscheint hier nach Abschluss.
          </p>
        </div>
      )}

      {/* Version-specific enhancements */}
      <VersionEnhancements version={version} />
    </div>
  );
});

function VersionEnhancements({ version }: { version: SystemVersion }) {
  return (
    <div className="mt-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold px-2">
          {version === 'mvp' && 'MVP Scope'}
          {version === '2-month' && 'Production Capabilities'}
          {version === '4-month' && 'Enterprise Capabilities'}
        </span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      {version === 'mvp' && <MVPLimitations />}
      {version === '2-month' && <TwoMonthEnhancements />}
      {version === '4-month' && (
        <>
          <TwoMonthEnhancements />
          <div className="mt-4">
            <FourMonthEnhancements />
          </div>
        </>
      )}
    </div>
  );
}

