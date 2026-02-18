import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyProjects, type ProjectItem } from "../../api/member";

const formatKRW = (n: number) => n.toLocaleString("ko-KR") + "원";
const formatDate = (dateString: string | null) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "-";
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
};
function parseAmount(value: ProjectItem["amount"]): number | null {
  if (value == null) return null;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

export default function Projects() {
  const [items, setItems] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyProjects();
      setItems(data.projectList ?? []);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
      setItems([]);
      setError("참여한 프로젝트를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <div className="p-5 text-center text-gray-500">로딩 중...</div>;
  }

  if (error) {
    return (
      <main className="w-full bg-white p-5">
        <p className="text-[13px] text-red-500">{error}</p>
        <button
          type="button"
          onClick={fetchData}
          className="mt-3 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700"
        >
          다시 시도
        </button>
      </main>
    );
  }

  return (
    <main className="w-full bg-white">
      <section className="px-5 pt-4 pb-10">
        <div className="space-y-3">
          {items.map((it) => {
            const amountNum = parseAmount(it.amount);
            return (
              <Link
                key={it.id}
                to={`/project/${it.id}`}
                className="block rounded-2xl bg-gray-100 px-4 py-4 transition-opacity active:opacity-90"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium text-gray-700">
                      {it.name}
                    </p>
                    <p className="mt-1 text-[18px] font-semibold text-black">
                      {amountNum != null ? formatKRW(amountNum) : "-"}
                    </p>
                  </div>
                  <p className="shrink-0 pt-6 text-[11px] text-gray-400">
                    {formatDate(it.createdAt)} ~
                  </p>
                </div>
              </Link>
            );
          })}
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
