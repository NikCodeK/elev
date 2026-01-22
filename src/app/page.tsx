/**
 * AI Interview Automation Demo - Main Page
 *
 * Zeigt alle drei System-Versionen (MVP, 2-Month, 4-Month) gleichzeitig
 * um die Evolution des Systems zu demonstrieren.
 */

'use client';

import { useState, useRef, useCallback } from 'react';
import { SystemVersion, PipelineEvent, CandidateReport } from '@/lib/types';
import { generateMockEvents, getEventDelays, VERSION_CANDIDATE_REPORTS } from '@/lib/mockData';
import { VersionDemo, DemoPhase } from '@/components/VersionDemo';
import { VersionExplanation } from '@/components/VersionExplanation';
import { MVPLimitations } from '@/components/MVPLimitations';
import { TwoMonthEnhancements } from '@/components/TwoMonthEnhancements';
import { FourMonthEnhancements } from '@/components/FourMonthEnhancements';

// State für eine einzelne Version
interface VersionState {
  phase: DemoPhase;
  events: PipelineEvent[];
  currentEventIndex: number;
  report: CandidateReport | null;
}

const VERSIONS: SystemVersion[] = ['mvp', '2-month', '4-month'];

export default function Home() {
  // State für alle drei Versionen
  const [versionStates, setVersionStates] = useState<Record<SystemVersion, VersionState>>({
    mvp: { phase: 'idle', events: [], currentEventIndex: -1, report: null },
    '2-month': { phase: 'idle', events: [], currentEventIndex: -1, report: null },
    '4-month': { phase: 'idle', events: [], currentEventIndex: -1, report: null },
  });

  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);

  const isAnyRunning = VERSIONS.some(v => versionStates[v].phase === 'running');
  const allCompleted = VERSIONS.every(v => versionStates[v].phase === 'completed');
  const isIdle = VERSIONS.every(v => versionStates[v].phase === 'idle');

  // Startet alle drei Demos gleichzeitig
  const startAllDemos = useCallback(() => {
    // Clear existing timeouts
    timeoutRefs.current.forEach(clearTimeout);
    timeoutRefs.current = [];

    // Initialize all versions
    const newStates: Record<SystemVersion, VersionState> = {
      mvp: { phase: 'running', events: generateMockEvents('mvp'), currentEventIndex: -1, report: null },
      '2-month': { phase: 'running', events: generateMockEvents('2-month'), currentEventIndex: -1, report: null },
      '4-month': { phase: 'running', events: generateMockEvents('4-month'), currentEventIndex: -1, report: null },
    };
    setVersionStates(newStates);

    // Run each version's demo
    VERSIONS.forEach(version => {
      const events = newStates[version].events;
      const delays = getEventDelays(version);

      let cumulativeDelay = 0;
      events.forEach((_, index) => {
        cumulativeDelay += delays[index];

        const timeoutId = setTimeout(() => {
          setVersionStates(prev => ({
            ...prev,
            [version]: {
              ...prev[version],
              events: prev[version].events.map((e, i) =>
                i === index ? { ...e, timestamp: new Date() } : e
              ),
              currentEventIndex: index,
            },
          }));

          // Complete demo after last event
          if (index === events.length - 1) {
            const completeTimeout = setTimeout(() => {
              setVersionStates(prev => ({
                ...prev,
                [version]: {
                  ...prev[version],
                  phase: 'completed',
                  report: VERSION_CANDIDATE_REPORTS[version],
                },
              }));
            }, 500);
            timeoutRefs.current.push(completeTimeout);
          }
        }, cumulativeDelay);

        timeoutRefs.current.push(timeoutId);
      });
    });
  }, []);

  // Reset alle Demos
  const resetAllDemos = useCallback(() => {
    timeoutRefs.current.forEach(clearTimeout);
    timeoutRefs.current = [];

    setVersionStates({
      mvp: { phase: 'idle', events: [], currentEventIndex: -1, report: null },
      '2-month': { phase: 'idle', events: [], currentEventIndex: -1, report: null },
      '4-month': { phase: 'idle', events: [], currentEventIndex: -1, report: null },
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-sm">
                AI
              </div>
              <div>
                <span className="font-semibold text-slate-900 text-lg">Interview Automation</span>
                <p className="text-xs text-slate-500">System Evolution Demo</p>
              </div>
            </div>

            {/* Demo Controls */}
            <div className="flex items-center gap-3">
              {isAnyRunning && (
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  Demo läuft...
                </div>
              )}

              {isIdle && (
                <button
                  onClick={startAllDemos}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors flex items-center gap-2 shadow-sm"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Demo starten
                </button>
              )}

              {allCompleted && (
                <button
                  onClick={resetAllDemos}
                  className="px-5 py-2.5 bg-slate-600 hover:bg-slate-700 text-white font-medium rounded-xl transition-colors flex items-center gap-2 shadow-sm"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Nochmal starten
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Automated Interview Pipeline
          </h1>
          <p className="text-slate-600 max-w-3xl mb-6">
            Sieh wie dasselbe Interview-System durch drei Reifestufen evolviert.
            Der Core-Flow bleibt identisch - nur die operativen Garantien und Capabilities steigen.
            <span className="text-blue-600 font-medium"> Klicke auf Events für technische Details.</span>
          </p>

          {/* Architecture Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <ArchitectureCard
              step={1}
              title="Voice Call"
              description="Vapi Agent führt Interview"
              icon="📞"
            />
            <ArchitectureCard
              step={2}
              title="Transkription"
              description="Echtzeit Speech-to-Text"
              icon="📝"
            />
            <ArchitectureCard
              step={3}
              title="AI Analyse"
              description="LLM bewertet Antworten"
              icon="🤖"
            />
            <ArchitectureCard
              step={4}
              title="Notification"
              description="Team via Slack informiert"
              icon="📨"
            />
          </div>
        </div>
      </section>

      {/* Three-Column Demo Grid */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {VERSIONS.map(version => (
            <div key={version}>
              {/* Version Explanation */}
              <VersionExplanation version={version} />

              {/* Demo Runner */}
              <VersionDemo
                version={version}
                phase={versionStates[version].phase}
                events={versionStates[version].events}
                currentEventIndex={versionStates[version].currentEventIndex}
                report={versionStates[version].report}
              />
            </div>
          ))}
        </div>

        {/* Version-specific Details */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* MVP Limitations */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold px-2">
                MVP Scope
              </span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>
            <MVPLimitations />
          </div>

          {/* 2-Month Enhancements */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1 bg-blue-200" />
              <span className="text-xs text-blue-500 uppercase tracking-wider font-semibold px-2">
                Production Capabilities
              </span>
              <div className="h-px flex-1 bg-blue-200" />
            </div>
            <TwoMonthEnhancements />
          </div>

          {/* 4-Month Enhancements */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1 bg-purple-200" />
              <span className="text-xs text-purple-500 uppercase tracking-wider font-semibold px-2">
                Enterprise Capabilities
              </span>
              <div className="h-px flex-1 bg-purple-200" />
            </div>
            <FourMonthEnhancements />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-8">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-4">
              <span>AI Interview Automation Demo</span>
              <span className="text-slate-300">|</span>
              <span className="font-mono">Next.js + React + Tailwind</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Klicke auf Events für technische Details</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ArchitectureCard({
  step,
  title,
  description,
  icon,
}: {
  step: number;
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 relative group hover:border-blue-300 hover:bg-blue-50/30 transition-all">
      {/* Step number */}
      <div className="absolute -top-2 -left-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm">
        {step}
      </div>

      {/* Content */}
      <div className="text-2xl mb-2">{icon}</div>
      <h3 className="font-semibold text-slate-800 text-sm mb-0.5">{title}</h3>
      <p className="text-xs text-slate-500">{description}</p>

      {/* Connector arrow */}
      {step < 4 && (
        <div className="hidden md:block absolute -right-1.5 top-1/2 transform -translate-y-1/2 text-slate-300 text-lg">
          →
        </div>
      )}
    </div>
  );
}
