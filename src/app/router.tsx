import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Headers from "../layouts/headers";
import BottomNavLayout from "../layouts/bottomNavLayout";

import Home from "../pages/home/home";
import Login from "../pages/auth/login";
import Chat from "../pages/chat/chat";
import My from "../pages/my/my";
import Notice from "../pages/notice/notice";
import Project from "../pages/project/project";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 헤더 + 하단네비 공통 레이아웃 */}
        <Route element={<Headers />}>
          <Route element={<BottomNavLayout />}>
            <Route index element={<Home />} />
            <Route path="chat" element={<Chat />} />
            <Route path="project" element={<Project />} />
            <Route path="notice" element={<Notice />} />
            <Route path="my" element={<My />} />
          </Route>
        </Route>

        {/* 인증 페이지 (레이아웃 분리) */}
        <Route path="/login" element={<Login />} />

        {/* 없는 경로 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
