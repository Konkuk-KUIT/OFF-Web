// src/pages/my/my.tsx
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

type Profile = {
  name: string;
  nickname: string;
  desiredJob: "기획자" | "개발자";
  projectExpCount: number | "";
  portfolios: { desc: string; url: string }[];
  bio: string;
  project: string;
};

const STORAGE_KEY = "off_profile_v1";

const DEFAULT_PROFILE: Profile = {
  name: "김쿠잇",
  nickname: "11111111111",
  desiredJob: "기획자",
  projectExpCount: 1,
  portfolios: [
    { desc: "", url: "" },
    { desc: "", url: "" },
  ],
  bio: "",
  project: "어플 개발 프로젝트",
};

export default function My() {
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      setProfile(JSON.parse(raw));
    } catch {
      // ignore -> 기본값 사용
    }
  }, []);

  const menus = [
    { label: "참여한 프로젝트", to: "/my/projects" },
    { label: "요청 내역", to: "/my/invitations" },
    { label: "결제 내역", to: "/my/payments" },
  ];

  return (
    <main className="w-full bg-white">
      <section className="px-5 pt-6">
        <div className="flex items-start justify-between">
          <div className="space-y-5">
            <div>
              <p className="text-[16px] font-semibold text-black">이름</p>
              <p className="mt-1 text-[13px] text-gray-400">{profile.name}</p>
            </div>

            <div>
              <p className="text-[16px] font-semibold text-black">닉네임</p>
              <p className="mt-1 text-[13px] text-gray-400">{profile.nickname}</p>
            </div>

            <div>
              <p className="text-[16px] font-semibold text-black">내가 속한 프로젝트</p>
              <p className="mt-1 text-[13px] text-gray-400">{profile.project}</p>
            </div>

            <div>
              <p className="text-[16px] font-semibold text-black">나의 역할</p>
              <p className="mt-1 text-[13px] text-gray-400">{profile.desiredJob}</p>
            </div>

            <div>
              <p className="text-[16px] font-semibold text-black">마이 포트폴리오</p>
            </div>
          </div>

          <Link to="/my/edit" className="mt-1 text-[13px] font-medium text-gray-500">
            수정하기
          </Link>
        </div>
      </section>

      <div className="mt-6 border-t border-gray-200" />

      <nav className="divide-y divide-gray-200">
        {menus.map((m) => (
          <Link key={m.label} to={m.to} className="flex items-center justify-between px-5 py-4">
            <span className="text-[16px] font-semibold text-black">{m.label}</span>
            <span className="flex items-center gap-2 text-[13px] text-gray-500">
              자세히 보기 <span className="text-gray-400">{">"}</span>
            </span>
          </Link>
        ))}
      </nav>
    </main>
  );
}

export { STORAGE_KEY, DEFAULT_PROFILE };
export type { Profile };
