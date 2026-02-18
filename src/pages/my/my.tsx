// src/pages/my/my.tsx
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getMyProfile,
  mapToMyPageProfile,
  type MyPageProfile,
  type Portfolio,
} from "../../api/member";

export default function My() {
  const [profile, setProfile] = useState<MyPageProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const api = await getMyProfile();
      setProfile(mapToMyPageProfile(api));
    } catch (e) {
      console.error(e);
      setProfile(null);
      const status = (e as { response?: { status?: number } })?.response?.status;
      setError(
        status === 500
          ? "일시적인 서버 오류입니다. 잠시 후 다시 시도해 주세요."
          : "프로필을 불러오지 못했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const menus = [
    { label: "참여한 프로젝트", to: "/my/projects" },
    { label: "요청 내역", to: "/my/invitations" },
    { label: "결제 내역", to: "/my/payments" },
  ] as const;

  if (loading) {
    return (
      <main className="w-full bg-white p-5 text-[13px] text-gray-400">
        불러오는 중...
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="w-full bg-white p-5">
        <p className="text-[13px] text-red-500">{error ?? "프로필을 불러오지 못했습니다."}</p>
        <button
          type="button"
          onClick={fetchProfile}
          disabled={loading}
          className="mt-3 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 disabled:opacity-50"
        >
          다시 시도
        </button>
      </main>
    );
  }

  return (
    <main className="w-full bg-white">
      <section className="px-5 pt-6">
        <div className="flex items-start justify-between">
          <div className="space-y-5">
            <Info label="이름" value={profile.name} />
            <Info label="닉네임" value={profile.nickname} />
            <Info label="내가 속한 프로젝트" value={profile.project} />
            <Info label="나의 역할" value={profile.desiredJob} />

            <div>
              <p className="text-[16px] font-semibold text-black">마이 포트폴리오</p>

              <div className="mt-2 space-y-2">
                {profile.portfolios.length ? (
                  profile.portfolios.map((p: Portfolio, idx: number) => (
                    <div key={idx} className="text-[13px] text-gray-400">
                      <div>{p.desc || "-"}</div>
                      {p.url ? (
                        <a
                          className="underline"
                          href={p.url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {p.url}
                        </a>
                      ) : (
                        <div>-</div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-[13px] text-gray-400">-</p>
                )}
              </div>
            </div>
          </div>

          <Link
            to="/my/edit"
            className="mt-1 text-[13px] font-medium text-gray-500"
          >
            수정하기
          </Link>
        </div>
      </section>

      <div className="mt-6 border-t border-gray-200" />

      <nav className="divide-y divide-gray-200">
        {menus.map((m) => (
          <Link
            key={m.label}
            to={m.to}
            className="flex items-center justify-between px-5 py-4"
          >
            <span className="text-[16px] font-semibold text-black">
              {m.label}
            </span>
            <span className="flex items-center gap-2 text-[13px] text-gray-500">
              자세히 보기 <span className="text-gray-400">{">"}</span>
            </span>
          </Link>
        ))}
      </nav>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="text-[16px] font-semibold text-black">{label}</p>
      <p className="mt-1 text-[13px] text-gray-400">{value}</p>
    </div>
  );
}
