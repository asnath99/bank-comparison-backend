import { Link } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  TrendingDown,
  Shield,
  Zap,
  BarChart3,
  CheckCircle2,
  Building2,
  CreditCard,
  Wallet,
} from "lucide-react";

export function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 lg:py-32">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border border-blue-200/50 mb-8 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-900">
                Comparateur Bancaire Intelligent
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-gray-900 mb-6">
              Comparez les
              <span className="block mt-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                frais bancaires
              </span>
              en toute simplicité
            </h1>

            {/* Subheading */}
            <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Trouvez la banque qui correspond à vos besoins au Burkina Faso.
              Comparez les frais, les services et faites des économies dès
              aujourd'hui.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/compare"
                className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 font-bold text-lg shadow-xl shadow-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/60 transition-all duration-300 hover:scale-[1.08] ring-2 ring-blue-400/20 hover:ring-blue-400/40"
              >
                <span className="text-white drop-shadow-md">Comparer maintenant</span>
                <ArrowRight className="w-5 h-5 text-white drop-shadow-md group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/banks"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-gray-300 bg-white text-gray-700 font-semibold text-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Voir les banques
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-500" />
                <span>Données sécurisées</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                <span>Résultats instantanés</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 bg-white border-y border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-100 text-blue-600 mb-4">
                <Building2 className="w-6 h-6" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">10+</div>
              <div className="text-sm text-gray-600">Banques</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 mb-4">
                <CreditCard className="w-6 h-6" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">50+</div>
              <div className="text-sm text-gray-600">Produits comparés</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-purple-100 text-purple-600 mb-4">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">15+</div>
              <div className="text-sm text-gray-600">
                Critères de comparaison
              </div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-green-100 text-green-600 mb-4">
                <Wallet className="w-6 h-6" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">30%</div>
              <div className="text-sm text-gray-600">Économies moyennes</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Pourquoi utiliser notre comparateur ?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Des fonctionnalités puissantes pour vous aider à prendre la
              meilleure décision
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group relative bg-white rounded-2xl p-8 border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white mb-5 shadow-lg shadow-blue-500/30">
                  <TrendingDown className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Réduisez vos frais
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Identifiez les banques avec les frais les plus bas adaptés à
                  votre profil et économisez.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative bg-white rounded-2xl p-8 border border-gray-200 hover:border-indigo-300 hover:shadow-xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white mb-5 shadow-lg shadow-indigo-500/30">
                  <Zap className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Comparaison instantanée
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Obtenez des résultats en temps réel avec notre moteur de
                  comparaison intelligent et puissant.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative bg-white rounded-2xl p-8 border border-gray-200 hover:border-purple-300 hover:shadow-xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white mb-5 shadow-lg shadow-purple-500/30">
                  <BarChart3 className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Analyse détaillée
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Visualisez et comparez tous les critères importants : frais de
                  compte, cartes, virements et plus.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="group relative bg-white rounded-2xl p-8 border border-gray-200 hover:border-green-300 hover:shadow-xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white mb-5 shadow-lg shadow-green-500/30">
                  <Shield className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  100% Sécurisé
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Vos données sont protégées. Aucune information personnelle
                  n'est requise pour comparer.
                </p>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="group relative bg-white rounded-2xl p-8 border border-gray-200 hover:border-orange-300 hover:shadow-xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white mb-5 shadow-lg shadow-orange-500/30">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Critères personnalisables
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Définissez vos propres critères et budgets pour des résultats
                  parfaitement adaptés à vos besoins.
                </p>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="group relative bg-white rounded-2xl p-8 border border-gray-200 hover:border-pink-300 hover:shadow-xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 text-white mb-5 shadow-lg shadow-pink-500/30">
                  <Building2 className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Informations à jour
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Base de données actualisée régulièrement avec les dernières
                  offres bancaires du Burkina Faso.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Trois étapes simples pour trouver la meilleure banque
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-20 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-200"></div>

            {/* Step 1 */}
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 border-2 border-blue-200 shadow-lg hover:shadow-xl transition-shadow">
                <div className="absolute -top-5 left-8 inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold text-lg shadow-lg">
                  1
                </div>
                <div className="mt-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Sélectionnez vos critères
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Choisissez les banques à comparer, le type de compte, les
                    critères importants et vos budgets.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                      Banques à comparer
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                      Type de compte (facultatif)
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                      Critères de comparaison
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                      Budgets (facultatifs)
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 border-2 border-indigo-200 shadow-lg hover:shadow-xl transition-shadow">
                <div className="absolute -top-5 left-8 inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 text-white font-bold text-lg shadow-lg">
                  2
                </div>
                <div className="mt-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Analysez les résultats
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Notre moteur intelligent calcule et classe les banques selon
                    vos critères en temps réel.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                      Classement personnalisé
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                      Scores détaillés
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                      Comparaison visuelle
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                      Analyse des économies
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 border-2 border-purple-200 shadow-lg hover:shadow-xl transition-shadow">
                <div className="absolute -top-5 left-8 inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 text-white font-bold text-lg shadow-lg">
                  3
                </div>
                <div className="mt-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Faites votre choix
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Consultez les détails de chaque banque et prenez une
                    décision éclairée.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                      Fiches détaillées
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                      Informations complètes
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                      Comptes et cartes
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                      Contact direct
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 px-8 py-16 sm:px-16 shadow-2xl">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>

            <div className="relative text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Prêt à économiser sur vos frais bancaires ?
              </h2>
              <p className="text-lg text-white/90 max-w-2xl mx-auto mb-8">
                Rejoignez des milliers d'utilisateurs qui ont déjà trouvé la
                banque parfaite. Commencez votre comparaison maintenant, c'est
                gratuit et sans engagement.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/compare"
                  className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-blue-600 font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  Commencer la comparaison
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/banks"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-white/30 text-white font-semibold text-lg hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
                >
                  Explorer les banques
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
