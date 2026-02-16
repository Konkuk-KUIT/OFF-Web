// src/components/projects/TaskCard.tsx
type Task = {
  id: number;
  title: string;
  desc?: string;
  percent: number; // 0~100
};

export default function TaskCard({
  task,
  onDetail,
}: {
  task: Task;
  onDetail?: () => void;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4=">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 rounded-lg bg-gray-900 text-white text-xs font-semibold">
              task {task.id}
            </span>
            <p className="font-semibold text-gray-900 truncate">{task.title}</p>
          </div>
          {task.desc && (
            <p className="mt-2 text-xs text-gray-600 leading-relaxed line-clamp-2">
              {task.desc}
            </p>
          )}
        </div>

        <div className="text-right shrink-0">
          <p className="text-xs text-gray-500">진행률</p>
          <p className="text-sm font-bold text-gray-900">{task.percent}%</p>
        </div>
      </div>

      <div className="mt-3 h-2 rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full bg-gray-900 rounded-full"
          style={{ width: `${task.percent}%` }}
        />
      </div>

      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={onDetail}
          className="text-xs font-semibold text-gray-600 hover:text-gray-900"
        >
          자세히 보기 &gt;
        </button>
      </div>
    </div>
  );
}
