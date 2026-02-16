import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Input";

/** 회원가입 1단계에서 프로필 등록 페이지로 넘길 데이터 */
export type SignupStep1State = {
  name: string;
  birth: string;
  email: string;
  password: string;
};

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [birth, setBirth] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeMarketing, setAgreeMarketing] = useState(false);
  const [agreeAll, setAgreeAll] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleAgreeAll = (checked: boolean) => {
    setAgreeAll(checked);
    setAgreeTerms(checked);
    setAgreePrivacy(checked);
    setAgreeMarketing(checked);
  };

  const handleAgreeTerms = (checked: boolean) => {
    setAgreeTerms(checked);
    if (!checked) setAgreeAll(false);
    else setAgreeAll(checked && agreePrivacy && agreeMarketing);
  };

  const handleAgreePrivacy = (checked: boolean) => {
    setAgreePrivacy(checked);
    if (!checked) setAgreeAll(false);
    else setAgreeAll(agreeTerms && checked && agreeMarketing);
  };

  const handleAgreeMarketing = (checked: boolean) => {
    setAgreeMarketing(checked);
    if (!checked) setAgreeAll(false);
    else setAgreeAll(agreeTerms && agreePrivacy && checked);
  };

  const isFormValid =
    name.trim() !== "" &&
    birth.trim() !== "" &&
    email.trim() !== "" &&
    password.trim() !== "" &&
    passwordConfirm.trim() !== "" &&
    agreeTerms &&
    agreePrivacy &&
    password === passwordConfirm;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    if (!isFormValid) return;
    navigate("/profile-register", {
      state: {
        name: name.trim(),
        birth: birth.trim(),
        email: email.trim(),
        password,
      } as SignupStep1State,
    });
  };

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-screen-sm flex-col bg-white">
      <header className="flex shrink-0 items-center gap-4 border-b border-gray-200 bg-white px-4 py-4">
        <div className="w-6" />
        <h1 className="login-title flex-1 text-center">회원가입</h1>
        <div className="w-6" />
      </header>

      <div className="flex-1 overflow-y-auto px-4 pb-24">
        <p className="login-subtitle mt-4 text-left text-sm">
          정보를 입력하고 OFF에 가입하세요.
        </p>

        <form className="mt-6 space-y-5 pb-12" onSubmit={handleSubmit}>
          <Input
            id="name"
            type="text"
            label="이름"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름을 입력해주세요"
          />

          <Input
            id="birth"
            type="date"
            label="생년월일"
            required
            value={birth}
            onChange={(e) => setBirth(e.target.value)}
          />

          <Input
            id="email"
            type="email"
            label="이메일"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일을 입력해주세요."
          />

          <Input
            id="password"
            type="password"
            label="비밀번호"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력해주세요."
          />

          <Input
            id="passwordConfirm"
            type="password"
            label="비밀번호 확인"
            required
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            placeholder="비밀번호를 다시 입력해주세요."
          />

          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between gap-2">
              <h3 className="login-label text-sm font-medium">약관 동의</h3>
              <label className="flex shrink-0 cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={agreeAll}
                  onChange={(e) => handleAgreeAll(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <span className="signup-agreement-text">전체동의</span>
              </label>
            </div>
            <div className="flex items-center justify-between gap-2">
              <label className="flex min-w-0 cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => handleAgreeTerms(e.target.checked)}
                  className="h-4 w-4 shrink-0 rounded border-gray-300"
                />
                <span className="signup-agreement-text min-w-0 truncate">
                  이용약관 동의
                </span>
                <span className="shrink-0 text-red-500">*</span>
              </label>
            </div>
            <div className="flex items-center justify-between gap-2">
              <label className="flex min-w-0 cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={agreePrivacy}
                  onChange={(e) => handleAgreePrivacy(e.target.checked)}
                  className="h-4 w-4 shrink-0 rounded border-gray-300"
                />
                <span className="signup-agreement-text min-w-0 truncate">
                  개인정보 처리방침 동의
                </span>
                <span className="shrink-0 text-red-500">*</span>
              </label>
            </div>
            <div className="flex items-center justify-between gap-2">
              <label className="flex min-w-0 cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={agreeMarketing}
                  onChange={(e) => handleAgreeMarketing(e.target.checked)}
                  className="h-4 w-4 shrink-0 rounded border-gray-300"
                />
                <span className="signup-agreement-text min-w-0 truncate">
                  마케팅 정보 수신 동의 (선택)
                </span>
              </label>
            </div>
          </div>

          {errorMessage && (
            <p className="text-sm text-red-600">{errorMessage}</p>
          )}

          <div className="mt-6">
            <button
              type="submit"
              disabled={!isFormValid}
              className="auth-primary-button button-primary-text"
            >
              회원가입하기
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
