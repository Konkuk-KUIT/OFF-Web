export default function Login() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-screen-sm items-center px-4">
      <div className="w-full space-y-4 rounded-2xl border border-zinc-200 bg-white p-5">
        <div>
          <h1 className="text-xl font-semibold">로그인</h1>
          <p className="mt-1 text-sm text-zinc-600">계정으로 접속하세요</p>
        </div>

        <form className="space-y-3">
          <input
            className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-zinc-900"
            placeholder="아이디"
          />
          <input
            type="password"
            className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-zinc-900"
            placeholder="비밀번호"
          />

          <button
            type="submit"
            className="w-full rounded-xl bg-zinc-900 px-4 py-3 text-sm font-medium text-white"
          >
            로그인
          </button>
        </form>
      </div>
    </main>
  );
}
