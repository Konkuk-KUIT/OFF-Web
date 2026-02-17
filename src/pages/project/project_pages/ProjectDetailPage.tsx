import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Screen,
  SectionTitle,
  GhostChip,
  DarkHeroCard,
  SliderBar,
  BlueChip,
  LightCard,
  TaskTag,
  RightArrow,
  SubTitle,
} from "../components/_ui";
import { getProjectDetail, type ProjectDetail } from "../../../api/project";

export default function ProjectDetailPage() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (projectId) {
      localStorage.setItem("lastViewedProjectId", projectId);

      setLoading(true);
      getProjectDetail(Number(projectId))
        .then((data) => {
          setProject(data);
        })
        .catch((err) => {
          console.error("Failed to fetch project detail:", err);
          // alert("프로젝트 정보를 불러오는데 실패했습니다.");
          // navigate(-1); // Go back or to list
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [projectId]);

  if (loading) {
    return (
      <Screen>
        <div className="flex h-64 items-center justify-center text-gray-400">
          프로젝트 정보를 불러오는 중입니다...
        </div>
      </Screen>
    );
  }

  if (!project) {
    return (
      <Screen>
        <div className="flex h-64 items-center justify-center text-gray-400">
          프로젝트를 찾을 수 없습니다.
        </div>
      </Screen>
    );
  }

  return (
    <Screen>
      <SectionTitle
        left="나의 프로젝트"
        right={
          <GhostChip
            label="수정"
            onClick={() => navigate(`/project/${projectId}/edit`)}
          />
        }
      />

      {/* 검정 프로젝트 카드 */}
      <div className="mt-3">
        <DarkHeroCard>
          <div className="px-5 py-5">
            {/* 타이틀 + 자세히 보기 */}
            <div className="flex items-start justify-between gap-3">
              <div className="text-[30px] leading-[1.15] font-extrabold tracking-[-0.3px]">
                {project.name}
              </div>

              <button
                type="button"
                onClick={() => navigate(`/project/${projectId}`)}
                className="mt-2 flex items-center gap-2 whitespace-nowrap text-[14px] font-semibold text-white/80"
              >
                자세히 보기 <span className="text-white/70"><RightArrow /></span>
              </button>
            </div>

            {/* 시작일(좌) / 퍼센트+마감일(우) */}
            <div className="mt-5 flex items-end justify-between">
              <div className="text-[14px] font-semibold text-white/85">
                <span className="text-white/70">시작일</span>
                <span className="ml-5">{project.startDate}</span>
              </div>

              <div className="text-right">
                <div className="text-[34px] font-extrabold">{project.progressPercent}%</div>
                <div className="mt-1 text-[14px] font-semibold text-white/70">
                  D-{project.dday}
                </div>
              </div>
            </div>

            <SliderBar percent={project.progressPercent} />

            {/* 카테고리/파트너 */}
            <div className="mt-5 grid grid-cols-[84px_1fr] gap-y-4 text-[15px]">
              {/* Category is missing in new API, removing or using description prefix? 
                  For now hiding or using a placeholder if needed. 
              */}
              {/* <div className="font-extrabold text-white">카테고리</div>
              <div className="flex justify-end">
                <BlueChip label={project.category} />
              </div> */}

              <div className="font-extrabold text-white">파트너</div>
              <div className="flex justify-end gap-2 flex-wrap">
                {project.members?.map((m, idx) => (
                  <BlueChip key={`${m.memberId}-${idx}`} label={m.nickname} />
                ))}
              </div>
            </div>
          </div>

          {/* 설명 영역 */}
          <div className="bg-[#F2F3F5] px-5 py-5 text-[15px] font-semibold text-black/75">
            {project.introduction}
          </div>
        </DarkHeroCard>
      </div>

      {/* TASK 섹션 */}
      <SubTitle
        left="TASK 진행상황"
        right={
          <GhostChip
            label="추가"
            onClick={() => navigate(`/project/${projectId}/tasks/new`)}
          />
        }
      />

      <div className="mt-3 space-y-4">
        {project.tasks && project.tasks.length > 0 ? (
          project.tasks.map((t, idx) => (
            <LightCard key={`${t.taskId}-${idx}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <TaskTag text={`task ${t.taskId}`} />
                  <div className="text-[20px] font-extrabold text-black">
                    {t.name}
                  </div>
                </div>
                <div className="text-[22px] font-extrabold text-black">
                  {t.progressPercent}%
                </div>
              </div>

              <div className="mt-4 text-[15px] font-semibold text-black/70">
                담당 파트너:
              </div>
              <div className="mt-1 text-[15px] font-semibold text-black/70">
                {t.assigneeName || "미배정"}
              </div>

              <div className="mt-5 flex justify-end">
                <button
                  type="button"
                  onClick={() => navigate(`/project/${projectId}/tasks/${t.taskId}/edit`)}
                  className="flex items-center gap-2 text-[15px] font-semibold text-black/45"
                >
                  자세히 보기 <span className="text-black/35"><RightArrow /></span>
                </button>
              </div>
            </LightCard>
          ))
        ) : (
          <div className="text-center text-gray-500 py-10">
            등록된 Task가 없습니다.
          </div>
        )}
      </div>
    </Screen>
  );
}
