import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Page from "../../components/Page";

const ROLES = [
  { id: "planner", label: "기획자" },
  { id: "developer", label: "개발자" },
  { id: "designer", label: "디자이너" },
  { id: "marketer", label: "마케터" },
  { id: "editor", label: "영상 편집자" },
] as const;

const labelClass = "block text-sm font-semibold text-zinc-900";
const inputClass =
  "mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:ring-2 focus:ring-[#0060EF]/30";

type PortfolioItem = { desc: string; url: string };

export default function ProfileEdit() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>(["developer"]);
  const [projectExpCount, setProjectExpCount] = useState("");
  const [portfolios, setPortfolios] = useState<PortfolioItem[]>([
    { desc: "", url: "" },
    { desc: "", url: "" },
  ]);
  const [bio, setBio] = useState("");
  const [showCompleteToast, setShowCompleteToast] = useState(false);

  const toggleRole = (id: string) => {
    setSelectedRoles((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const setPortfolio = (idx: number, key: "desc" | "url", value: string) => {
    setPortfolios((prev) => {
      const next = prev.map((p) => ({ ...p }));
      next[idx] = { ...next[idx], [key]: value };
      return next;
    });
  };

  const addPortfolio = () => {
    setPortfolios((prev) => [...prev, { desc: "", url: "" }]);
  };

  const handleSubmit = () => {
    setShowCompleteToast(true);
    setTimeout(() => {
      setShowCompleteToast(false);
      navigate("/");
    }, 2000);
  };

  return (
    <Page className="pt-2 pb-28">
      {showCompleteToast && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
          <div
            className="flex h-[50px] w-[304px] items-center justify-center rounded-[50px] bg-[#9B9B9B] text-center text-white"
          >
            지원이 완료되었습니다.
          </div>
        </div>
      )}
      <p className="mb-5 text-sm text-zinc-500">
        정보를 입력하고 OFF에 가입하세요.
      </p>

      <div className="space-y-5">
        {/* 닉네임 */}
        <div>
          <label className={labelClass}>
            닉네임<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="프로젝트에 표시할 닉네임을 입력해주세요."
            className={inputClass}
          />
        </div>

        {/* 프로젝트 희망 직무 */}
        <div>
          <label className={labelClass}>
            프로젝트 희망 직무(복수 선택 가능)
            <span className="text-red-500">*</span>
          </label>
          <div className="mt-2 flex flex-wrap gap-2">
            {ROLES.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => toggleRole(r.id)}
                className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                  selectedRoles.includes(r.id)
                    ? "border-[#0060EF] bg-[rgba(0,96,239,0.15)] text-[#0060EF]"
                    : "border-zinc-200 bg-zinc-100 text-zinc-700"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* 프로젝트 경험 횟수 */}
        <div>
          <label className={labelClass}>
            프로젝트 경험 횟수<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={projectExpCount}
            onChange={(e) => {
              const v = e.target.value;
              if (v === "" || /^\d+$/.test(v)) setProjectExpCount(v);
            }}
            placeholder="숫자를 입력해주세요."
            className={inputClass}
          />
        </div>

        {/* 포트폴리오 입력 */}
        <div>
          <div className="flex items-center justify-between">
            <label className={labelClass}>포트폴리오 입력</label>
            <button
              type="button"
              onClick={addPortfolio}
              className="rounded-lg border border-zinc-200 bg-zinc-100 px-3 py-1.5 text-sm font-medium text-zinc-700"
            >
              추가
            </button>
          </div>
          {portfolios.map((item, i) => (
            <div key={i} className="mt-3">
              <p className="mb-2 text-xs text-zinc-500">{i + 1}</p>
              <textarea
                value={item.desc}
                onChange={(e) => setPortfolio(i, "desc", e.target.value)}
                placeholder="포트폴리오에 대한 설명을 간략히 입력하세요."
                className={`${inputClass} min-h-[80px] resize-y`}
                rows={2}
              />
              <input
                type="url"
                value={item.url}
                onChange={(e) => setPortfolio(i, "url", e.target.value)}
                placeholder="위 포트폴리오에 대한 링크를 입력(notion, google drive 등)"
                className={`${inputClass} mt-2`}
              />
            </div>
          ))}
        </div>

        {/* 내 소개 입력하기 */}
        <div>
          <label className={labelClass}>내 소개 입력하기</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="크리에이터와 파트너에게 본인을 소개하세요."
            className={`${inputClass} min-h-[140px] resize-y`}
            rows={5}
          />
        </div>
      </div>

      {/* 지원하기 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 z-10 mx-auto w-full max-w-screen-sm border-t border-zinc-100 bg-white px-4 pb-8 pt-4">
        <button
          type="button"
          onClick={handleSubmit}
          className="w-full rounded-full bg-[#0060EF] py-4 text-base font-semibold text-white"
        >
          지원하기
        </button>
      </div>
    </Page>
  );
}
