export type NoticeItem = {
  id: string;
  title: string;
  content: string;
  receivedAt: string;
};

const NOTICES: NoticeItem[] = [
  {
    id: "1",
    title: "프로젝트 모집 요청",
    content:
      "KUIT 6기 프로젝트에서 00님과 함께 하고 싶어해요.\n프로젝트와 파트너를 확인해보세요!",
    receivedAt: "2026.00.00 00:00",
  },
];

export default function Notice() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-screen-sm flex-col bg-white pt-[5vh]">
      <div className="flex-1 overflow-y-auto px-4 pt-2 pb-4 flex flex-col items-center">
        <ul className="space-y-2 w-full flex flex-col items-center">
          {NOTICES.map((notice) => (
            <li key={notice.id} className="notice-card">
              <p className="notice-card-title mb-3">{notice.title}</p>
              <p className="notice-card-content mb-3 whitespace-pre-line">
                {notice.content}
              </p>
              <p className="notice-card-time text-right">
                {notice.receivedAt}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
