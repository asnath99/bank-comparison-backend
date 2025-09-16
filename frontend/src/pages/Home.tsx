import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

export function Home() {
  return (
    <div className="min-h-[80vh]">
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="rounded-3xl bg-gradient-to-br from-blue-900 to-blue-800 text-white p-6 sm:p-10">
            <div className="flex flex-col gap-6 sm:gap-8">
              <span className="inline-flex items-center gap-2 w-fit text-xs sm:text-sm px-3 py-1 rounded-full bg-white/10">
                <Sparkles className="w-4 h-4" />
                Comparateur Bancaire
              </span>

              <h1 className="text-2xl sm:text-4xl font-extrabold leading-tight">
                Comparez facilement les frais bancaires au Burkina
              </h1>

              <p className="text-white/80 max-w-2xl">
                Sélectionnez vos banques, vos critères (frais de tenue de compte, frais annuels de carte)
                et même vos budgets, et obtenez un classement clair avec les détails par banque.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to="/compare"
                  className="inline-flex items-center gap-2 rounded-xl bg-white text-gray-900 px-4 py-2 font-semibold hover:opacity-90 transition"
                >
                  Comparer maintenant
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/banks"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-4 py-2 hover:bg-white/5 transition"
                >
                  Voir les banques
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>



      <section className="py-8">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-lg sm:text-xl font-bold mb-4">Comment ça marche ?</h2>
          <ol className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <li className="rounded-2xl border bg-white p-5">
              <div className="text-xs text-gray-500 mb-1">Étape 1</div>
              <div className="font-semibold mb-2">Choisissez</div>
              <p className="text-sm text-gray-600">
                Banques, <br />
                Type de compte (facultatif), <br />
                Critères (obligatoires), <br />
                Budgets (facultatifs).
              </p>
            </li>
            <li className="rounded-2xl border bg-white p-5">
              <div className="text-xs text-gray-500 mb-1">Étape 2</div>
              <div className="font-semibold mb-2">Comparez</div>
              <p className="text-sm text-gray-600">
                Obtenez le classement et le détail par banque.
              </p>
            </li>
            <li className="rounded-2xl border bg-white p-5">
              <div className="text-xs text-gray-500 mb-1">Étape 3</div>
              <div className="font-semibold mb-2">Décidez</div>
              <p className="text-sm text-gray-600">
                Ouvrez la fiche banque et consultez les comptes/cartes correspondants.
              </p>
            </li>
          </ol>
        </div>
      </section>

      <section className="py-10">
        <div className="mx-auto max-w-6xl px-4">
          <div className="rounded-2xl border bg-white p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="font-semibold text-lg">Prêt à comparer ?</div>
              <p className="text-sm text-gray-600">
                Commencez avec les frais de tenue de compte et les frais annuels de carte.
              </p>
            </div>
            <Link
              to="/compare"
              className="inline-flex items-center gap-2 rounded-xl bg-white hover:bg-black bord text-white hover:text-black px-4 py-2 hover:opacity-90 transition"
            >
              Comparer maintenant
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
