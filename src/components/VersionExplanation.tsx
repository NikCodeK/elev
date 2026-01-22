/**
 * VersionExplanation Component
 *
 * Erklärt die Unterschiede zwischen den Versionen und warum
 * bestimmte Features erst später eingebaut werden.
 */

'use client';

import { useState } from 'react';
import { SystemVersion } from '@/lib/types';
import { Modal } from './Modal';

interface VersionExplanationProps {
  version: SystemVersion;
}

const EXPLANATIONS: Record<SystemVersion, {
  title: string;
  subtitle: string;
  question: string;
  color: string;
  newFeatures: Array<{ feature: string; why: string }>;
  notIncluded?: Array<{ feature: string; reason: string }>;
  technicalDeepDive?: {
    title: string;
    content: string[];
    implementation?: string[];
  };
}> = {
  mvp: {
    title: 'MVP',
    subtitle: 'Woche 1-2',
    question: 'Funktioniert die Idee überhaupt?',
    color: 'slate',
    newFeatures: [
      {
        feature: 'Voice Interview via Vapi',
        why: 'Kernfunktion - ohne diese gibt es kein Produkt'
      },
      {
        feature: 'Echtzeit-Transkription',
        why: 'Grundlage für jede weitere Analyse'
      },
      {
        feature: 'Basis AI-Evaluation',
        why: 'Zeigt den Mehrwert der Automatisierung'
      },
      {
        feature: 'Slack-Notification',
        why: 'Einfachste Integration ins bestehende Team-Workflow'
      },
    ],
    notIncluded: [
      {
        feature: 'Datenbank-Persistenz',
        reason: 'Komplexität vermeiden - erst validieren, dass die Idee funktioniert'
      },
      {
        feature: 'Retry-Logik bei Fehlern',
        reason: 'Edge Cases kosten Zeit - Fokus auf Happy Path'
      },
      {
        feature: 'User Authentication',
        reason: 'Nur interne Demo - kein Multi-User Support nötig'
      },
      {
        feature: 'Confidence Scores',
        reason: 'Einfache Ja/Nein Empfehlung reicht für Validierung'
      },
    ],
  },
  '2-month': {
    title: '2-Month',
    subtitle: 'Nach 2 Monaten',
    question: 'Können wir uns darauf verlassen?',
    color: 'blue',
    newFeatures: [
      {
        feature: 'Persistente Datenspeicherung',
        why: 'Daten dürfen nicht verloren gehen - Audit & Compliance Grundlage'
      },
      {
        feature: 'Confidence Scores (0-100%)',
        why: 'Team braucht Einschätzung der AI-Sicherheit für Entscheidungen'
      },
      {
        feature: 'Strukturierte Rubrik (v2.3)',
        why: 'Konsistente Bewertung über alle Kandidaten hinweg'
      },
      {
        feature: 'Error Handling & Retries',
        why: 'Produktionssystem muss Ausfälle graceful handeln'
      },
      {
        feature: 'Interview-History',
        why: 'Vergleich von Kandidaten über Zeit ermöglichen'
      },
      {
        feature: 'Quality Scores für Transkription',
        why: 'Schlechte Audio-Qualität erkennen und flaggen'
      },
    ],
    notIncluded: [
      {
        feature: 'Multi-Model Consensus',
        reason: 'Ein gutes Modell reicht - Kosten/Nutzen stimmt noch nicht'
      },
      {
        feature: 'Historische Kalibrierung',
        reason: 'Braucht erst genug Daten (500+ Interviews)'
      },
      {
        feature: 'GDPR Compliance Tools',
        reason: 'Manuelle Prozesse reichen bei kleinem Volumen'
      },
      {
        feature: 'Adaptive Follow-up Fragen',
        reason: 'Standardfragen funktionieren gut genug'
      },
    ],
    technicalDeepDive: {
      title: 'Rubrik-basierte Evaluation',
      content: [
        'Statt freier AI-Analyse wird ein strukturierter Prompt mit definierten Bewertungskriterien verwendet.',
        'Jede Kategorie (Communication, Experience, etc.) hat klare Definitionen was 1-10 bedeutet.',
        'Die Rubrik wird versioniert (v2.3) um Änderungen nachvollziehbar zu machen.',
        'Confidence Score basiert auf: Antwortlänge, Relevanz zur Frage, Konsistenz der Aussagen.',
      ],
      implementation: [
        'Rubrik als JSON-Template in Datenbank gespeichert',
        'Prompt Engineering mit Few-Shot Examples',
        'Output als strukturiertes JSON mit Zod-Validierung',
        'Automatische Retry bei Parse-Fehlern',
      ],
    },
  },
  '4-month': {
    title: '4-Month',
    subtitle: 'Nach 4 Monaten',
    question: 'Können wir dem System bei kritischen Entscheidungen vertrauen?',
    color: 'purple',
    newFeatures: [
      {
        feature: 'Multi-Model Consensus (Claude + GPT-4)',
        why: 'Reduziert Bias und Halluzinationen durch Kreuz-Validierung'
      },
      {
        feature: 'Historische Kalibrierung',
        why: 'Vergleich mit 847 vergangenen Interviews für relative Einordnung'
      },
      {
        feature: 'Adaptive Follow-up Fragen',
        why: 'Tiefere Insights durch kontextabhängige Nachfragen'
      },
      {
        feature: 'GDPR-Compliance & Audit Trail',
        why: 'Rechtliche Absicherung für Enterprise-Kunden'
      },
      {
        feature: 'PII-Redaction',
        why: 'Automatische Anonymisierung sensibler Daten'
      },
      {
        feature: 'Sentiment-Analyse',
        why: 'Zusätzliche Dimension neben Inhalt der Antworten'
      },
    ],
    technicalDeepDive: {
      title: 'Multi-Model Evaluation mit RAG',
      content: [
        'Zwei unabhängige LLMs (Claude + GPT-4) bewerten dasselbe Transkript.',
        'Bei Abweichungen > 15% wird ein drittes Modell als Tie-Breaker hinzugezogen.',
        'RAG-Database (Pinecone/Weaviate) speichert Embeddings aller vergangenen Interviews.',
        'Similarity Search findet die 10 ähnlichsten Kandidaten für Kontext.',
        'Finale Bewertung ist gewichteter Durchschnitt mit historischer Kalibrierung.',
      ],
      implementation: [
        '1. Transkript → Embedding (text-embedding-3-large)',
        '2. RAG Query: Top-10 ähnliche vergangene Interviews',
        '3. Context-Enriched Prompt an Claude + GPT-4 parallel',
        '4. Consensus-Algorithmus mit Confidence Weighting',
        '5. Kalibrierung gegen historische Hire/No-Hire Outcomes',
        '6. Percentile-Ranking (z.B. "Top 15% aller Backend-Kandidaten")',
      ],
    },
  },
};

export function VersionExplanation({ version }: VersionExplanationProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const exp = EXPLANATIONS[version];

  const colorMap: Record<string, { bg: string; border: string; badge: string; button: string }> = {
    slate: {
      bg: 'bg-slate-50',
      border: 'border-slate-200',
      badge: 'bg-slate-200 text-slate-700',
      button: 'bg-slate-600 hover:bg-slate-700',
    },
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      badge: 'bg-blue-200 text-blue-700',
      button: 'bg-blue-600 hover:bg-blue-700',
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      badge: 'bg-purple-200 text-purple-700',
      button: 'bg-purple-600 hover:bg-purple-700',
    },
  };
  const colorClasses = colorMap[exp.color] || colorMap.slate;

  return (
    <>
      <div className={`rounded-xl border ${colorClasses.border} ${colorClasses.bg} mb-4 overflow-hidden`}>
        {/* Header - Always visible, clickable to expand */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-4 flex items-center justify-between hover:bg-white/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded text-xs font-bold ${colorClasses.badge}`}>
              {exp.title}
            </span>
            <span className="text-sm text-slate-600">{exp.subtitle}</span>
          </div>
          <svg
            className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Expandable Content */}
        {isExpanded && (
          <div className="px-4 pb-4 border-t border-slate-200/50">
            {/* Question */}
            <p className="text-sm font-medium text-slate-800 mt-3 mb-3 italic">
              &quot;{exp.question}&quot;
            </p>

            {/* Technical Details Button */}
            {exp.technicalDeepDive && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsModalOpen(true);
                }}
                className={`mb-3 px-3 py-1.5 text-xs text-white rounded-lg ${colorClasses.button} transition-colors`}
              >
                Technische Details
              </button>
            )}

            {/* New Features */}
            <div className="mb-3">
              <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-2">
                {version === 'mvp' ? 'Was ist drin' : 'Neu in dieser Version'}
              </div>
              <ul className="space-y-1.5">
                {exp.newFeatures.map((item, i) => (
                  <li key={i} className="text-xs">
                    <span className="text-emerald-500 mr-1.5">+</span>
                    <span className="font-medium text-slate-700">{item.feature}</span>
                    <span className="text-slate-500"> — {item.why}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Not Included */}
            {exp.notIncluded && (
              <div>
                <div className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-2">
                  Bewusst weggelassen
                </div>
                <ul className="space-y-1.5">
                  {exp.notIncluded.map((item, i) => (
                    <li key={i} className="text-xs">
                      <span className="text-amber-500 mr-1.5">−</span>
                      <span className="font-medium text-slate-700">{item.feature}</span>
                      <span className="text-slate-500"> — {item.reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Technical Deep Dive Modal */}
      {exp.technicalDeepDive && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={exp.technicalDeepDive.title}
        >
          <div className="space-y-6">
            {/* Concept */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-3">
                Konzept
              </h3>
              <ul className="space-y-2">
                {exp.technicalDeepDive.content.map((point, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Implementation */}
            {exp.technicalDeepDive.implementation && (
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-3">
                  Implementation Steps
                </h3>
                <ol className="space-y-2">
                  {exp.technicalDeepDive.implementation.map((step, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {i + 1}
                      </span>
                      <span className="text-slate-700 font-mono text-xs">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* All Features */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-3">
                Alle Features dieser Version
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {exp.newFeatures.map((item, i) => (
                  <div key={i} className="bg-emerald-50 rounded-lg p-2 border border-emerald-100">
                    <div className="text-xs font-medium text-emerald-700">{item.feature}</div>
                    <div className="text-xs text-slate-500">{item.why}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Not Included */}
            {exp.notIncluded && (
              <div>
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-3">
                  Warum nicht früher?
                </h3>
                <div className="space-y-2">
                  {exp.notIncluded.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-amber-500">⚠️</span>
                      <div>
                        <span className="font-medium text-slate-700">{item.feature}:</span>
                        <span className="text-slate-500"> {item.reason}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </>
  );
}
