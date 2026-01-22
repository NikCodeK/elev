/**
 * Modal Component
 *
 * Reusable modal/popup for showing detailed explanations.
 * Used when clicking on pipeline events to explain how they work in production.
 */

'use client';

import { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'default' | 'large';
  zIndex?: number;
}

export function Modal({ isOpen, onClose, title, children, size = 'default', zIndex = 100 }: ModalProps) {
  // Close on Escape key - use capture phase and stopImmediatePropagation
  // so only the top-most modal closes
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopImmediatePropagation();
        onClose();
      }
    },
    [onClose]
  );

  // Use capture phase for higher z-index modals so they handle ESC first
  const useCapture = zIndex > 100;

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown, useCapture);
      document.body.style.overflow = 'hidden';
      return () => {
        document.removeEventListener('keydown', handleKeyDown, useCapture);
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen, handleKeyDown, useCapture]);

  if (!isOpen) return null;

  // Use portal to render modal at document body level
  // This ensures nested modals display correctly
  if (typeof document === 'undefined') return null;

  const modalContent = (
    <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex }}>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm animate-backdrop"
        onClick={onClose}
      />

      {/* Modal content */}
      <div className={`relative bg-white rounded-2xl shadow-2xl w-full max-h-[85vh] overflow-hidden animate-modal ${
        size === 'large' ? 'max-w-4xl' : 'max-w-2xl'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 overflow-y-auto max-h-[calc(85vh-80px)]">
          {children}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

/**
 * EventExplanationModal
 *
 * Specialized modal for showing how a pipeline event works in production.
 */

interface EventExplanation {
  eventType: string;
  title: string;
  summary: string;
  inProduction: {
    trigger: string;
    dataFlow: string[];
    technologies: string[];
    errorHandling: string;
  };
}

interface EventExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  explanation: EventExplanation | null;
}

export function EventExplanationModal({
  isOpen,
  onClose,
  explanation,
}: EventExplanationModalProps) {
  if (!explanation) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={explanation.title} zIndex={200}>
      <div className="space-y-6">
        {/* Summary */}
        <div>
          <p className="text-slate-600 leading-relaxed">{explanation.summary}</p>
        </div>

        {/* In Production Section */}
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
          <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-4">
            In Production
          </h3>

          {/* Trigger */}
          <div className="mb-4">
            <div className="text-xs font-medium text-slate-500 mb-1">Trigger</div>
            <div className="text-sm text-slate-800 bg-white px-3 py-2 rounded-lg border border-slate-200">
              {explanation.inProduction.trigger}
            </div>
          </div>

          {/* Data Flow */}
          <div className="mb-4">
            <div className="text-xs font-medium text-slate-500 mb-2">Data Flow</div>
            <div className="space-y-2">
              {explanation.inProduction.dataFlow.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-semibold flex-shrink-0">
                    {i + 1}
                  </div>
                  <div className="text-sm text-slate-700 pt-0.5">{step}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Technologies */}
          <div className="mb-4">
            <div className="text-xs font-medium text-slate-500 mb-2">Technologies</div>
            <div className="flex flex-wrap gap-2">
              {explanation.inProduction.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-600"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Error Handling */}
          <div>
            <div className="text-xs font-medium text-slate-500 mb-1">Error Handling</div>
            <div className="text-sm text-slate-700">{explanation.inProduction.errorHandling}</div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-xs text-slate-400 pt-2 border-t border-slate-100">
          Click anywhere outside or press ESC to close
        </div>
      </div>
    </Modal>
  );
}
