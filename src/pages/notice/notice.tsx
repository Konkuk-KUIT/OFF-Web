import Page from "../../components/Page";

export default function Notice() {
  return (
    <Page title="알림" className="space-y-3">
      <ul className="space-y-2">
        {["알림 1", "알림 2", "알림 3"].map((t) => (
          <li key={t} className="rounded-2xl border border-zinc-200 bg-white p-4">
            <p className="text-sm font-medium">{t}</p>
            <p className="mt-1 text-xs text-zinc-500">간단한 설명</p>
          </li>
        ))}
      </ul>
    </Page>
  );
}
