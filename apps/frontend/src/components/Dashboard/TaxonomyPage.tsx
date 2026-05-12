import React from 'react';

export const TaxonomyPage: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center h-full bg-neutral-950 text-neutral-100 p-8">
      <div className="w-16 h-16 border border-white/20 flex items-center justify-center rounded-2xl bg-neutral-900 shadow-inner mb-6">
        <svg
          className="w-8 h-8 text-neutral-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      </div>
      <h2 className="text-xl font-bold tracking-tight mb-2">
        Taxonomy Explorer
      </h2>
      <p className="text-sm text-neutral-500 max-w-md text-center leading-relaxed">
        This view will allow manual browsing of the Location and Transaction
        taxonomy catalogs. Currently, the AI automatically searches these
        catalogs for you during chat.
      </p>
      <div className="mt-8 flex gap-4">
        <div className="px-4 py-2 border border-white/10 rounded-lg bg-neutral-900/50">
          <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1">
            Locations
          </p>
          <p className="text-lg tabular-nums font-bold">12,450</p>
        </div>
        <div className="px-4 py-2 border border-white/10 rounded-lg bg-neutral-900/50">
          <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1">
            Transactions
          </p>
          <p className="text-lg tabular-nums font-bold">3,892</p>
        </div>
      </div>
    </div>
  );
};
