import { useState, type PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export function Providers({ children }: PropsWithChildren) {
  // Création du client pour éviter de le recréer à chaque rendu
  const [client] = useState(() =>
    new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          retry: 1,
          staleTime: 60_000, // 1 min
        },
      },
    })
  );

  return (
    <QueryClientProvider client={client}>
      {children}
      {import.meta.env.DEV ? <ReactQueryDevtools initialIsOpen={false} /> : null}
    </QueryClientProvider>
  );
}
