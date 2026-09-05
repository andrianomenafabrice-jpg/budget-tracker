'use server';

import { signOut } from '@/lib/auth';

export async function deconnecter() {
  await signOut({ redirectTo: '/login' });
}