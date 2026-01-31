import { Outlet, useLocation } from "react-router-dom";
import Headers from "./Headers";
import BottomNav from "./bottomNavLayout";

const HIDE_BOTTOM_NAV_PREFIXES = [
  "/my/edit",
  "/my/payments",
  "/my/invitations"
];

export default function AppFrame() {
  const { pathname } = useLocation();

  const hideBottomNav = HIDE_BOTTOM_NAV_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + "/")
  );

  return (
    <div className="app-frame">
      <Headers />

      {/* BottomNav 숨길 때는 margin-bottom 제거 */}
      <main className={`app-content scrollbar-hide bg-white ${hideBottomNav ? "" : "mb-[8%]"}`}>
        <Outlet />
      </main>

      {!hideBottomNav && <BottomNav />}
    </div>
  );
}
