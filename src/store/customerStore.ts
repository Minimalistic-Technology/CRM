import { create } from 'zustand';

interface Customer {
  id: string;
  name: string;
  contact: { email: string; phone: string };
  status: 'Active' | 'Inactive' | 'Lead';
  lastActivity: Date;
}

interface CustomerState {
  customers: Customer[];
  selectedCustomer: Customer | null;
  loading: boolean;
  error: string | null;
  fetchCustomers: () => Promise<void>;
  fetchCustomerById: (id: string) => Promise<void>;
  setSelectedCustomer: (customer: Customer | null) => void;
}

export const useCustomerStore = create<CustomerState>((set) => ({
  customers: [],
  selectedCustomer: null,
  loading: false,
  error: null,
  fetchCustomers: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/customers'); // Assume backend API endpoint
      if (!response.ok) throw new Error('Failed to fetch customers');
      const data: Customer[] = await response.json();
      set({ customers: data, loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },
  fetchCustomerById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/customers/${id}`);
      if (!response.ok) throw new Error('Failed to fetch customer');
      const data: Customer = await response.json();
      set({ selectedCustomer: data, loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },
  setSelectedCustomer: (customer) => set({ selectedCustomer: customer }),
}));