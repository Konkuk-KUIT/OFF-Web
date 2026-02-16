// src/pages/my/myEdit.tsx.
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMyProfile,
  mapToMyPageProfile,
  updateMyProfile,
  type MyPageProfile,
  type Portfolio,
} from "../../api/member";

// 서버 enum(ProjectCount)로 변환
type ProjectCount =
  | "ZERO"
  | "ONCE"
  | "TWICE"
  | "THREE_TIMES"
  | "FOUR_TIMES"
  | "PLUS_FIVE";

const numberToProjectCount = (n: number | ""): ProjectCount => {
  if (n === "" || n === 0) return "ZERO";
  switch (n) {
    case 1:
      return "ONCE";
    case 2:
      return "TWICE";
    case 3:
      return "THREE_TIMES";
    case 4:
      return "FOUR_TIMES";
    default:
      return "PLUS_FIVE";
  }
};

export default function MyEdit() {
  const nav = useNavigate();

  // ✅ 폼 타입은 MyPageProfile로 통일
  const [form, setForm] = useState<MyPageProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // ✅ API로 초기 로드
  useEffect(() => {
    (async () => {
      try {
        setErrorMsg("");
        const api = await getMyProfile();
        const mapped = mapToMyPageProfile(api);

        // UI가 2칸 고정이므로 2칸 보장
        const portfolios = [...(mapped.portfolios ?? [])];
        while (portfolios.length < 2) portfolios.push({ desc: "", url: "" });

        setForm({ ...mapped, portfolios });
      } catch (e: any) {
        console.error(e);
        setErrorMsg(
          e?.response?.data?.message ||
            e?.message ||
            "프로필을 불러오지 못했습니다."
        );
        setForm(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const isValid = useMemo(() => {
    if (!form) return false;
    const nicknameOk = form.nickname.trim().length > 0;
    const expOk =
      form.projectExpCount !== "" &&
      Number.isFinite(Number(form.projectExpCount)) &&
      Number(form.projectExpCount) >= 0;
    return nicknameOk && expOk;
  }, [form]);

  const setPortfolio = (idx: number, key: "desc" | "url", value: string) => {
    setForm((prev) => {
      if (!prev) return prev;
      const nextPortfolios = (prev.portfolios ?? []).map((p) => ({ ...p }));
      while (nextPortfolios.length < 2) nextPortfolios.push({ desc: "", url: "" });
      nextPortfolios[idx] = { ...(nextPortfolios[idx] ?? { desc: "", url: "" }) };
      nextPortfolios[idx][key] = value;
      return { ...prev, portfolios: nextPortfolios };
    });
  };

  // ✅ PATCH 저장
  const onSave = async () => {
    if (!form || !isValid || saving) return;

    setSaving(true);
    setErrorMsg("");

    try {
      await updateMyProfile({
        nickname: form.nickname,
        projectCount: numberToProjectCount(form.projectExpCount),
        selfIntroduction: form.bio,
        portfolioList: (form.portfolios ?? []).map((p: Portfolio) => ({
          description: p.desc ?? "",
          link: p.url ?? "",
        })),
      });

      nav("/my", { replace: true });
    } catch (e: any) {
      console.error(e);
      setErrorMsg(
        e?.response?.data?.message || e?.message || "저장에 실패했습니다."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="w-full bg-white px-5 pt-6 text-[13px] text-gray-400">
        불러오는 중...
      </main>
    );
  }

  if (!form) {
    return (
      <main className="w-full bg-white px-5 pt-6">
        <p className="text-[13px] text-red-500">
          {errorMsg || "프로필을 불러오지 못했습니다."}
        </p>
      </main>
    );
  }

  return (
    <main className="w-full bg-white">
      <section className="px-5 pt-4 pb-24">
        <p className="text-[12px] text-gray-400">
          정보를 입력하고 OFF에 가입하세요.
        </p>

        {errorMsg ? (
          <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-[13px] text-red-600">
            {errorMsg}
          </div>
        ) : null}

        <div className="mt-5 space-y-5">
          <div>
            <label className="block text-[14px] font-semibold text-black">
              닉네임<span className="text-red-500">*</span>
            </label>
            <input
              value={form.nickname}
              onChange={(e) => setForm((p) => (p ? { ...p, nickname: e.target.value } : p))}
              placeholder="프로젝트에 표시할 닉네임을 입력해주세요."
              className="mt-2 w-full rounded-xl bg-gray-100 px-4 py-3 text-[14px] outline-none placeholder:text-gray-400"
            />
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <p className="text-[14px] font-semibold text-black">프로젝트 희망 직무</p>
            </div>
            <div className="mt-3 flex gap-2">
              <p className="mt-3 text-[14px] text-gray-700">{form.desiredJob}</p>
            </div>
          </div>

          <div>
            <label className="block text-[14px] font-semibold text-black">
              프로젝트 경험 횟수<span className="text-red-500">*</span>
            </label>
            <input
              value={form.projectExpCount}
              onChange={(e) => {
                const v = e.target.value;
                if (v === "") return setForm((p) => (p ? { ...p, projectExpCount: "" } : p));
                if (!/^\d+$/.test(v)) return;
                setForm((p) => (p ? { ...p, projectExpCount: Number(v) } : p));
              }}
              inputMode="numeric"
              placeholder="숫자를 입력해주세요."
              className="mt-2 w-full rounded-xl bg-gray-100 px-4 py-3 text-[14px] outline-none placeholder:text-gray-400"
            />
          </div>

          <div>
            <p className="text-[14px] font-semibold text-black">포트폴리오 입력</p>

            {[0, 1].map((i) => (
              <div key={i} className="mt-3">
                <p className="mb-2 text-[12px] text-gray-500">{i + 1}</p>

                <input
                  value={form.portfolios[i]?.desc ?? ""}
                  onChange={(e) => setPortfolio(i, "desc", e.target.value)}
                  placeholder="포트폴리오에 대한 설명을 간단히 입력하세요."
                  className="w-full rounded-xl bg-gray-100 px-4 py-3 text-[14px] outline-none placeholder:text-gray-400"
                />

                <input
                  value={form.portfolios[i]?.url ?? ""}
                  onChange={(e) => setPortfolio(i, "url", e.target.value)}
                  placeholder="위 포트폴리오에 대한 링크를 입력(notlon, google drive 등)"
                  className="mt-2 w-full rounded-xl bg-gray-100 px-4 py-3 text-[14px] outline-none placeholder:text-gray-400"
                />
              </div>
            ))}
          </div>

          <div>
            <p className="text-[14px] font-semibold text-black">내 소개 입력하기</p>
            <textarea
              value={form.bio}
              onChange={(e) => setForm((p) => (p ? { ...p, bio: e.target.value } : p))}
              placeholder="크리에이터와 파트너에게 본인을 소개하세요."
              className="mt-2 min-h-[140px] w-full resize-none rounded-xl bg-gray-100 px-4 py-3 text-[14px] outline-none placeholder:text-gray-400"
            />
          </div>
        </div>
      </section>

      <div className="fixed bottom-0 left-0 right-0 mx-auto w-full max-w-screen-sm bg-white px-5 pb-6 pt-3">
        <button
          type="button"
          onClick={onSave}
          disabled={!isValid || saving}
          className={[
            "w-full rounded-full py-4 text-[16px] font-semibold",
            isValid && !saving
              ? "bg-blue-600 text-white"
              : "bg-blue-300 text-white/90",
          ].join(" ")}
        >
          {saving ? "저장 중..." : "저장하기"}
        </button>
      </div>
    </main>
  );
}
