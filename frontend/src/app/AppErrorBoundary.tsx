import { Component } from 'react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

type Props = { children: ReactNode };
type State = { hasError: boolean };

export default class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(err: any, info: any) {
    // logger si besoin
  console.error('AppErrorBoundary', err, info); // eslint-disable-line no-console
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] grid place-items-center p-6">
          <div className="max-w-lg text-center space-y-4">
            <div className="text-6xl">💥</div>
            <h1 className="text-2xl font-bold">Un problème est survenu</h1>
            <p className="text-gray-600">Merci de réessayer.</p>
            <div className="flex justify-center gap-3">
              <Link to="/" className="px-4 py-2 rounded-xl bg-black text-white">Accueil</Link>
              <button className="px-4 py-2 rounded-xl border" onClick={() => window.location.reload()}>
                Recharger
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
