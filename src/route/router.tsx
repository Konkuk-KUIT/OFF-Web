import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AppFrame from "../layouts/AppFrame";

import ProtectedRoute from "./ProtectedRoute";

import Home from "../pages/home/home";
import Login from "../pages/auth/login";
import Signup from "../pages/auth/signup";
import ProfileRegister from "../pages/auth/profile-register";
import Chat from "../pages/chat/chat";

import My from "../pages/my/my";
import MyEdit from "../pages/my/myEdit";
import Payments from "../pages/my/myPayments";
import Invitations from "../pages/my/myInvitations";
import Projects from "../pages/my/myProjects";

import Notice from "../pages/notice/notice";
import Project from "../pages/project/project";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppFrame />}>
          {/* 공개 */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile-register" element={<ProfileRegister />} />

          {/* 보호 */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/project" element={<Project />} />
            <Route path="/notice" element={<Notice />} />
            <Route path="/my" element={<My />} />
            <Route path="/my/edit" element={<MyEdit />} />
            <Route path="my/payments" element={<Payments />} />
            <Route path="my/invitations" element={<Invitations />} />
            <Route path="my/projects" element={<Projects />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
