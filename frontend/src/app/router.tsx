import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { Home } from '../pages/Home';
import  NotFoundPage from '../pages/errors/NotFoundPage';
import BadRequestPage from '../pages/errors/BadRequestPage'
import ServerErrorPage from '../pages/errors/ServerErrorPage'
import NetworkErrorPage from '../pages/errors/NetworkErrorPage'

import { BanksPage } from '../features/banks/pages/BanksPage';
import { BankDetailsPage } from '../features/banks/pages/BankDetailsPage';
import { ComparePage } from '../features/comparison/pages/ComparePage';
import CompareResultsPage from '../features/comparison/pages/CompareResultsPage';
import AccountDetailPage from '../features/bank-accounts/pages/AccountDetailPage';
import CardDetailPage from '../features/bank-cards/pages/CardDetailPage';

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

  { path: '/error/network', element: <NetworkErrorPage /> },
  { path: '/error/400', element: <BadRequestPage /> },
  { path: '/error/500', element: <ServerErrorPage /> },
  { path: '/404', element: <NotFoundPage /> },
  { path: '*', element: <NotFoundPage /> },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
