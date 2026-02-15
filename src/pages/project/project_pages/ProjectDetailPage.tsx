import { useMemo } from "react";
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
  ChatBubbleIcon,
} from "../components/_ui";

type Task = {
  id: number;
  title: string;
  partnerDesc: string;
  percent: number;
};

export default function ProjectDetailPage() {
  const navigate = useNavigate();
  const { projectId } = useParams();

  const project = {
    org: "OFF the Limit",
    title: "KUIT 6th Project",
    percent: 75,
    startAt: "2025.02.19",
    dday: "마감일 D-4",
    category: "앱 개발",
    partners: ["마케팅", "디자인", "개발"],
    desc: "OFF the Limit 한계를 ‘OFF’하고 오직 실행에만 집중하는 올인원 프로젝트 플랫폼",
  };

  const tasks = useMemo<Task[]>(
    () => [
      {
        id: 1,
        title: "앱 경쟁사 분석",
        partnerDesc: "1차 데스크 리서치, 2차 데스크 리서치",
        percent: 100,
      },
      {
        id: 2,
        title: "개발 환경 셋업",
        partnerDesc: "인프라 및 CI/CD 파이프라인 구축",
        percent: 100,
      },
      {
        id: 3,
        title: "개발 환경 셋업",
        partnerDesc: "인프라 및 CI/CD 파이프라인 구축",
        percent: 100,
      },
    ],
    []
  );

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
                {project.title}
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
                <span className="ml-5">{project.startAt}</span>
              </div>

              <div className="text-right">
                <div className="text-[34px] font-extrabold">{project.percent}%</div>
                <div className="mt-1 text-[14px] font-semibold text-white/70">
                  {project.dday}
                </div>
              </div>
            </div>

            <SliderBar percent={project.percent} />

            {/* 카테고리/파트너 */}
            <div className="mt-5 grid grid-cols-[84px_1fr] gap-y-4 text-[15px]">
              <div className="font-extrabold text-white">카테고리</div>
              <div className="flex justify-end">
                <BlueChip label={project.category} />
              </div>

              <div className="font-extrabold text-white">파트너</div>
              <div className="flex justify-end gap-2">
                {project.partners.map((p) => (
                  <BlueChip key={p} label={p} />
                ))}
              </div>
            </div>
          </div>

          {/* 설명 영역 */}
          <div className="bg-[#F2F3F5] px-5 py-5 text-[15px] font-semibold text-black/75">
            {project.desc}
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
        {tasks.map((t) => (
          <LightCard key={t.id}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <TaskTag text={`task ${t.id}`} />
                <div className="text-[20px] font-extrabold text-black">
                  {t.title}
                </div>
              </div>
              <div className="text-[22px] font-extrabold text-black">
                {t.percent}%
              </div>
            </div>

            <div className="mt-4 text-[15px] font-semibold text-black/70">
              담당 파트너:
            </div>
            <div className="mt-1 text-[15px] font-semibold text-black/70">
              {t.partnerDesc}
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => navigate(`/project/${projectId}/tasks/${t.id}/edit`)}
                className="flex items-center gap-2 text-[15px] font-semibold text-black/45"
              >
                자세히 보기 <span className="text-black/35"><RightArrow /></span>
              </button>
            </div>
          </LightCard>
        ))}
      </div>
    </Screen>
  );
}
