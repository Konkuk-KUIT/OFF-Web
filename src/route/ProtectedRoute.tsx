import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function ProtectedRoute() {
  // const location = useLocation();
  // const isLoggedIn = !!localStorage.getItem("accessToken");

  // // if (!isLoggedIn) {
  // //   return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  // // } -> 로그인했을때만 페이지 접근가능하게 하는 코드. 테스트를위해 빼둠

  return <Outlet />;
}
