import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Screen,
  DarkHeroCard,
  SliderBar,
  BlueChip,
  LightCard,
  TaskTag,
  RightArrow,
  BottomCTA,
} from "../components/_ui";
import { getProjectDetail, closeProject, type ProjectDetail } from "../../../api/project";

export default function ProjectClosePage() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (projectId) {
      setLoading(true);
      getProjectDetail(Number(projectId))
        .then(setProject)
        .catch((e) => console.error(e))
        .finally(() => setLoading(false));
    }
  }, [projectId]);

  const handleClose = async () => {
    if (!projectId) return;
    try {
      if (!window.confirm("정말로 프로젝트를 종료하시겠습니까?")) return;

      await closeProject(Number(projectId));
      alert("프로젝트가 종료되었습니다.");
      navigate(`/project/${projectId}`);
    } catch (e: any) {
      console.error(e);
      alert("프로젝트 종료에 실패했습니다.");
    }
  };

  if (loading) return <Screen><div>Loading...</div></Screen>;
  if (!project) return <Screen><div>Project not found</div></Screen>;

  return (
    <Screen>
      <div className="mt-1 text-[18px] font-extrabold text-black">내 프로젝트</div>
      <div className="mt-2 text-[18px] font-extrabold text-black">{project.name}</div>

      <div className="mt-3">
        <DarkHeroCard>
          <div className="px-4 py-4">
            <div className="text-[34px] font-extrabold">{project.dday}</div>

            <div className="mt-2 flex items-center justify-between text-[12px] font-semibold text-white/70">
              <div>시작일</div>
              <div>마감일</div>
            </div>
            <div className="mt-1 text-[12px] font-semibold text-white/80">
              {project.startDate}
            </div>

            <SliderBar percent={project.progressPercent} />

            <div className="mt-6 grid grid-cols-[72px_1fr] gap-y-3 text-[13px]">
              {/* Category removed */}
              {/*
              <div className="text-white/70 font-semibold">카테고리</div>
              <div className="flex justify-end">
                <BlueChip label={project.category} />
              </div>
              */}

              <div className="text-white/70 font-semibold">파트너</div>
              <div className="flex justify-end gap-2 flex-wrap">
                {project.members.map((p, idx) => (
                  <BlueChip key={`${p.memberId}-${idx}`} label={p.nickname} />
                ))}
              </div>
            </div>
          </div>

          <div className="bg-[#F2F3F5] px-4 py-3 text-[13px] font-semibold text-black/80">
            {project.introduction}
            {/* <div className="mt-2 text-black/50">{project.statusText}</div> */}
          </div>
        </DarkHeroCard>
      </div>

      <div className="mt-6 text-[18px] font-extrabold text-black">TASK 진행상황</div>

      <div className="mt-3 space-y-3">
        {project.tasks?.map((t, idx) => (
          <LightCard key={`${t.taskId}-${idx}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <TaskTag text={`task ${t.taskId}`} />
                <div className="text-[16px] font-extrabold text-black">{t.name}</div>
              </div>
              <div className="text-[18px] font-extrabold text-black">{t.progressPercent}%</div>
            </div>

            <div className="mt-2 text-[13px] font-semibold text-black/60">
              담당 파트너:
            </div>
            <div className="text-[13px] font-semibold text-black/60">
              {t.assigneeName || "미배정"}
            </div>

            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={() => navigate(`/project/${projectId}/tasks/${t.taskId}/edit`)}
                className="flex items-center gap-2 text-[13px] font-semibold text-black/50"
              >
                자세히 보기 <RightArrow />
              </button>
            </div>
          </LightCard>
        ))}
      </div>

      <BottomCTA
        label="프로젝트 종료 확인"
        onClick={handleClose}
      />
    </Screen>
  );
}
