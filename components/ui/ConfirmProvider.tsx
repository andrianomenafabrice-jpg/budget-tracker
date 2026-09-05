'use client';

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';

type ResolveFn = (valeur: boolean) => void;

const ConfirmContext = createContext<((message: string) => Promise<boolean>) | null>(null);

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [message, setMessage] = useState('');
  const resolveRef = useRef<ResolveFn | null>(null);

  const demanderConfirmation = useCallback((texte: string) => {
    setMessage(texte);
    dialogRef.current?.showModal();
    return new Promise<boolean>((resolve) => {
      resolveRef.current = resolve;
    });
  }, []);

  function repondre(valeur: boolean) {
    dialogRef.current?.close();
    resolveRef.current?.(valeur);
  }

  return (
    <ConfirmContext.Provider value={demanderConfirmation}>
      {children}
      <dialog
        ref={dialogRef}
        onCancel={() => repondre(false)}
        className="fixed top-1/2 left-1/2 m-0 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 border border-texte-principal/20 bg-papier-carte p-6 text-texte-principal backdrop:bg-black/50 dark:border-texte-inverse/20 dark:bg-encre-carte dark:text-texte-inverse"
      >
        <p className="font-sans text-sm">{message}</p>
        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => repondre(false)}
            className="font-sans text-sm font-medium text-texte-principal/70 hover:underline dark:text-texte-inverse/70"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={() => repondre(true)}
            className="bg-encre-debit px-3 py-1.5 font-sans text-sm font-semibold text-texte-inverse"
          >
            Supprimer
          </button>
        </div>
      </dialog>
    </ConfirmContext.Provider>
  );
}

export function useConfirmation() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error('useConfirmation doit être utilisé dans un ConfirmProvider');
  return ctx;
}