import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Screen,
  DarkHeroCard,
  SliderBar,
  BlueChip,
  DangerPill,
  BottomCTA,
} from "../components/_ui";
import { getProjectDetail, updateProject, type ProjectDetail } from "../../../api/project";

export default function ProjectEditPage() {
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

  const handleSave = async () => {
    if (!projectId || !project) return;
    try {
      // The API only allows updating the introduction
      await updateProject(Number(projectId), {
        introduction: project.introduction
      });
      alert("저장되었습니다.");
      navigate(`/project/${projectId}`);
    } catch (e: any) {
      console.error(e);
      alert("수정에 실패했습니다.");
    }
  };

  if (loading) return <Screen><div>Loading...</div></Screen>;
  if (!project) return <Screen><div>Project not found</div></Screen>;

  return (
    <Screen>
      <div className="mt-2 flex items-center justify-between">
        <div className="text-[18px] font-extrabold text-black">{project.name}</div>
        <DangerPill
          label="프로젝트 종료"
          onClick={() => navigate(`/project/${projectId}/close`)}
        />
      </div>

      <div className="mt-3">
        <DarkHeroCard>
          <div className="px-4 py-4">
            <div className="text-[34px] font-extrabold">{project.dday}</div>

            <div className="mt-2 flex items-center justify-between text-[12px] font-semibold text-white/70">
              <div>시작일</div>
              <div>마감일</div>
            </div>

            <div className="mt-1 flex items-center justify-between text-[12px] font-semibold text-white/80">
              <div>{project.startDate}</div>
              <div />
            </div>

            <SliderBar percent={project.progressPercent} />

            <div className="mt-6 grid grid-cols-[72px_1fr] gap-y-3 text-[13px]">
              {/* Category removed as per new API
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

          {/* Intro edit area */}
          <textarea
            className="w-full bg-[#F2F3F5] px-4 py-3 text-[13px] font-semibold text-black/80 outline-none resize-none h-32"
            value={project.introduction}
            onChange={(e) => setProject({ ...project, introduction: e.target.value })}
            placeholder="프로젝트 소개를 입력하세요."
          />
        </DarkHeroCard>
      </div>

      <div className="mt-3 text-[12px] font-semibold text-black/40">
        (현재는 소개글 수정만 가능합니다.)
      </div>

      <BottomCTA
        label="저장하기"
        onClick={handleSave}
      />
    </Screen>
  );
}
