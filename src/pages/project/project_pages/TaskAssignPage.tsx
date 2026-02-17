import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Screen, BottomCTA } from "../components/_ui";
import { getProjectDetail, updateTask, type MemberSummary, type TaskSummary } from "../../../api/project";

export default function TaskAssignPage() {
  const navigate = useNavigate();
  const { projectId, taskId } = useParams();
  const [members, setMembers] = useState<MemberSummary[]>([]);
  const [task, setTask] = useState<TaskSummary | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (projectId && taskId && !isNaN(Number(taskId))) {
      setLoading(true);
      getProjectDetail(Number(projectId))
        .then((data) => {
          setMembers(data.members);
          const foundTask = data.tasks.find(t => t.taskId === Number(taskId));
          if (foundTask) {
            setTask(foundTask);
            // If there is an assignee, we could pre-select?
            // But we don't have assignee ID directly in TaskSummary, only name.
            // We can try to find it.
            const assignee = data.members.find(m => m.nickname === foundTask.assigneeName);
            if (assignee) setSelected(assignee.memberId);
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [projectId, taskId]);

  const devs = useMemo(() => members.filter((p) => p.role === "DEV"), [members]);
  const designers = useMemo(() => members.filter((p) => p.role === "DES"), [members]); // Role enum: PM, DEV, DES, MAR

  const handleAssign = async () => {
    if (!projectId || !taskId || !selected || !task) return;
    try {
      // We must provide name, description, and projectMemberId
      await updateTask(Number(projectId), Number(taskId), {
        name: task.name,
        description: task.description,
        projectMemberId: selected,
        toDoList: task.toDoList.map(t => ({ id: t.toDoId, content: t.content }))
      });
      alert("배정되었습니다.");
      navigate(`/project/${projectId}/tasks/${taskId}/edit`);
    } catch (e: any) {
      console.error(e);
      alert("배정 실패");
    }
  };

  const Row = ({
    name,
    active,
    onClick,
  }: {
    name: string;
    active: boolean;
    onClick: () => void;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className="relative w-full overflow-hidden rounded-none"
    >
      <div className="flex h-[86px] w-full">
        <div className={`w-20 ${active ? "bg-[#9BC0FF]" : "bg-black/10"}`} />
        <div
          className={[
            "flex-1 bg-gradient-to-b from-[#0B0B0C] to-[#242426]",
            "flex items-center px-6 text-white font-extrabold text-[16px]",
            active ? "ring-2 ring-[#0B5CFF]" : "",
          ].join(" ")}
        >
          {name}
        </div>
      </div>
    </button>
  );


  if (loading) return <Screen><div>Loading...</div></Screen>;

  return (
    <Screen>
      <div className="mt-2 text-center text-[18px] font-extrabold text-black">
        담당 파트너 선택
      </div>

      <div className="mt-6 text-[18px] font-extrabold text-black">개발자</div>
      <div className="mt-3 space-y-2">
        {devs.length > 0 ? devs.map((p) => (
          <div key={p.memberId} className="overflow-hidden rounded-2xl">
            <Row
              name={p.nickname}
              active={selected === p.memberId}
              onClick={() => setSelected(p.memberId)}
            />
          </div>
        )) : <div className="text-gray-400">등록된 개발자가 없습니다.</div>}
      </div>

      <div className="mt-6 text-[18px] font-extrabold text-black">디자이너</div>
      <div className="mt-3 space-y-2">
        {designers.length > 0 ? designers.map((p) => (
          <div key={p.memberId} className="overflow-hidden rounded-2xl">
            <Row
              name={p.nickname}
              active={selected === p.memberId}
              onClick={() => setSelected(p.memberId)}
            />
          </div>
        )) : <div className="text-gray-400">등록된 디자이너가 없습니다.</div>}
      </div>

      <BottomCTA
        label="배정하기"
        onClick={handleAssign}
      />
    </Screen>
  );
}
