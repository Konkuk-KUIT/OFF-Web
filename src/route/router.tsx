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
import ProfileEdit from "../pages/home/profileEdit.tsx";
import Payments from "../pages/my/myPayments";
import Invitations from "../pages/my/myInvitations";
import Projects from "../pages/my/myProjects";

import Notice from "../pages/notice/notice";
import Project from "../pages/project/project";
import ProjectCreate from "../pages/project/projectCreate";
import PartnerRecruit from "../pages/project/partnerRecruit";
import PartnerDetail from "../pages/partner/partnerDetail";
import SupportedPartner from "../pages/partner/supportedPartner";
import SupportedPartnerConfirm from "../pages/partner/supportedPartnerConfirm";
import Account from "../pages/account";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppFrame />}>
          {/* 공개 */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile-register" element={<ProfileRegister />} />
          <Route path="/account" element={<Account />} />

          {/* 보호 */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            {/* chat.tsx 안에서 /chat, /chat/:id를 처리 */}
            <Route path="/chat/*" element={<Chat />} />
            <Route path="/project" element={<Project />} />
            <Route path="/project/create" element={<ProjectCreate />} />
            <Route path="/project/partner-recruit" element={<PartnerRecruit />} />
            <Route path="/partner/:id" element={<PartnerDetail />} />
            <Route path="/partner/supported" element={<SupportedPartner />} />
            <Route path="/partner/supported/confirm" element={<SupportedPartnerConfirm />} />
            <Route path="/notice" element={<Notice />} />
            <Route path="/my" element={<My />} />
            <Route path="/my/edit" element={<MyEdit />} />
            <Route path="/home/profile-edit" element={<ProfileEdit />} />
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
