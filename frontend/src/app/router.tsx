import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { Home } from '../pages/Home';
import  NotFoundPage from '../pages/errors/NotFoundPage';
import BadRequestPage from '../pages/errors/BadRequestPage'
import ServerErrorPage from '../pages/errors/ServerErrorPage'
import NetworkErrorPage from '../pages/errors/NetworkErrorPage'
import LoginPage from '../pages/LoginPage';
import { ProtectedRoute } from './ProtectedRoute';

import { BanksPage } from '../features/banks/pages/BanksPage';
import { BankDetailsPage } from '../features/banks/pages/BankDetailsPage';
import { ComparePage } from '../features/comparison/pages/ComparePage';
import CompareResultsPage from '../features/comparison/pages/CompareResultsPage';
import AccountDetailPage from '../features/bank-accounts/pages/AccountDetailPage';
import CardDetailPage from '../features/bank-cards/pages/CardDetailPage';

import AdminLayout from '@/features/admin/components/AdminLayout';
import AdminDashboardPage from '@/features/admin/pages/DashboardPage';
import AdminBanksPage from '@/features/admin/pages/BanksPage';
import AdminUsersPage from '@/features/admin/pages/UsersPage';
import AdminAccountsPage from '@/features/admin/pages/AccountsPage';
import AdminCardsPage from '@/features/admin/pages/CardsPage';
import AdminProductsPage from '@/features/admin/pages/ProductsPage';
import AdminCriteriaPage from '@/features/admin/pages/CriteriaPage';
import AdminRulesPage from '@/features/admin/pages/RulesPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'banks', element: <BanksPage /> },
      { path: 'banks/:id', element: <BankDetailsPage /> },
      { path: 'compare', element: <ComparePage /> },
      { path: 'results', element: <CompareResultsPage /> },
      { path: 'accounts/:id', element: <AccountDetailPage /> },
      { path: 'cards/:id', element: <CardDetailPage /> },
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/admin',
    element: <ProtectedRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },
          { path: 'dashboard', element: <AdminDashboardPage /> },
          { path: 'banks', element: <AdminBanksPage /> },
          { path: 'accounts', element: <AdminAccountsPage /> },
          { path: 'cards', element: <AdminCardsPage /> },
          { path: 'products', element: <AdminProductsPage /> },
          { path: 'users', element: <AdminUsersPage /> },
          { path: 'criteria', element: <AdminCriteriaPage /> },
          { path: 'rules', element: <AdminRulesPage /> },
        ]
      }
    ]
  },

  { path: '/error/network', element: <NetworkErrorPage /> },
  { path: '/error/400', element: <BadRequestPage /> },
  { path: '/error/500', element: <ServerErrorPage /> },
  { path: '/404', element: <NotFoundPage /> },
  { path: '*', element: <NotFoundPage /> },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
