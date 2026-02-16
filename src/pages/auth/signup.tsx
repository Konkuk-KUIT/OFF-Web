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

const VALID_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BIRTH_REGEX = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD
const MIN_PASSWORD_LENGTH = 8;

function isValidEmail(value: string): boolean {
  return VALID_EMAIL_REGEX.test(value.trim());
}
function isValidBirth(value: string): boolean {
  if (!BIRTH_REGEX.test(value.trim())) return false;
  const d = new Date(value);
  return !Number.isNaN(d.getTime());
}

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
  const [touched, setTouched] = useState({ email: false, birth: false, password: false, passwordConfirm: false });

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

  const emailError = email.trim() && !isValidEmail(email) ? "유효한 이메일 주소를 입력해주세요." : null;
  const birthError = birth.trim() && !isValidBirth(birth) ? "반드시 YYYY-MM-DD 형식을 따라야 합니다." : null;
  const passwordError = password && password.length < MIN_PASSWORD_LENGTH ? "최소 8자 이상 입력해야 합니다." : null;
  const passwordConfirmError = passwordConfirm && password !== passwordConfirm ? "비밀번호가 일치하지 않습니다." : null;

  const isFormValid =
    name.trim() !== "" &&
    birth.trim() !== "" &&
    isValidBirth(birth) &&
    email.trim() !== "" &&
    isValidEmail(email) &&
    password.length >= MIN_PASSWORD_LENGTH &&
    passwordConfirm.trim() !== "" &&
    password === passwordConfirm &&
    agreeTerms &&
    agreePrivacy;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setTouched({ email: true, birth: true, password: true, passwordConfirm: true });
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

          <div>
            <Input
              id="birth"
              type="date"
              label="생년월일"
              required
              value={birth}
              onChange={(e) => {
                setBirth(e.target.value);
                setTouched((t) => ({ ...t, birth: true }));
              }}
            />
            {(touched.birth && birthError) && (
              <p className="mt-1 text-sm text-red-600">{birthError}</p>
            )}
          </div>

          <div>
            <Input
              id="email"
              type="email"
              label="이메일"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setTouched((t) => ({ ...t, email: true }));
              }}
              placeholder="이메일을 입력해주세요."
            />
            {(touched.email && emailError) && (
              <p className="mt-1 text-sm text-red-600">{emailError}</p>
            )}
          </div>

          <div>
            <Input
              id="password"
              type="password"
              label="비밀번호"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setTouched((t) => ({ ...t, password: true }));
              }}
              placeholder="비밀번호를 8자 이상 입력해주세요."
            />
            {(touched.password && passwordError) && (
              <p className="mt-1 text-sm text-red-600">{passwordError}</p>
            )}
          </div>

          <div>
            <Input
              id="passwordConfirm"
              type="password"
              label="비밀번호 확인"
              required
              value={passwordConfirm}
              onChange={(e) => {
                setPasswordConfirm(e.target.value);
                setTouched((t) => ({ ...t, passwordConfirm: true }));
              }}
              placeholder="비밀번호를 다시 입력해주세요."
            />
            {(touched.passwordConfirm && passwordConfirmError) && (
              <p className="mt-1 text-sm text-red-600">{passwordConfirmError}</p>
            )}
          </div>

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
