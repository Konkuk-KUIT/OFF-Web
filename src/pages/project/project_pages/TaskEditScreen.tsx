import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Screen,
  LightCard,
  TaskTag,
  DangerPill,
  BottomCTA,
} from "../components/_ui";
import { updateTask, deleteTask, getProjectDetail, type TaskSummary, type MemberSummary } from "../../../api/project";

export default function TaskEditPage() {
  const navigate = useNavigate();
  const { projectId, taskId } = useParams();
  const [task, setTask] = useState<TaskSummary | null>(null);
  const [projectMembers, setProjectMembers] = useState<MemberSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (projectId && taskId && !isNaN(Number(taskId))) {
      setLoading(true);
      // Fetch both task (via project?) and members
      // actually getTaskDetail calls getProjectDetail internally in our new impl,
      // but we need members too.
      // Let's just call getProjectDetail once if possible, but our api helper `getTaskDetail` is separate.
      // I'll call getProjectDetail to get everything including members.
      getProjectDetail(Number(projectId))
        .then((proj) => {
          setProjectMembers(proj.members);
          const foundTask = proj.tasks.find(t => t.taskId === Number(taskId));
          if (foundTask) setTask(foundTask);
          else console.error("Task not found in project");
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [projectId, taskId]);

  const handleDelete = async () => {
    if (!projectId || !taskId) return;
    if (!window.confirm("정말로 삭제하시겠습니까?")) return;
    try {
      await deleteTask(Number(projectId), Number(taskId));
      alert("삭제되었습니다.");
      navigate(`/project/${projectId}`);
    } catch (e: any) {
      console.error(e);
      alert("삭제 실패");
    }
  };

  const handleSave = async () => {
    if (!projectId || !taskId || !task) return;
    // 담당자: tasks[].assigneeProjectMemberId 유지 또는 members[].projectMemberId 중 선택
    const projectMemberId =
      task.assigneeProjectMemberId ??
      projectMembers.find((m) => m.nickname === task.assigneeName)?.projectMemberId ??
      projectMembers[0]?.projectMemberId ??
      projectMembers[0]?.memberId;
    if (projectMemberId == null || projectMemberId <= 0) {
      alert("담당자 정보를 찾을 수 없습니다. 프로젝트 상세를 다시 불러와 주세요.");
      return;
    }
    try {
      await updateTask(Number(projectId), Number(taskId), {
        name: task.name,
        description: task.description,
        projectMemberId: Number(projectMemberId),
        toDoList: task.toDoList.map((t) => ({
          id: t.toDoId ?? null,
          content: t.content ?? ""
        }))
      });
      alert("저장되었습니다.");
      navigate(`/project/${projectId}`);
    } catch (e: unknown) {
      console.error(e);
      alert("수정에 실패했습니다.");
    }
  };

  if (loading) return <Screen><div>Loading...</div></Screen>;
  if (!task) return <Screen><div>Task not found</div></Screen>;

  return (
    <Screen>
      <div className="mt-2 flex items-center justify-between">
        <div className="text-[18px] font-extrabold text-black">TASK 진행상황</div>
        <DangerPill label="TASK 삭제" onClick={handleDelete} />
      </div>

      <div className="mt-3 space-y-3">
        <LightCard>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <TaskTag text={`task${taskId}`} />
              <div className="text-[16px] font-extrabold text-black">
                {task.name}
              </div>
            </div>
            <div className="text-[18px] font-extrabold text-black">{task.progressPercent}%</div>
          </div>

          <div className="mt-2 text-[13px] font-semibold text-black/60">
            {task.assigneeName || "미배정"}
          </div>
          <div className="text-[13px] font-semibold text-black/60">
            {task.description}
          </div>
        </LightCard>

        {/* 담당 파트너 블랙 바 */}
        <div className="overflow-hidden rounded-2xl bg-black text-white">
          <div className="flex">
            <div className="w-16 bg-white/10" />
            <button
              type="button"
              onClick={() => navigate(`/project/${projectId}/tasks/${taskId}/assign`)}
              className="flex-1 px-4 py-6 text-left text-[16px] font-extrabold"
            >
              {task.assigneeName ? `${task.assigneeName}` : "담당 파트너 선택"}
            </button>
          </div>
        </div>

        {/* 설명 영역 */}
        <div className="rounded-2xl bg-[#F2F3F5] p-4">
          <div className="text-[13px] font-semibold text-black/60">
            Task 상세 설명
          </div>
          <textarea
            className="mt-2 w-full h-32 bg-transparent outline-none resize-none text-[13px]"
            value={task.description}
            onChange={(e) => setTask({ ...task, description: e.target.value })}
            placeholder="내용을 입력하세요"
          />
        </div>
      </div>

      <BottomCTA
        label="저장하기"
        onClick={handleSave}
      />
    </Screen>
  );
}
