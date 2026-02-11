// Headers.tsx
import { useLocation } from "react-router-dom";
import HeaderPrev from "./headers/headerPrev";
import LogoPrev from "./headers/logoHeader";

export default function Headers() {
  const { pathname } = useLocation();

  // 채팅방(/chat/:id)은 자체 헤더 사용 → 앱 헤더 숨김
  if (/^\/chat\/[^/]+/.test(pathname)) {
    return null;
  }

  // 뒤로가기 헤더가 필요한 페이지들
  const prevHeaderRoutes = ["/chat", "/project", "/project/create", "/project/partner-recruit", "/notice", "/my", "/my/edit", "/my/payments", "/my/invitations", "/my/projects", "/account"];

  const isPrev = prevHeaderRoutes.includes(pathname);

  return isPrev ? <HeaderPrev /> : <LogoPrev />;
}