import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
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
import { getProjectDetail, acceptInvitationByApplicationId, type ProjectDetail } from "../../../api/project";
import { getMyProfile, getMyProjects } from "../../../api/member";

export default function ProjectDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { projectId } = useParams();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [myNickname, setMyNickname] = useState<string | null>(null);
  /** 참여한 프로젝트 목록에 현재 프로젝트가 있으면 true (하단 네비 폴더→마지막 프로젝트 진입 시 지원하기 숨김) */
  const [isInMyProjectsList, setIsInMyProjectsList] = useState(false);
  /** 알림(파트너 제안)에서 들어온 경우: 수락하기 플로우 */
  const applicationId = (location.state as { applicationId?: number } | null)?.applicationId ?? null;
  /** 나의 프로젝트 목록에서 들어온 경우 → 참여한 프로젝트이므로 지원하기 숨김 */
  const fromMyProjects = (location.state as { fromMyProjects?: boolean } | null)?.fromMyProjects ?? false;
  const [accepting, setAccepting] = useState(false);
  const [acceptError, setAcceptError] = useState<string | null>(null);

  useEffect(() => {
    if (projectId) {
      localStorage.setItem("lastViewedProjectId", projectId);
      const pid = Number(projectId);
      setLoading(true);
      Promise.all([
        getProjectDetail(pid),
        getMyProfile().catch(() => null),
        getMyProjects().catch(() => ({ projectList: [] as { id: number }[] })),
      ])
        .then(([data, me, myProjects]) => {
          setProject(data);
          setMyNickname(me?.nickname ?? null);
          setIsInMyProjectsList((myProjects.projectList ?? []).some((p) => p.id === pid));
        })
        .catch(() => {})
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

  const isMyMember =
    myNickname != null &&
    (project.members ?? []).some((m) => m.nickname === myNickname);
  /** 매칭된 프로젝트(멤버이거나 참여 목록에 있음)면 지원하기 숨김 */
  const shouldHideApplyButton = isMyMember || fromMyProjects || isInMyProjectsList;

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

      {/* 파트너 제안(알림)에서 온 경우: 수락하기 → 기획자 알림(백엔드) 후 결제 페이지 이동 */}
      {applicationId != null && applicationId > 0 ? (
        <div className="fixed bottom-0 left-0 right-0 z-10 mx-auto w-full max-w-screen-sm border-t border-zinc-100 bg-white px-4 pb-8 pt-4">
          {acceptError && (
            <p className="mb-2 text-center text-sm text-red-600">{acceptError}</p>
          )}
          <button
            type="button"
            disabled={accepting}
            onClick={() => {
              setAcceptError(null);
              setAccepting(true);
              acceptInvitationByApplicationId(applicationId)
                .then(() => {
                  navigate("/home", { replace: true });
                })
                .catch((e) => {
                  setAcceptError(e instanceof Error ? e.message : "수락 처리에 실패했습니다.");
                })
                .finally(() => setAccepting(false));
            }}
            className="w-full rounded-full bg-[#0060EF] py-4 text-base font-semibold text-white disabled:opacity-50"
          >
            {accepting ? "처리 중..." : "수락하기"}
          </button>
        </div>
      ) : !shouldHideApplyButton ? (
        /* 지원하기 버튼 - 매칭된 프로젝트(멤버/참여 목록/목록에서 진입)면 숨김 */
        <div className="fixed bottom-0 left-0 right-0 z-10 mx-auto w-full max-w-screen-sm border-t border-zinc-100 bg-white px-4 pb-8 pt-4">
          <button
            type="button"
            onClick={() =>
              navigate("/home/profile-edit", {
                state: { projectId: projectId ? Number(projectId) : undefined },
              })
            }
            className="w-full rounded-full bg-[#0060EF] py-4 text-base font-semibold text-white"
          >
            지원하기
          </button>
        </div>
      ) : null}
    </Screen>
  );
}
