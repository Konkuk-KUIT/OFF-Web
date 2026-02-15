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

// ✅ 프로젝트 라우트(부모 + 자식들)
import Project from "../pages/project/project";
import ProjectCreate from "../pages/project/projectCreate";
import PartnerRecruit from "../pages/project/partnerRecruit";
import PartnerDetail from "../pages/partner/partnerDetail";
import SupportedPartner from "../pages/partner/supportedPartner";
import SupportedPartnerConfirm from "../pages/partner/supportedPartnerConfirm";
import Account from "../pages/account";
import ProjectDetailPage from "../pages/project/project_pages/ProjectDetailPage";
import ProjectEditScreen from "../pages/project/project_pages/ProjectEditPage";
import TaskCreateScreen from "../pages/project/project_pages/TaskCreatePage";
import TaskEditScreen from "../pages/project/project_pages/TaskEditScreen";
import TaskAssignPage from "../pages/project/project_pages/TaskAssignPage";
import ProjectCloseScreen from "../pages/project/project_pages/ProjectClosePage";

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
            <Route path="/chat" element={<Chat />} />
            <Route path="/project" element={<Project />}>
              <Route index element={<Navigate to="1" replace />} />

              <Route path=":projectId" element={<ProjectDetailPage />} />
              <Route path=":projectId/edit" element={<ProjectEditScreen />} />

              <Route path=":projectId/tasks/new" element={<TaskCreateScreen />} />
              <Route path=":projectId/tasks/:taskId/edit" element={<TaskEditScreen />} />
              <Route path=":projectId/tasks/:taskId/assign" element={<TaskAssignPage />} />

              <Route path=":projectId/close" element={<ProjectCloseScreen />} />
            </Route>

            <Route path="/my" element={<My />} />
            <Route path="/my/edit" element={<MyEdit />} />
            <Route path="/my/payments" element={<Payments />} />
            <Route path="/my/invitations" element={<Invitations />} />
            <Route path="/my/projects" element={<Projects />} />
            <Route path="/notice" element={<Notice />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
