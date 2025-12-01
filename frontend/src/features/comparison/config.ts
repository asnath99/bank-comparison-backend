export type ComparisonMode = 'plain' | 'score' |  (string & {});
export const SUPPORTED_MODES = ['plain', 'score'] as const;

export function resolveMode(sp: URLSearchParams) {
  const fromUrl = sp.get('mode')?.toLowerCase();
  const fromEnv = (import.meta.env.VITE_MODE as string | undefined)?.toLowerCase();
  // Priorité URL > ENV > 'plain'
  const raw: ComparisonMode = (fromUrl || fromEnv || 'plain') as ComparisonMode;

  // //Mode existant renvoyé 
  const effective: 'plain' | 'score' =
    raw === 'score' ? 'score' : 'plain';

  return { raw, effective }; 
}
