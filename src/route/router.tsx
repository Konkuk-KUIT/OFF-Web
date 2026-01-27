import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AppFrame from "../layouts/AppFrame";

import ProtectedRoute from "./ProtectedRoute";

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
        {/* 로그인 필요한 구역 */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppFrame />}>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/project" element={<Project />} />
            <Route path="/notice" element={<Notice />} />
            <Route path="/my" element={<My />} />
          </Route>
        </Route>

        {/* 로그인 없이 접근 가능한 페이지 */}
        <Route path="/login" element={<Login />} />
        <Route path="/profile-register" element={<ProfileRegister />} />

        {/* 없는 경로 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
