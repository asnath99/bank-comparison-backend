export default function UnknownMode({ mode, payload }: { mode: string; payload: any }) {
  let preview = '';
  try { 
    preview = JSON.stringify(payload, null, 2)?.slice(0, 4000); 
  } catch {
    // Ignore JSON stringify errors
  }
  return (
    <div className="p-4 bg-yellow-50 border rounded-2xl text-sm">
      <div className="font-semibold mb-2">Mode « {mode} » non supporté par l'UI.</div>
      <p className="mb-2">La réponse brute du serveur est affichée pour debug :</p>
      <pre className="whitespace-pre-wrap text-xs bg-white/60 rounded p-2 overflow-auto">{preview || '—'}</pre>
    </div>
  );
}