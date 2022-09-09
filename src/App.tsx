import { Homepage, Login, Register } from "./pages";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import useStore from "./store/store";
import React, { useEffect } from "react";
import shallow from "zustand/shallow";

const App = () => {
  const { currentUser, userAuth } = useStore(
    (state) => ({ currentUser: state.currentUser, userAuth: state.userAuth }),
    shallow
  );

  useEffect(() => {
    userAuth();

    return () => {
      userAuth();
    };
  }, []);

  const ProtectedRoute = ({
    authenticationPath,
    outlet,
  }: ProtectedRouteProps) => {
    if (!currentUser) {
      return <Navigate to={{ pathname: authenticationPath }} />;
    } else {
      return outlet;
    }
  };

  const defaultProtectedRouteProps: Omit<ProtectedRouteProps, "outlet"> = {
    authenticationPath: "/login",
  };

  const AuthProtectedRoute = ({
    authenticationPath,
    outlet,
  }: ProtectedRouteProps) => {
    if (currentUser) {
      return <Navigate to={{ pathname: authenticationPath }} />;
    } else {
      return outlet;
    }
  };

  const authProtectedRouteProps: Omit<ProtectedRouteProps, "outlet"> = {
    authenticationPath: "/",
  };

  return (
    <Router>
      <div className="bg-[#F3F3F3] min-h-screen min-w-screen font-['Outfit'] flex">
        <Routes>
          <Route path="/">
            <Route
              index
              element={
                <ProtectedRoute
                  {...defaultProtectedRouteProps}
                  outlet={<Homepage />}
                />
              }
            />
            <Route
              path="register"
              element={
                <AuthProtectedRoute
                  {...authProtectedRouteProps}
                  outlet={<Register />}
                />
              }
            />
            <Route
              path="login"
              element={
                <AuthProtectedRoute
                  {...authProtectedRouteProps}
                  outlet={<Login />}
                />
              }
            />
          </Route>
        </Routes>
      </div>
    </Router>
  );
};

export default App;
