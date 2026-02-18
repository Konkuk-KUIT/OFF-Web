import { useEffect } from "react";

const logoUrl = new URL("../../assets/layouts/header/logo.svg", import.meta.url).href;

export default function SplashScreen() {
  useEffect(() => {
    document.getElementById("splash")?.remove();
  }, []);

  return (
    <main
      className="flex min-h-dvh w-full flex-col items-center justify-center bg-white"
      style={{ minHeight: "100dvh" }}
    >
      <div className="flex flex-col items-center justify-center gap-4">
        <img src={logoUrl} alt="OFF the Limit" className="h-14 w-auto" />
        <p className="text-center text-base font-semibold text-[#0060EF]">OFF the Limit</p>
        <p
          className="text-center"
          style={{
            color: "var(--gray-gray_800, #333)",
            fontFamily: "Inter, sans-serif",
            fontSize: "16px",
            fontStyle: "normal",
            fontWeight: 700,
            lineHeight: "24px",
            letterSpacing: "-0.16px",
          }}
        >
          AI로 아이디어 실현시키기
        </p>
      </div>
    </main>
  );
}
