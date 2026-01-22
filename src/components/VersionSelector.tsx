/**
 * VersionSelector Component
 *
 * Top-level tabs for switching between system maturity levels.
 * The core interview flow never changes - only the surrounding
 * capabilities and guarantees evolve.
 */

'use client';

import { SystemVersion } from '@/lib/types';
import { VERSION_INFO } from '@/lib/mockData';

interface VersionSelectorProps {
  currentVersion: SystemVersion;
  onVersionChange: (version: SystemVersion) => void;
}

export function VersionSelector({
  currentVersion,
  onVersionChange,
}: VersionSelectorProps) {
  const versions: SystemVersion[] = ['mvp', '2-month', '4-month'];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-1.5 shadow-sm">
      <div className="flex gap-1">
        {versions.map((version) => {
          const info = VERSION_INFO[version];
          const isActive = currentVersion === version;

          return (
            <button
              key={version}
              onClick={() => onVersionChange(version)}
              className={`
                flex-1 px-4 py-3 rounded-xl transition-all duration-200
                ${isActive
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'hover:bg-slate-50 text-slate-600'}
              `}
            >
              <div className="flex items-center justify-center gap-3">
                <VersionBadge version={version} isActive={isActive} />
                <div className="text-left">
                  <div className={`font-semibold text-sm ${isActive ? 'text-white' : 'text-slate-700'}`}>
                    {info.label}
                  </div>
                  <div className={`text-xs ${isActive ? 'text-slate-300' : 'text-slate-400'}`}>
                    {info.tagline}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Version description */}
      <div className="mt-3 px-4 pb-2">
        <p className="text-xs text-slate-500">
          {VERSION_INFO[currentVersion].description}
        </p>
      </div>
    </div>
  );
}

function VersionBadge({ version, isActive }: { version: SystemVersion; isActive: boolean }) {
  const config = {
    mvp: { color: 'bg-amber-500', label: '1' },
    '2-month': { color: 'bg-blue-500', label: '2' },
    '4-month': { color: 'bg-emerald-500', label: '3' },
  };

  return (
    <div
      className={`
        w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
        ${isActive ? config[version].color + ' text-white' : 'bg-slate-200 text-slate-500'}
      `}
    >
      {config[version].label}
    </div>
  );
}
