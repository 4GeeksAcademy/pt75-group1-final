import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

const PrivateRoute = ({ children }) => {
  const { store } = useGlobalReducer();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (store.user) {
      setIsAuthenticated(true);
    } else if (storedUser) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
    setCheckingAuth(false);
  }, [store.user]);

  if (checkingAuth) return <p className="text-center py-5">Checking login...</p>;

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
