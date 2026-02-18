import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isLoggedIn } from "../api/auth";

/*비로그인 시 로그인페이지로 리다이렉트*/

export default function ProtectedRoute() {
  const location = useLocation();
  const loggedIn = isLoggedIn();

  if (!loggedIn) {
    return (
      <Navigate to="/login" replace state={{ from: { pathname: location.pathname } }} />
    );
  }

  return <Outlet />;
}
