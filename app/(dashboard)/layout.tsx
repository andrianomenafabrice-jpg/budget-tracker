import { NavPrincipale } from '@/components/layout/NavPrincipale';

export default function LayoutTableauDeBord({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-papier-registre dark:bg-encre-nuit">
      <NavPrincipale />
      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  );
}