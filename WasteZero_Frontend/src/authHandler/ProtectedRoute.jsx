import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthProvider";

export default function ProtectedRoute({ children }) {
  const { authenticated, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;

  return authenticated ? children : <Navigate to="/" />;
}
