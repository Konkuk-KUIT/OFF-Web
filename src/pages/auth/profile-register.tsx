import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProfileRegister() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [experience, setExperience] = useState("");
  const [portfolios, setPortfolios] = useState([
    { description: "", link: "" },
    { description: "", link: "" },
  ]);
  const [introduction, setIntroduction] = useState("");

  const roles = ["기획자", "개발자", "디자이너", "마케터"];
  const experiences = ["없음", "1회", "2회", "3회", "4회", "5회 이상"];

  const toggleRole = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const updatePortfolio = (index: number, field: "description" | "link", value: string) => {
    setPortfolios((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p))
    );
  };

  const addPortfolio = () => {
    setPortfolios((prev) => [...prev, { description: "", link: "" }]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 프로필 등록 로직 구현
    console.log("프로필 등록:", {
      nickname,
      selectedRoles,
      experience,
      portfolios,
      introduction,
    });
  };

  return (
    <main className="mx-auto flex h-screen w-full max-w-screen-sm flex-col overflow-hidden bg-white">
      {/* Header */}
      <header className="flex items-center gap-4 border-b border-gray-200 px-4 py-4">
        {/* TODO: 뒤로가기 버튼 컴포넌트 추가 */}
        <div className="w-6" />
        <h1 className="flex-1 text-center text-lg font-semibold text-gray-900">프로필 등록</h1>
        <div className="w-6" /> {/* Spacer for centering */}
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4">
        <p className="mt-4 text-sm text-gray-600">정보를 입력하고 OFF에 가입하세요.</p>

        <form className="mt-6 space-y-6 pb-6" onSubmit={handleSubmit}>
          {/* 닉네임 */}
          <div className="space-y-2">
            <label htmlFor="nickname" className="block text-sm font-medium text-gray-900">
              닉네임<span className="text-red-500">*</span>
            </label>
            <input
              id="nickname"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-blue-500 focus:bg-white"
              placeholder="프로젝트에 표시할 닉네임을 입력해주세요."
            />
          </div>

          {/* 프로젝트 희망 직무 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-900">
              프로젝트 희망 직무(복수 선택 가능)<span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {roles.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => toggleRole(role)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    selectedRoles.includes(role)
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* 프로젝트 경험 횟수 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-900">
              프로젝트 경험 횟수<span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {experiences.map((exp) => (
                <button
                  key={exp}
                  type="button"
                  onClick={() => setExperience(exp)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    experience === exp
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  {exp}
                </button>
              ))}
            </div>
          </div>

          {/* 포트폴리오 입력 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-900">
                포트폴리오 입력
              </label>
              <button
                type="button"
                onClick={addPortfolio}
                className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
              >
                추가
              </button>
            </div>
            {portfolios.map((portfolio, index) => (
              <div key={index} className="space-y-3">
                <span className="block text-sm font-medium text-gray-900">{index + 1}</span>
                <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <input
                    type="text"
                    value={portfolio.description}
                    onChange={(e) => updatePortfolio(index, "description", e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-blue-500"
                    placeholder="포트폴리오에 대한 설명을 간략히 입력하세요."
                  />
                  <input
                    type="text"
                    value={portfolio.link}
                    onChange={(e) => updatePortfolio(index, "link", e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-blue-500"
                    placeholder="위 포트폴리오에 대한 링크를 입력(notion, google drive 등)"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* 내 소개 입력하기 */}
          <div className="space-y-2">
            <label htmlFor="introduction" className="block text-sm font-medium text-gray-900">
              내 소개 입력하기
            </label>
            <textarea
              id="introduction"
              value={introduction}
              onChange={(e) => setIntroduction(e.target.value)}
              rows={6}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-blue-500 focus:bg-white"
              placeholder="크리에이터와 파트너에게 본인을 소개하세요."
            />
          </div>
        </form>
      </div>

      {/* 저장하기 버튼 - Fixed at bottom */}
      <div className="border-t border-gray-200 bg-white px-4 py-4">
        <button
          type="submit"
          onClick={handleSubmit}
          className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 active:bg-blue-800"
        >
          저장하기
        </button>
      </div>
    </main>
  );
}
