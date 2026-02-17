import { useEffect, useState } from "react";
import { getMyProjects, type ProjectItem } from "../../api/member";

const formatKRW = (n: number) => n.toLocaleString("ko-KR") + "원";
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
};

export default function Payments() {
  const [items, setItems] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyProjects()
      .then((data) => {
        setItems(data.projectList);
      })
      .catch((err) => {
        console.error("Failed to fetch projects:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-5 text-center text-gray-500">로딩 중...</div>;
  }

  return (
    <main className="w-full bg-white">
      <section className="px-5 pt-4 pb-10">
        <div className="space-y-3">
          {items.map((it) => (
            <div
              key={it.id}
              className="rounded-2xl bg-gray-100 px-4 py-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium text-gray-700">
                    {it.name}
                  </p>
                  <p className="mt-1 text-[18px] font-semibold text-black">
                    {formatKRW(it.amount)}
                  </p>
                </div>

                <p className="shrink-0 pt-6 text-[11px] text-gray-400">
                  {it.createdAt ? formatDate(it.createdAt) : "-"} ~
                </p>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="py-10 text-center text-gray-500 text-sm">
              참여한 프로젝트 내역이 없습니다.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
