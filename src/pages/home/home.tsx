import Page from "../../components/Page";

export default function Home() {
  return (
    <Page className="space-y-4">
      <section className="rounded-2xl border border-zinc-200 bg-white p-4">
        <h2 className="text-base font-semibold">홈</h2>
        <p className="mt-1 text-sm text-zinc-600">메인 대시보드 영역</p>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-4">
        <h3 className="text-sm font-semibold">빠른 액션</h3>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <button className="rounded-xl bg-zinc-900 px-4 py-3 text-sm font-medium text-white">
            새 프로젝트
          </button>
          <button className="rounded-xl border border-zinc-300 px-4 py-3 text-sm font-medium">
            공지 보기
          </button>
        </div>
      </section>
    </Page>
  );
}
