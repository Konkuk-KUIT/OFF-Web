import { useNavigate } from "react-router-dom";

const logoUrl = new URL("../../assets/layouts/header/logo.svg", import.meta.url).href;

export default function Intro() {
  const navigate = useNavigate();

  return (
    <main className="flex min-h-dvh w-full flex-col items-center justify-between bg-white px-6 pb-12 pt-24">
      <div className="flex flex-1 flex-col items-center justify-center">
        <img src={logoUrl} alt="OFF the Limit" className="h-12 w-auto" />
        <p className="mt-4 text-center text-base text-zinc-600">
          AI로 아이디어 실행시키기
        </p>
      </div>
      <button
        type="button"
        onClick={() =>
          navigate("/login", { state: { from: { pathname: "/home" } } })
        }
        className="w-full max-w-[340px] rounded-xl bg-[#0060EF] py-4 text-base font-semibold text-white"
      >
        OFF와 함께 하기
      </button>
    </main>
  );
}
