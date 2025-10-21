interface UnknownModeProps {
  mode: string;
  payload: unknown;
}

const UnknownMode = ({ mode, payload }: UnknownModeProps) => {
  return (
    <div className="p-4 border rounded-2xl text-orange-700 bg-orange-50">
      <h3 className="font-bold">Mode de résultat inattendu</h3>
      <p>Les résultats de la comparaison n'ont pas pu être affichés car le mode "{mode}" n'est pas pris en charge par l'interface.</p>
      {import.meta.env.DEV && (
        <pre className="mt-4 p-2 bg-gray-100 rounded text-xs overflow-auto">
          {JSON.stringify(payload, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default UnknownMode;
