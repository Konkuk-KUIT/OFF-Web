import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isLoggedIn } from "../api/auth";

export default function ProtectedRoute() {
  const location = useLocation();
  const loggedIn = isLoggedIn();

  if (!loggedIn) {
    return (
      <Navigate to="/login" replace state={{ from: location.pathname }} />
    );
  }

  return <Outlet />;
}
