'use client';

import { useSyncExternalStore } from 'react';

function s_abonner(callback: () => void) {
  const observateur = new MutationObserver(callback);
  observateur.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  return () => observateur.disconnect();
}

function obtenirEtat() {
  return document.documentElement.classList.contains('dark');
}

function obtenirEtatServeur() {
  return false;
}

export function BasculeTheme() {
  const estSombre = useSyncExternalStore(s_abonner, obtenirEtat, obtenirEtatServeur);

  function basculer() {
    const nouvelEtat = !estSombre;
    document.documentElement.classList.toggle('dark', nouvelEtat);
    localStorage.setItem('theme', nouvelEtat ? 'dark' : 'light');
  }

  return (
    <button
      type="button"
      onClick={basculer}
      aria-label={estSombre ? 'Passer au thème clair' : 'Passer au thème sombre'}
      className="text-lg leading-none text-texte-principal hover:text-encre-objectif dark:text-texte-inverse"
    >
      {estSombre ? '☀' : '☾'}
    </button>
  );
}