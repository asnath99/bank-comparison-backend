import { useQuery } from '@tanstack/react-query';
import {
  Building2,
  CreditCard,
  Wallet,
  Users,
  TrendingUp,
  Activity,
  BarChart3,
  Package
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getAdminBanks } from '../api';
import { api } from '@/lib/axios';

interface DashboardStats {
  banks: { total: number; active: number };
  accounts: { total: number };
  cards: { total: number };
  products: { total: number };
  users: { total: number; active: number };
  criteria: { total: number; active: number };
  rules: { total: number; active: number };
}

const DashboardPage = () => {
  const { data: banks } = useQuery({
    queryKey: ['adminBanks'],
    queryFn: getAdminBanks
  });

  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      // Fetch all stats in parallel
      const [accountsRes, cardsRes, productsRes, usersRes, criteriaRes, rulesRes] = await Promise.all([
        api.get('/bankaccounts'),
        api.get('/bankcards'),
        api.get('/bankproducts'),
        api.get('/admin/users'),
        api.get('/admin/comparison/criteria'),
        api.get('/admin/comparison/rules'),
      ]);

      return {
        banks: {
          total: banks?.length || 0,
          active: banks?.filter(b => b.is_active).length || 0,
        },
        accounts: { total: accountsRes.data.count || 0 },
        cards: { total: cardsRes.data.count || 0 },
        products: { total: productsRes.data.count || 0 },
        users: {
          total: usersRes.data.count || 0,
          active: usersRes.data.data?.filter((u: any) => u.is_active).length || 0,
        },
        criteria: {
          total: criteriaRes.data.count || 0,
          active: criteriaRes.data.data?.filter((c: any) => c.is_active).length || 0,
        },
        rules: {
          total: rulesRes.data.count || 0,
          active: rulesRes.data.data?.filter((r: any) => r.is_active).length || 0,
        },
      };
    },
    enabled: !!banks,
  });

  const statCards = [
    {
      title: 'Banques',
      value: stats?.banks.total || 0,
      subtitle: `${stats?.banks.active || 0} actives`,
      icon: Building2,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Comptes Bancaires',
      value: stats?.accounts.total || 0,
      subtitle: 'Total des comptes',
      icon: Wallet,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Cartes',
      value: stats?.cards.total || 0,
      subtitle: 'Total des cartes',
      icon: CreditCard,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Produits',
      value: stats?.products.total || 0,
      subtitle: 'Total des produits',
      icon: Package,
      iconColor: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Utilisateurs Admin',
      value: stats?.users.total || 0,
      subtitle: `${stats?.users.active || 0} actifs`,
      icon: Users,
      iconColor: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
    },
    {
      title: 'Critères de Comparaison',
      value: stats?.criteria.total || 0,
      subtitle: `${stats?.criteria.active || 0} actifs`,
      icon: BarChart3,
      iconColor: 'text-pink-600',
      bgColor: 'bg-pink-100',
    },
    {
      title: 'Règles de Comparaison',
      value: stats?.rules.total || 0,
      subtitle: `${stats?.rules.active || 0} actives`,
      icon: Activity,
      iconColor: 'text-teal-600',
      bgColor: 'bg-teal-100',
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-600 mt-2">Chargement des statistiques...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          Tableau de bord
        </h1>
        <p className="text-gray-600 mt-2">
          Vue d'ensemble de votre plateforme de comparaison bancaire
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {statCards.map((stat, index) => (
          <Card
            key={index}
            className="group hover:shadow-lg transition-all duration-300 border-gray-200 hover:border-gray-300"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor} group-hover:scale-110 transition-transform`}>
                <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
              <p className="text-xs text-gray-600 mt-1">{stat.subtitle}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Actions rapides
          </CardTitle>
          <CardDescription>
            Accédez rapidement aux fonctionnalités principales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <a
              href="/admin/banks"
              className="group flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
            >
              <div className="p-2 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">Gérer les banques</div>
                <div className="text-sm text-gray-600">CRUD banques</div>
              </div>
            </a>

            <a
              href="/admin/accounts"
              className="group flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all"
            >
              <div className="p-2 rounded-lg bg-green-100 group-hover:bg-green-200 transition-colors">
                <Wallet className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">Gérer les comptes</div>
                <div className="text-sm text-gray-600">Comptes bancaires</div>
              </div>
            </a>

            <a
              href="/admin/cards"
              className="group flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all"
            >
              <div className="p-2 rounded-lg bg-purple-100 group-hover:bg-purple-200 transition-colors">
                <CreditCard className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">Gérer les cartes</div>
                <div className="text-sm text-gray-600">Cartes bancaires</div>
              </div>
            </a>

            <a
              href="/admin/products"
              className="group flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all"
            >
              <div className="p-2 rounded-lg bg-orange-100 group-hover:bg-orange-200 transition-colors">
                <Package className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">Gérer les produits</div>
                <div className="text-sm text-gray-600">Produits bancaires</div>
              </div>
            </a>

            <a
              href="/admin/criteria"
              className="group flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-pink-300 hover:bg-pink-50 transition-all"
            >
              <div className="p-2 rounded-lg bg-pink-100 group-hover:bg-pink-200 transition-colors">
                <BarChart3 className="h-5 w-5 text-pink-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">Critères</div>
                <div className="text-sm text-gray-600">Critères de comparaison</div>
              </div>
            </a>

            <a
              href="/admin/rules"
              className="group flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-teal-300 hover:bg-teal-50 transition-all"
            >
              <div className="p-2 rounded-lg bg-teal-100 group-hover:bg-teal-200 transition-colors">
                <Activity className="h-5 w-5 text-teal-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">Règles</div>
                <div className="text-sm text-gray-600">Règles de comparaison</div>
              </div>
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity - Placeholder for future implementation */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-indigo-600" />
            Activité récente
          </CardTitle>
          <CardDescription>
            Les dernières modifications sur la plateforme
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Activity className="h-12 w-12 mx-auto mb-3 text-gray-400" />
            <p>Le suivi d'activité sera bientôt disponible</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;