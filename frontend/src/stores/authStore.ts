import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AdminState {
  token: string | null;
  isAdmin: boolean;
  setToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AdminState>()(
  persist(
    (set) => ({
      token: null,
      isAdmin: false,
      setToken: (token: string) => set({ token, isAdmin: true }),
      logout: () => set({ token: null, isAdmin: false }),
    }),
    {
      name: 'auth-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
