import { create } from "zustand";

export type admin = {
  id: string;
  name: string;
  email: string;
};

interface AdminType {
  loading: boolean;
  isAdmin: boolean;

  admin: admin;

  setLoading: (arg0: boolean) => void;
  setAdmin: (arg0: admin) => void;
  setIsAdmin: (arg0: boolean) => void;
}

const useAdmin = create<AdminType>((set) => ({
  loading: true,
  isAdmin: false,

  admin: {
    id: "",
    name: "",
    email: "",
  },

  setLoading: (data) => set({ loading: data }),
  setIsAdmin: (data: boolean) =>
    set({
      isAdmin: data,
    }),
  setAdmin: (data) => {
    set((state) => ({ admin: { state, ...data } }));
  },
}));

export default useAdmin;
