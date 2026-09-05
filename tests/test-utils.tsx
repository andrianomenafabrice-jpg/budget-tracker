import { render, type RenderOptions } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';
import { ToastProvider } from '../components/ui/ToastProvider';
import { ConfirmProvider } from '../components/ui/ConfirmProvider';

function TousLesProviders({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <ConfirmProvider>{children}</ConfirmProvider>
    </ToastProvider>
  );
}

export function renderAvecProviders(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return render(ui, { wrapper: TousLesProviders, ...options });
}

export * from '@testing-library/react';