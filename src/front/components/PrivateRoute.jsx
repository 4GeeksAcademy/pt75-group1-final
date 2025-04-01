import React from "react";
import { Navigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

const PrivateRoute = ({ children }) => {
  const { store } = useGlobalReducer();

  return store.user ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
