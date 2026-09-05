import { z } from 'zod';

export const identifiantsSchema = z.object({
  email: z.string().email('Adresse email invalide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
});

export const inscriptionSchema = z
  .object({
    nom: z.string().trim().min(2, 'Le nom doit contenir au moins 2 caractères').max(120),
    email: z.string().email('Adresse email invalide'),
    password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
    confirmationMotDePasse: z.string(),
  })
  .refine((donnees) => donnees.password === donnees.confirmationMotDePasse, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmationMotDePasse'],
  });

export type IdentifiantsInput = z.infer<typeof identifiantsSchema>;
export type InscriptionInput = z.infer<typeof inscriptionSchema>;