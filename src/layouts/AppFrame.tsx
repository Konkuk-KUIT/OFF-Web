// AppFrame.tsx (공통 레이아웃)
import { Outlet } from "react-router-dom";
import Headers from "./Headers";
import BottomNav from "./bottomNavLayout";

export default function AppFrame() {
  return (
    <div className="app-frame">
      <Headers />
      <main className="app-content scrollbar-hide bg-white">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
