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
          {/* 공개 라우트 (Auth) */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile-register" element={<ProfileRegister />} />

          {/* 보호 라우트 (Protected) */}
          <Route element={<ProtectedRoute />}>
            {/* 메인 */}
            <Route path="/" element={<Home />} />
            <Route path="/account" element={<Account />} />
            <Route path="/notice" element={<Notice />} />
            <Route path="/home/profile-edit" element={<ProfileEdit />} />

            {/* 마이페이지 */}
            <Route path="/my" element={<My />} />
            <Route path="/my/edit" element={<MyEdit />} />
            <Route path="/my/payments" element={<Payments />} />
            <Route path="/my/invitations" element={<Invitations />} />
            <Route path="/my/projects" element={<Projects />} />

            {/* 채팅 (Chat.tsx 내부에서 /chat, /chat/:id 처리) */}
            <Route path="/chat/*" element={<Chat />} />

            {/* 파트너 */}
            <Route path="/partner/:id" element={<PartnerDetail />} />
            <Route path="/partner/supported" element={<SupportedPartner />} />
            <Route path="/partner/supported/confirm" element={<SupportedPartnerConfirm />} />

            {/* 프로젝트 생성 및 모집 */}
            <Route path="/project/create" element={<ProjectCreate />} />
            <Route path="/project/partner-recruit" element={<PartnerRecruit />} />

            {/* 프로젝트 상세 */}
            <Route path="/project" element={<Project />}>
              <Route index element={<ProjectIndexRedirect />} />

              <Route path=":projectId" element={<ProjectDetailPage />} />
              <Route path=":projectId/edit" element={<ProjectEditScreen />} />
              <Route path=":projectId/close" element={<ProjectCloseScreen />} />

              {/* 태스크 관련 */}
              <Route path=":projectId/tasks/new" element={<TaskCreateScreen />} />
              <Route path=":projectId/tasks/:taskId/edit" element={<TaskEditScreen />} />
              <Route path=":projectId/tasks/:taskId/assign" element={<TaskAssignPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter >
  );
}

function ProjectIndexRedirect() {
  const lastId = localStorage.getItem("lastViewedProjectId");
  // 마지막으로 본 프로젝트가 있으면 거기로, 없으면 홈으로
  return <Navigate to={lastId ? `/project/${lastId}` : "/"} replace />;
}
