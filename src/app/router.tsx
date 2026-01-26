import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AppFrame from "../layouts/AppFrame";

import Home from "../pages/home/home";
import Login from "../pages/auth/login";
import ProfileRegister from "../pages/auth/profile-register";
import Chat from "../pages/chat/chat";
import My from "../pages/my/my";
import Notice from "../pages/notice/notice";
import Project from "../pages/project/project";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 공통 프레임(헤더+스크롤영역+하단네비) */}
        <Route element={<AppFrame />}>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/project" element={<Project />} />
          <Route path="/notice" element={<Notice />} />
          <Route path="/my" element={<My />} />
        </Route>

        {/* 프레임 없는 페이지 */}
        <Route path="/login" element={<Login />} />
        <Route path="/profile-register" element={<ProfileRegister />} />

        {/* 없는 경로 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
