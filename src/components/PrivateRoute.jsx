// components/PrivateRoute.jsx
import { auth } from "../firebase";
import { Navigate, useLocation } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const location = useLocation();
  
  if (!auth.currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
}