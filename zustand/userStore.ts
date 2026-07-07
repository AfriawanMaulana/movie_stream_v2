import { create } from "zustand";
import { getUser } from "@/app/actions/getUser";
import { UserType } from "@/types/userType";

interface UserStore {
  user: UserType | null;
  loading: boolean;

  fetchUser: () => Promise<void>;
  setUser: (user: UserType | null) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  loading: true,

  fetchUser: async () => {
    const user = await getUser();

    set({
      user,
      loading: false,
    });
  },

  setUser: (user) =>
    set({
      user,
    }),

  clearUser: () =>
    set({
      user: null,
    }),
}));
