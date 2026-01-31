'use client';

import { ReactNode } from 'react';
import Sidebar from './Sidebar';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen relative">
      <Sidebar />
      <div className="flex-1 md:pl-64">
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
          {children}
        </main>
      </div>
    </div>
  );
}
