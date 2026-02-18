import { Outlet, useLocation } from "react-router-dom";
import Headers from "./Headers";
import BottomNav from "./bottomNavLayout";

export default function AppFrame() {
  const { pathname } = useLocation();

  /** 홈 화면에서만 bottom nav 표시 */
  const showBottomNav = pathname === "/home";

  return (
    <div className="app-frame">
      <Headers />

      <main className={`app-content scrollbar-hide bg-white ${showBottomNav ? "mb-[8%]" : ""}`}>
        <Outlet />
      </main>

      {showBottomNav && <BottomNav />}
    </div>
  );
}
