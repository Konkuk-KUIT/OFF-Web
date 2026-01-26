import { useLocation, useNavigate } from "react-router-dom";
import PrevIcon from "../../assets/layouts/header/Prev.svg";

export default function Headers() {
  const navigate = useNavigate();
  const location = useLocation();

  const titleMap: Record<string, string> = {
    "/": "Home",
    "/chat": "Chat",
    "/project": "Project",
    "/notice": "Notice",
    "/my": "My",
  };

  const title = titleMap[location.pathname] ?? "";

  return (
    <>
      <header className="fixed top-0 z-50 w-full h-[5%] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.1)] flex items-center relative">
        <img
          src={PrevIcon}
          alt="back"
          onClick={() => navigate(-1)}
          className="absolute left-4 w-6 h-6 cursor-pointer"
        />

        <h1 className="absolute left-1/2 -translate-x-1/2 text-base font-semibold">
          {title}
        </h1>
      </header>
    </>
  );
}