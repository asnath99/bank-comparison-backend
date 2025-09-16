import AppErrorBoundary from '@/app/AppErrorBoundary';
import { Providers } from './app/providers';
import { Router } from './app/router';

export default function App() {
  return (
    <AppErrorBoundary>
    <Providers>
      <Router />
    </Providers>
    </AppErrorBoundary>
  );
}
