import { Gif } from "@/types/giftypes";
import { create } from "zustand";

export type user = {
  id: string;
  name: string;
  email: string;
  featured: string[];
  liked: string[];
};

export type liked_gifs_type = {
  id: string;
  gif: string;
  userId: string;
  likedAt: string;
  status: string;
};

interface UserType {
  loading: boolean;
  isUser: boolean;
  liked_gifs: liked_gifs_type[];

  user: user;

  setLoading: (arg0: boolean) => void;
  setUser: (arg0: user) => void;
  setIsUser: (arg0: boolean) => void;
  setLikedGifs: (arg0: liked_gifs_type[]) => void;
}

const useUser = create<UserType>((set) => ({
  loading: true,
  isUser: false,
  liked_gifs: [],

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
  setUser: (data) => {
    set((state) => ({ user: { state, ...data } }));
  },
  setLikedGifs: (liked_gifs) => {
    set({ liked_gifs });
  }
}));

export default useUser;
