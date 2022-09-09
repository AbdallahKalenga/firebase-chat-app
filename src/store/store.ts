import { onAuthStateChanged } from "firebase/auth";
import { DocumentData } from "firebase/firestore";
import create from "zustand";
import { auth } from "../firebase/firebase";
import { authStore, chatType } from "../types/types";

const getChatId = (data: any) => {
  const currentUserUID = useStore((state) => state.currentUser);

  const chatId =
    currentUserUID > data.uid
      ? currentUserUID + data.uid
      : data.uid + currentUserUID;

  return chatId;
};

const useStore = create<authStore>((set) => ({
  currentUser: {},
  userAuth: () => {
    onAuthStateChanged(auth, (user: any) => {
      set((state) => ({
        ...state,
        currentUser: user,
      }));
    });
  },
  refreshUser: (user) => {
    set((state) => ({
      ...state,
      currentUser: user,
    }));
  },
}));

export const chatStore = create<chatType>((set) => ({
  user: {},
  chatId: "null",
  changeUser: (data, chatId) => {
    set((state) => ({
      ...state,
      user: data,
      chatId: chatId,
    }));
  },
  chats: {},
  setChats: (chats: DocumentData) => {
    set((state) => ({
      ...state,
      chats,
    }));
  },
}));

export default useStore;
