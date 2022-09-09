import { DocumentData } from "firebase/firestore";

type authStore = {
  currentUser: any;
  userAuth: () => void;
  refreshUser: (user: any) => void;
};

type chatType = {
  user: any;
  chatId: string;
  changeUser: (data: any, currentUser: any) => void;
  chats: {};
  setChats: (chats) => void;
};

type ProtectedRouteProps = {
  authenticationPath: string;
  outlet: JSX.Element;
};
