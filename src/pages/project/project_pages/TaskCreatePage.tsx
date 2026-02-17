import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Screen, LightCard, TaskTag, BottomCTA } from "../components/_ui";
import { createTask, getProjectDetail, type ProjectDetail } from "../../../api/project";

export default function TaskCreatePage() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (projectId) {
      getProjectDetail(Number(projectId))
        .then(setProject)
        .catch(console.error);
    }
  }, [projectId]);

  const handleCreate = async () => {
    if (!projectId) return;
    if (!title.trim() || !description.trim()) {
      alert("제목과 설명을 입력해주세요.");
      return;
    }

    // TODO: We need real projectMemberId. 
    // For now, if project has members, take the first one, or use a dummy.
    // In a real app we'd find the "Me" member.
    let targetMemberId = 0;
    if (project && project.members && project.members.length > 0) {
      targetMemberId = project.members[0].memberId;
    } else {
      // Fallback or alert?
      // alert("프로젝트 멤버 정보를 찾을 수 없습니다.");
      // return;
      targetMemberId = 1; // Fallback
    }

    try {
      setLoading(true);
      await createTask(Number(projectId), {
        name: title, // API expects 'name'
        description,
        projectMemberId: targetMemberId,
        toDoList: []
      });
      alert("Task가 생성되었습니다.");
      navigate(`/project/${projectId}`);
    } catch (e: any) {
      console.error(e);
      alert("Task 생성에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <div className="mt-2 text-center text-[18px] font-extrabold text-black">
        TASK 추가
      </div>

      <div className="mt-4 text-[18px] font-extrabold text-black">TASK 정보 입력</div>

      <div className="mt-3 space-y-3">
        <LightCard>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 w-full">
              <TaskTag text={`task ${project?.tasks?.length ? project.tasks.length + 1 : 1}`} />
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task 제목 입력"
                className="text-[16px] font-extrabold text-black bg-transparent outline-none flex-1"
              />
            </div>
            <div className="text-[18px] font-extrabold text-black">0%</div>
          </div>
        </LightCard>



        {/* To do list 박스 -> Description */}
        <div className="rounded-2xl bg-[#F2F3F5] p-4">
          <div className="text-[13px] font-semibold text-black/40 mb-2">상세 설명 (To do list)</div>
          <textarea
            className="w-full h-32 bg-transparent outline-none resize-none text-[14px]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="상세 내용을 입력하세요."
          />
        </div>
      </div>

      <BottomCTA
        label={loading ? "생성 중..." : "추가하기"}
        onClick={handleCreate}
      />
    </Screen>
  );
}
