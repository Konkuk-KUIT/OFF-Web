import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { login as loginApi, setAccessToken } from "../../api/auth";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? "/";

  const isValidEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const isFormValid =
    email.trim() !== "" &&
    password.trim() !== "" &&
    isValidEmail(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setError(null);
    setLoading(true);
    try {
      const { data } = await loginApi({ email: email.trim(), password });
      setAccessToken(data.data.accessToken);
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const res = (err as { response?: { data?: { message?: string }; status?: number } })
        ?.response;
      if (res?.status === 401) {
        setError("이메일 또는 비밀번호가 올바르지 않습니다.");
      } else if (res?.data && typeof res.data === "object" && "message" in res.data) {
        setError((res.data as { message?: string }).message ?? "로그인에 실패했습니다.");
      } else if (res?.status) {
        setError(`요청이 실패했습니다. (${res.status})`);
      } else {
        setError("서버에 연결할 수 없습니다. 주소와 서버 실행 여부를 확인해주세요.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-screen-sm flex-col bg-white">
      <div className="flex flex-1 px-4 py-6">
        <div className="w-full space-y-6">
          <div>
            <h1 className="login-title">로그인</h1>
          </div>
          <div>
            <p className="login-subtitle text-left text-sm">
              계정에 로그인하여 시작하세요
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="email" className="login-label block text-sm font-medium">
                이메일
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="login-input w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:bg-white"
                placeholder="이메일을 입력해주세요"
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="login-label block text-sm font-medium">
                비밀번호
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:bg-white"
                placeholder="비밀번호를 입력해주세요"
                autoComplete="current-password"
              />
            </div>
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
            <button
              type="submit"
              disabled={!isFormValid || loading}
              className="auth-primary-button button-primary-text disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "로그인 중..." : "로그인"}
            </button>
          </form>

          <div className="mt-20 space-y-4">
            <div className="flex items-center justify-center gap-1">
              <span className="login-signup-text">계정이 없으신가요?</span>
              <Link to="/signup" className="login-signup-link">
                회원가입
              </Link>
            </div>
            <div className="border-t border-gray-200" />
          </div>

          {/* Google Login Button - 추후 구글 연동 시 사용 */}
          <button
            type="button"
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 active:bg-gray-200"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <span className="login-google-text">구글 로그인</span>
          </button>
        </div>
      </div>
    </main>
  );
}
