// Headers.tsx
import { useLocation } from "react-router-dom";
import HeaderPrev from "./headers/headerPrev";
import LogoPrev from "./headers/logoHeader";

export default function Headers() {
  const { pathname } = useLocation();



  // 뒤로가기 헤더가 필요한 페이지들 (/partner/:id 포함)
  const prevHeaderRoutes = ["/chat", "/project", "/project/create", "/project/partner-recruit", "/notice", "/my", "/my/edit", "/home/profile-edit", "/my/payments", "/my/invitations", "/my/projects", "/account", "/account/success", "/partner/supported", "/partner/supported/confirm"];
  const isPrev = prevHeaderRoutes.includes(pathname) || 
               [/^\/partner\//, /^\/project\/\d+/, /^\/chat\/[^/]+/].some(regex => regex.test(pathname));

  return isPrev ? <HeaderPrev /> : <LogoPrev />;
}