import { useLocation, useNavigate } from "react-router-dom";
import PrevIcon from "../../assets/layouts/header/Prev.svg";

export default function Headers() {
  const navigate = useNavigate();
  const location = useLocation();

  const titleMap: Record<string, string> = {
    "/": "Home",
    "/chat": "채팅",
    "/project": "Project",
    "/project/create": "프로젝트 생성",
    "/project/partner-recruit": "파트너 모집",
    "/notice": "알림",
    "/my": "My",
    "/account": "결제하기",
  };

  const title = titleMap[location.pathname] ?? "";

  return (
    <>
      <header className="fixed top-0 z-50 w-full h-[5%] bg-white flex items-center relative">
        <img
          src={PrevIcon}
          alt="back"
          onClick={() => navigate(-1)}
          className="absolute left-4 w-6 h-6 cursor-pointer"
        />

        <h1 className="header-prev-title absolute left-1/2 -translate-x-1/2">
          {title}
        </h1>
      </header>
    </>
  );
}