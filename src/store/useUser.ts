import { create } from "zustand";

type user = {
  id: string;
  name: string;
  email: string;
  saved: string[];
  createdAt: string;
  featured: string[];
  liked: string[];
};

interface UserType {
  loading: boolean;
  isUser: boolean;

  user: user;

  setLoading: (arg0: boolean) => void;
  setUser: (arg0: user) => void;
  setIsUser: (arg0: boolean) => void;
}

const useUser = create<UserType>((set) => ({
  loading: true,
  isUser: false,

  user: {
    id: "",
    name: "",
    email: "",
    saved: [],
    createdAt: "",
    featured: [],
    liked: [],
  },

  setLoading: (data) => set({ loading: data }),
  setIsUser: (data: boolean) =>
    set({
      isUser: data,
    }),
  setUser: (data) => set((state) => ({ user: { state, ...data } })),
}));

export default useUser;
