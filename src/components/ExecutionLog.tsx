/**
 * ExecutionLog Component
 *
 * Displays a vertical timeline of pipeline events, showing the progression
 * of an AI interview from call start to final notification.
 *
 * CLICKABLE EVENTS:
 * Each event is clickable and opens a modal with detailed explanation
 * of how this step would work in a real production system.
 *
 * PRODUCTION vs DEMO MAPPING:
 * ---------------------------
 * In production:
 * - This component would connect to a WebSocket or Server-Sent Events stream
 * - Events would arrive in real-time from Vapi webhooks processed by our backend
 * - Each event would be persisted to a database for audit trails
 *
 * In this demo:
 * - Events are passed as props and animated with CSS transitions
 * - The parent component (DemoRunner) orchestrates the timing
 */

'use client';

import { useState } from 'react';
import { PipelineEvent } from '@/lib/types';
import { EVENT_ICONS, EVENT_EXPLANATIONS } from '@/lib/mockData';
import { EventExplanationModal } from './Modal';

interface ExecutionLogProps {
  events: PipelineEvent[];
  currentEventIndex: number;
  compact?: boolean;
}

export function ExecutionLog({ events, currentEventIndex, compact = false }: ExecutionLogProps) {
  const [selectedEvent, setSelectedEvent] = useState<PipelineEvent | null>(null);

  const handleEventClick = (event: PipelineEvent, index: number) => {
    // Only allow clicking on completed or active events
    if (index <= currentEventIndex) {
      setSelectedEvent(event);
    }
  };

  if (compact) {
    return (
      <>
        <div className="p-3">
          <div className="relative">
            <div className="absolute left-[12px] top-2 bottom-2 w-0.5 bg-slate-200" />
            <div className="space-y-2">
              {events.map((event, index) => {
                const isPending = index > currentEventIndex;
                const isActive = index === currentEventIndex;
                const isCompleted = index < currentEventIndex;
                const isClickable = !isPending;

                return (
                  <div
                    key={event.id}
                    onClick={() => handleEventClick(event, index)}
                    className={`
                      relative pl-8 transition-all duration-300
                      ${isPending ? 'opacity-40' : 'opacity-100'}
                      ${isClickable ? 'cursor-pointer hover:bg-slate-50 rounded-lg -mx-2 px-10 py-1' : ''}
                    `}
                  >
                    <div
                      className={`
                        absolute left-1 w-5 h-5 rounded-full flex items-center justify-center
                        transition-all duration-300 text-xs
                        ${isActive ? 'bg-blue-500 ring-2 ring-blue-100 scale-110' : ''}
                        ${isCompleted ? 'bg-slate-100 border border-slate-300' : ''}
                        ${isPending ? 'bg-slate-100 border border-dashed border-slate-300' : ''}
                      `}
                    >
                      {!isPending && <span className="text-[10px]">{EVENT_ICONS[event.type]}</span>}
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-xs font-medium truncate ${
                        isActive ? 'text-blue-700' : isPending ? 'text-slate-400' : 'text-slate-700'
                      }`}>
                        {event.name}
                      </span>
                      {(isCompleted || isActive) && (
                        <span className="text-[10px] text-slate-400 font-mono flex-shrink-0">
                          {formatTimestamp(event.timestamp)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <EventExplanationModal
          isOpen={selectedEvent !== null}
          onClose={() => setSelectedEvent(null)}
          explanation={selectedEvent ? EVENT_EXPLANATIONS[selectedEvent.type] : null}
        />
      </>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
          <h2 className="text-lg font-semibold text-slate-900">Execution Log</h2>
          <span className="text-xs text-slate-400 font-mono ml-auto">
            click events for details
          </span>
        </div>

        {/* Event Timeline */}
        <div className="relative">
          {/* Vertical connector line */}
          <div className="absolute left-[18px] top-2 bottom-2 w-0.5 bg-slate-200" />

          {/* Events */}
          <div className="space-y-3">
            {events.map((event, index) => {
              const isPending = index > currentEventIndex;
              const isActive = index === currentEventIndex;
              const isCompleted = index < currentEventIndex;
              const isClickable = !isPending;

              return (
                <div
                  key={event.id}
                  onClick={() => handleEventClick(event, index)}
                  className={`
                    relative pl-12 transition-all duration-300
                    ${isPending ? 'opacity-40' : 'opacity-100'}
                    ${isClickable ? 'event-clickable' : ''}
                  `}
                >
                  {/* Event dot / icon */}
                  <div
                    className={`
                      absolute left-2 w-8 h-8 rounded-full flex items-center justify-center
                      transition-all duration-300 text-sm
                      ${isActive ? 'bg-blue-500 ring-4 ring-blue-100 scale-110' : ''}
                      ${isCompleted ? 'bg-slate-100 border-2 border-slate-300' : ''}
                      ${isPending ? 'bg-slate-100 border-2 border-dashed border-slate-300' : ''}
                    `}
                  >
                    {!isPending && (
                      <span>{EVENT_ICONS[event.type]}</span>
                    )}
                  </div>

                  {/* Event card */}
                  <div
                    className={`
                      p-4 rounded-xl border transition-all duration-300
                      ${isActive
                        ? 'bg-blue-50 border-blue-200 shadow-md'
                        : 'bg-slate-50 border-slate-200'}
                      ${isPending ? 'bg-white border-dashed' : ''}
                      ${isCompleted ? 'hover:bg-slate-100 hover:border-slate-300' : ''}
                    `}
                  >
                    {/* Event header */}
                    <div className="flex items-center justify-between mb-1">
                      <span className={`
                        font-medium text-sm
                        ${isActive ? 'text-blue-700' : 'text-slate-800'}
                        ${isPending ? 'text-slate-400' : ''}
                      `}>
                        {event.name}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {isCompleted || isActive
                          ? formatTimestamp(event.timestamp)
                          : '--:--:--'}
                      </span>
                    </div>

                    {/* Event description */}
                    <p className={`
                      text-xs leading-relaxed
                      ${isPending ? 'text-slate-400' : 'text-slate-600'}
                    `}>
                      {event.description}
                    </p>

                    {/* Status badge & click hint */}
                    <div className="flex items-center justify-between mt-3">
                      <StatusBadge status={getStatus(index, currentEventIndex)} />
                      {isClickable && (
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Klick für Details
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Event Explanation Modal */}
      <EventExplanationModal
        isOpen={selectedEvent !== null}
        onClose={() => setSelectedEvent(null)}
        explanation={selectedEvent ? EVENT_EXPLANATIONS[selectedEvent.type] : null}
      />
    </>
  );
}

// Helper to format timestamp
function formatTimestamp(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

// Helper to determine status
function getStatus(index: number, currentIndex: number): 'pending' | 'running' | 'done' {
  if (index < currentIndex) return 'done';
  if (index === currentIndex) return 'running';
  return 'pending';
}

// Status badge component
function StatusBadge({ status }: { status: 'pending' | 'running' | 'done' }) {
  const styles = {
    pending: 'bg-slate-100 text-slate-400 border-slate-200',
    running: 'bg-blue-100 text-blue-600 border-blue-200',
    done: 'bg-emerald-100 text-emerald-600 border-emerald-200',
  };

  const labels = {
    pending: 'Waiting',
    running: 'Processing...',
    done: 'Completed',
  };

  return (
    <span className={`
      inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border
      ${styles[status]}
    `}>
      {status === 'running' && (
        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
      )}
      {status === 'done' && (
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )}
      {labels[status]}
    </span>
  );
}
