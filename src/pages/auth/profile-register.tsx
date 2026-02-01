import { useState } from "react";
import Input from "../../components/Input";
import { ROLES, EXPERIENCES } from "../../constants/profile";

export default function ProfileRegister() {
  const [nickname, setNickname] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [experience, setExperience] = useState("");
  const [portfolios, setPortfolios] = useState([
    { description: "", link: "" },
    { description: "", link: "" },
  ]);
  const [introduction, setIntroduction] = useState("");

  const toggleRole = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const roles = [...ROLES];
  const experiences = [...EXPERIENCES];

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
    <main className="mx-auto flex min-h-dvh w-full max-w-screen-sm flex-col bg-white">
      {/* Header */}
      <header className="flex shrink-0 items-center gap-4 border-b border-gray-200 px-4 py-4 bg-white">
        {/* TODO: 뒤로가기 버튼 컴포넌트 추가 */}
        <div className="w-6" />
        <h1 className="login-title flex-1 text-center">프로필 등록</h1>
        <div className="w-6" />
      </header>

      <div className="flex-1 overflow-y-auto px-4 pb-24">
        <p className="login-subtitle text-left text-sm mt-4">정보를 입력하고 OFF에 가입하세요.</p>

        <form className="mt-6 space-y-6 pb-12" onSubmit={handleSubmit}>
          <Input
            id="nickname"
            type="text"
            label="닉네임"
            required
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="프로젝트에 표시할 닉네임을 입력해주세요."
          />

          {/* 프로젝트 희망 직무 */}
          <div className="space-y-2">
            <label className="login-label block">
              프로젝트 희망 직무<span className="profile-multiple-select">(복수 선택 가능)</span><span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {roles.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => toggleRole(role)}
                  className={`profile-button rounded-lg px-4 py-2 transition-colors ${
                    selectedRoles.includes(role)
                      ? "bg-blue-600 selected"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* 프로젝트 경험 횟수 */}
          <div className="space-y-2">
            <label className="login-label block">
              프로젝트 경험 횟수<span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {experiences.map((exp) => (
                <button
                  key={exp}
                  type="button"
                  onClick={() => setExperience(exp)}
                  className={`profile-button rounded-lg px-4 py-2 transition-colors ${
                    experience === exp
                      ? "bg-blue-600 selected"
                      : "bg-gray-100 hover:bg-gray-200"
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
              <label className="login-label">
                포트폴리오 입력
              </label>
              <button
                type="button"
                onClick={addPortfolio}
                className="profile-add-button"
              >
                추가
              </button>
            </div>
            {portfolios.map((portfolio, index) => (
              <div key={index} className="space-y-3">
                <span className="block text-sm font-medium text-gray-900">{index + 1}</span>
                <div className="space-y-3">
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <input
                      type="text"
                      value={portfolio.description}
                      onChange={(e) => updatePortfolio(index, "description", e.target.value)}
                      className="profile-portfolio-input login-input w-full px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:outline-none"
                      placeholder="포트폴리오에 대한 설명을 간략히 입력하세요."
                    />
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <input
                      type="text"
                      value={portfolio.link}
                      onChange={(e) => updatePortfolio(index, "link", e.target.value)}
                      className="profile-portfolio-input login-input w-full px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:outline-none"
                      placeholder="위 포트폴리오에 대한 링크를 입력(notion, google drive 등)"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Input
            id="introduction"
            as="textarea"
            label="내 소개 입력하기"
            value={introduction}
            onChange={(e) => setIntroduction(e.target.value)}
            placeholder="크리에이터와 파트너에게 본인을 소개하세요."
            rows={6}
          />

          <div className="mt-6">
            <button
              type="submit"
              className="auth-primary-button button-primary-text"
            >
              저장하기
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
