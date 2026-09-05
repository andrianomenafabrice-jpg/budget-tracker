'use client';

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

type TypeToast = 'succes' | 'erreur';
type Toast = { id: number; message: string; type: TypeToast };

const ToastContext = createContext<((message: string, type?: TypeToast) => void) | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const afficherToast = useCallback((message: string, type: TypeToast = 'succes') => {
    const id = Date.now() + Math.random();
    setToasts((liste) => [...liste, { id, message, type }]);
    setTimeout(() => {
      setToasts((liste) => liste.filter((toast) => toast.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={afficherToast}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className="pointer-events-auto max-w-xs border-l-4 bg-papier-carte px-4 py-3 font-sans text-sm text-texte-principal shadow-lg dark:bg-encre-carte dark:text-texte-inverse"
            style={{ borderLeftColor: toast.type === 'erreur' ? 'var(--color-encre-debit)' : 'var(--color-encre-credit)' }}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast doit être utilisé dans un ToastProvider');
  return ctx;
}