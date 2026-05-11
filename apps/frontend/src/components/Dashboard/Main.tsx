import React, { type ReactNode } from 'react';

export const Main: React.FC<{ children: ReactNode }> = ({ children }) => (
  <main className="flex-1 flex flex-col relative overflow-hidden bg-background">
    {children}
  </main>
);
