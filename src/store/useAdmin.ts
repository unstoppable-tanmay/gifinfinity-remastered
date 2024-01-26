import { create } from "zustand";

export type admin = {
  id: string;
  name: string;
  email: string;
};

export type timelinetype = {
  aggregateLikeTimelineData: {
    _id: { year: number; month: number; day: number };
    totalLikes: number;
    date: string;
  }[];
  aggregateSearchTimelineData: {
    _id: { year: number; month: number; day: number };
    totalSearches: number;
    date: string;
  }[];
  aggregateUserTimelineData: {
    _id: { year: number; month: number; day: number };
    totalUser: number;
    date: string;
  }[];
};

export type keywordtype = {
  aggregateTopSearchData: { _id: string; count: number; date: string }[];
  aggregateTopLikeData: { _id: string; count: number; date: string }[];
};

interface AdminType {
  loading: boolean;
  isAdmin: boolean;

  timeline: timelinetype;
  keyword: keywordtype;

  admin: admin;

  setLoading: (arg0: boolean) => void;
  setAdmin: (arg0: admin) => void;
  setIsAdmin: (arg0: boolean) => void;
  setTimeLine: (arg0: timelinetype) => void;
  setKeyword: (arg0: keywordtype) => void;
}

const useAdmin = create<AdminType>((set) => ({
  loading: true,
  isAdmin: false,

  timeline: {
    aggregateLikeTimelineData: [],
    aggregateSearchTimelineData: [],
    aggregateUserTimelineData: [],
  },
  keyword: {
    aggregateTopSearchData: [],
    aggregateTopLikeData: [],
  },

  admin: {
    id: "",
    name: "",
    email: "",
  },

  setLoading: (loading) => set({ loading }),
  setIsAdmin: (isAdmin) => set({ isAdmin }),
  setAdmin: (data) => {
    set((state) => ({ admin: { state, ...data } }));
  },
  setTimeLine: (timeline) => set({ timeline }),
  setKeyword: (keyword) => set({ keyword }),
}));

export default useAdmin;
