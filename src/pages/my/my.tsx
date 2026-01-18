import Page from "../../components/Page";

export default function My() {
  return (
    <Page title="마이" className="space-y-3">
      <div className="rounded-2xl border border-zinc-200 bg-white p-4">
        <p className="text-sm font-medium">이름</p>
        <p className="mt-1 text-xs text-zinc-500">프로필 / 설정</p>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-2">
        <button className="w-full rounded-xl px-3 py-3 text-left text-sm hover:bg-zinc-50">
          계정 설정
        </button>
        <button className="w-full rounded-xl px-3 py-3 text-left text-sm hover:bg-zinc-50">
          로그아웃
        </button>
      </div>
    </Page>
  );
}
