import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Input from "../../components/Input";
import { ROLES, EXPERIENCES } from "../../constants/profile";
import { signup } from "../../api/auth";
import type { SignupStep1State } from "./signup";

const ROLE_TO_API: Record<string, string> = {
  기획자: "PM",
  개발자: "DEV",
  디자이너: "DES",
  마케터: "MAR",
};

// role: PM, DEV, DES, MAR 중 하나
const ROLE_VALUES = ["PM", "DEV", "DES", "MAR"] as const;
// projectCount: ZERO, ONCE, TWICE, THREE_TIMES, FOUR_TIMES, PLUS_FIVE 중 하나
const PROJECT_COUNT_VALUES = ["ZERO", "ONCE", "TWICE", "THREE_TIMES", "FOUR_TIMES", "PLUS_FIVE"] as const;
const EXPERIENCE_TO_API: Record<string, (typeof PROJECT_COUNT_VALUES)[number]> = {
  없음: "ZERO",
  "1회": "ONCE",
  "2회": "TWICE",
  "3회": "THREE_TIMES",
  "4회": "FOUR_TIMES",
  "5회 이상": "PLUS_FIVE",
};

const MIN_PASSWORD_LENGTH = 8;
const MAX_NICKNAME_LENGTH = 50;
const MAX_SELF_INTRODUCTION_LENGTH = 1000;
const VALID_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ProfileRegister() {
  const location = useLocation();
  const navigate = useNavigate();
  const step1State = location.state as SignupStep1State | undefined;

  const [nickname, setNickname] = useState("");
  const [role, setRole] = useState("");
  const [projectCount, setProjectCount] = useState("");
  const [portfolios, setPortfolios] = useState([
    { description: "", link: "" },
    { description: "", link: "" },
  ]);
  const [introduction, setIntroduction] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updatePortfolio = (index: number, field: "description" | "link", value: string) => {
    setPortfolios((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p))
    );
  };

  const addPortfolio = () => {
    setPortfolios((prev) => [...prev, { description: "", link: "" }]);
  };

  const nicknameError = nickname.length > MAX_NICKNAME_LENGTH ? "닉네임은 50자 이내여야 합니다." : null;
  const introductionError = introduction.length > MAX_SELF_INTRODUCTION_LENGTH ? "자기소개는 최대 1000자까지 작성 가능합니다." : null;

  const isFormValid =
    nickname.trim() !== "" &&
    nickname.length <= MAX_NICKNAME_LENGTH &&
    role !== "" &&
    projectCount !== "" &&
    introduction.length <= MAX_SELF_INTRODUCTION_LENGTH;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    if (!step1State?.email) {
      navigate("/signup", { replace: true });
      return;
    }
    if (!isFormValid || isSubmitting) return;
    if (step1State.password.length < MIN_PASSWORD_LENGTH) {
      setErrorMessage("최소 8자 이상 입력해야 합니다.");
      return;
    }
    if (!VALID_EMAIL_REGEX.test(step1State.email.trim())) {
      setErrorMessage("유효한 이메일 주소를 입력해주세요.");
      return;
    }

    const roleValue = ROLE_TO_API[role];
    const projectCountValue = EXPERIENCE_TO_API[projectCount];
    if (!roleValue || !ROLE_VALUES.includes(roleValue as (typeof ROLE_VALUES)[number])) {
      setErrorMessage("직무는 PM, DEV, DES, MAR 중 하나만 선택해주세요.");
      return;
    }
    if (!projectCountValue || !PROJECT_COUNT_VALUES.includes(projectCountValue)) {
      setErrorMessage("경험 횟수는 ZERO, ONCE, TWICE, THREE_TIMES, FOUR_TIMES, PLUS_FIVE 중 하나만 가능합니다.");
      return;
    }

    const payload = {
      name: step1State.name,
      birth: step1State.birth,
      email: step1State.email,
      password: step1State.password,
      nickname: nickname.trim(),
      role: roleValue,
      projectCount: projectCountValue,
      selfIntroduction: introduction.trim(),
      portfolioList: portfolios.map((p) => ({
        description: p.description,
        link: p.link,
      })),
    };

    setIsSubmitting(true);
    try {
      await signup(payload);
      navigate("/login", { state: { message: "회원가입이 완료되었습니다." } });
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { message?: string }; status?: number }; message?: string };
      const res = ax?.response;
      if (res?.status === 409) {
        setErrorMessage("이미 사용 중인 이메일입니다.");
      } else if (res?.data && typeof res.data === "object" && "message" in res.data) {
        setErrorMessage((res.data as { message?: string }).message ?? "회원가입에 실패했습니다.");
      } else if (res?.status) {
        setErrorMessage(`요청이 실패했습니다. (${res.status})`);
      } else {
        setErrorMessage("서버에 연결할 수 없습니다. 주소와 서버 실행 여부를 확인해주세요.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!step1State?.email) {
      navigate("/signup", { replace: true });
    }
  }, [step1State?.email, navigate]);

  if (!step1State?.email) {
    return null;
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-screen-sm flex-col bg-white">
      <header className="flex shrink-0 items-center gap-4 border-b border-gray-200 bg-white px-4 py-4">
        <div className="w-6" />
        <h1 className="login-title flex-1 text-center">프로필 등록</h1>
        <div className="w-6" />
      </header>

      <div className="flex-1 overflow-y-auto px-4 pb-24">
        <p className="login-subtitle mt-4 text-left text-sm">
          정보를 입력하고 OFF에 가입하세요.
        </p>

        <form className="mt-6 space-y-6 pb-12" onSubmit={handleSubmit}>
          {step1State.password.length > 0 && step1State.password.length < MIN_PASSWORD_LENGTH && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              최소 8자 이상 입력해야 합니다. 회원가입 단계에서 비밀번호를 수정해주세요.
            </div>
          )}
          <div>
            <Input
              id="nickname"
              type="text"
              label="닉네임"
              required
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="프로젝트에 표시할 닉네임을 입력해주세요."
              maxLength={MAX_NICKNAME_LENGTH}
            />
            {nicknameError ? (
              <p className="mt-1 text-sm text-red-600">{nicknameError}</p>
            ) : (
              <p className="mt-1 text-xs text-zinc-500">닉네임은 50자 이내여야 합니다.</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="login-label block">
              프로젝트 희망 직무<span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {ROLES.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`profile-button rounded-lg px-4 py-2 transition-colors ${
                    role === r ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="login-label block">
              프로젝트 경험 횟수<span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {EXPERIENCES.map((exp) => (
                <button
                  key={exp}
                  type="button"
                  onClick={() => setProjectCount(exp)}
                  className={`profile-button rounded-lg px-4 py-2 transition-colors ${
                    projectCount === exp
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {exp}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="login-label">포트폴리오 입력</label>
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
                <span className="block text-sm font-medium text-gray-900">
                  {index + 1}
                </span>
                <div className="space-y-3">
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <input
                      type="text"
                      value={portfolio.description}
                      onChange={(e) =>
                        updatePortfolio(index, "description", e.target.value)
                      }
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

          <div>
            <Input
              id="introduction"
              as="textarea"
              label="내 소개 입력하기"
              value={introduction}
              onChange={(e) => setIntroduction(e.target.value)}
              placeholder="크리에이터와 파트너에게 본인을 소개하세요."
              rows={6}
              maxLength={MAX_SELF_INTRODUCTION_LENGTH}
            />
            {introductionError ? (
              <p className="mt-1 text-sm text-red-600">{introductionError}</p>
            ) : (
              <p className="mt-1 text-xs text-zinc-500">자기소개는 최대 1000자까지 작성 가능합니다.</p>
            )}
          </div>

          {errorMessage && (
            <p className="text-sm text-red-600">{errorMessage}</p>
          )}

          <div className="mt-6">
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="auth-primary-button button-primary-text disabled:opacity-50"
            >
              {isSubmitting ? "처리 중..." : "저장하기"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
