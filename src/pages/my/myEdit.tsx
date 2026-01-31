import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DEFAULT_PROFILE, STORAGE_KEY } from "./my";
import type { Profile } from "./my";

export default function MyEdit() {
  const nav = useNavigate();
  const [form, setForm] = useState<Profile>(DEFAULT_PROFILE);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      setForm(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  const isValid = useMemo(() => {
    const nicknameOk = form.nickname.trim().length > 0;
    const expOk =
      form.projectExpCount !== "" &&
      Number.isFinite(Number(form.projectExpCount)) &&
      Number(form.projectExpCount) >= 0;
    return nicknameOk && expOk;
  }, [form.nickname, form.projectExpCount]);

  const setPortfolio = (idx: number, key: "desc" | "url", value: string) => {
    setForm((prev) => {
      const next = { ...prev, portfolios: prev.portfolios.map((p) => ({ ...p })) };
      next.portfolios[idx][key] = value;
      return next;
    });
  };

  const onSave = () => {
    if (!isValid) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    nav("/my");
  };

  return (
    <main className="w-full bg-white">
      <section className="px-5 pt-4 pb-24">
        <p className="text-[12px] text-gray-400">정보를 입력하고 OFF에 가입하세요.</p>

        <div className="mt-5 space-y-5">
          <div>
            <label className="block text-[14px] font-semibold text-black">
              닉네임<span className="text-red-500">*</span>
            </label>
            <input
              value={form.nickname}
              onChange={(e) => setForm((p) => ({ ...p, nickname: e.target.value }))}
              placeholder="프로젝트에 표시할 닉네임을 입력해주세요."
              className="mt-2 w-full rounded-xl bg-gray-100 px-4 py-3 text-[14px] outline-none placeholder:text-gray-400"
            />
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <p className="text-[14px] font-semibold text-black">프로젝트 희망 직무</p>
            </div>

            <div className="mt-3 flex gap-2">
                <p className="mt-3 text-[14px] text-gray-700">
                    {form.desiredJob}
                </p>
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
                if (v === "") return setForm((p) => ({ ...p, projectExpCount: "" }));
                if (!/^\d+$/.test(v)) return;
                setForm((p) => ({ ...p, projectExpCount: Number(v) }));
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
              onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
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
          disabled={!isValid}
          className={[
            "w-full rounded-full py-4 text-[16px] font-semibold",
            isValid ? "bg-blue-600 text-white" : "bg-blue-300 text-white/90",
          ].join(" ")}
        >
          저장하기
        </button>
      </div>
    </main>
  );
}
