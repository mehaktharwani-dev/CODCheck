import { ArrowUpRight, Moon, Sun, ShieldAlert, Sparkles, FileSpreadsheet } from 'lucide-react';

interface TopBarProps {
  activeTab: 'reconcile' | 'disputes' | 'tariffs' | 'playbook';
  setActiveTab: (tab: 'reconcile' | 'disputes' | 'tariffs' | 'playbook') => void;
  disputeCount: number;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onNewReconciliationClick: () => void;
}

export function TopBar({
  activeTab,
  setActiveTab,
  disputeCount,
  darkMode,
  setDarkMode,
  onNewReconciliationClick,
}: TopBarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
        {/* Zone 1: Brand title, single line text */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm tracking-wider shadow-sm">
              CC
            </span>
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
              CODCheck
            </span>
          </div>
          <span className="hidden sm:inline text-xs text-slate-400 dark:text-slate-500 font-medium">
            Pakistan
          </span>
        </div>

        {/* Zone 2: Navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => setActiveTab('reconcile')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
              activeTab === 'reconcile'
                ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Reconciliation Engine
            {activeTab === 'reconcile' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 dark:bg-emerald-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('disputes')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 relative flex items-center gap-1.5 ${
              activeTab === 'disputes'
                ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Courier Dispute Pack
            {disputeCount > 0 && (
              <span className="px-1.5 py-0.2 text-[11px] font-mono font-semibold rounded bg-rose-100 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300">
                {disputeCount}
              </span>
            )}
            {activeTab === 'disputes' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 dark:bg-emerald-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('tariffs')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
              activeTab === 'tariffs'
                ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Courier Tariffs & Rules
            {activeTab === 'tariffs' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 dark:bg-emerald-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('playbook')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
              activeTab === 'playbook'
                ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Startup Playbook (2026)
            {activeTab === 'playbook' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 dark:bg-emerald-400 rounded-full" />
            )}
          </button>
        </nav>

        {/* Zone 3: 1 primary action + theme toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={onNewReconciliationClick}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 rounded-lg transition-colors whitespace-nowrap shadow-sm"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Upload & Reconcile</span>
          </button>
        </div>
      </div>
    </header>
  );
}
