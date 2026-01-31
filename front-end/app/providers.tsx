'use client';

import { ReactNode } from 'react';
import MainLayout from '../components/MainLayout';
import { MahasiswaProvider } from '../context/MahasiswaContext';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <MahasiswaProvider>
      <MainLayout>
        {children}
      </MainLayout>
    </MahasiswaProvider>
  );
}
