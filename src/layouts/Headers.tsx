// Headers.tsx
import { useLocation } from "react-router-dom";
import HeaderPrev from "./headers/headerPrev";

export default function Headers() {
  const { pathname } = useLocation();

  // 뒤로가기 헤더가 필요한 페이지들
  const prevHeaderRoutes = ["/chat", "/project", "/notice"];

  const isPrev = prevHeaderRoutes.includes(pathname);

  return isPrev ? <HeaderPrev /> : <HeaderPrev />;
}