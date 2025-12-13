import { create } from 'zustand';

type Role = 'Admin' | 'Sales' | 'Support' | 'Guest';

interface UserState {
  role: Role;
  setRole: (role: Role) => void;
}

export const useUserStore = create<UserState>((set) => ({
  role: 'Guest', // Default role
  setRole: (role) => set({ role }),
}));