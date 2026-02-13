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
} from "../components/_ui";

type Task = {
  id: number;
  title: string;
  partnerLabel: string;
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
        partnerLabel: "담당 파트너:",
        partnerDesc: "1차 데스크 리서치, 2차 데스크 리서치",
        percent: 100,
      },
      {
        id: 2,
        title: "개발 환경 셋업",
        partnerLabel: "담당 파트너:",
        partnerDesc: "인프라 및 CI/CD 파이프라인 구축",
        percent: 100,
      },
      {
        id: 3,
        title: "개발 환경 셋업",
        partnerLabel: "담당 파트너:",
        partnerDesc: "인프라 및 CI/CD 파이프라인 구축",
        percent: 100,
      },
    ],
    []
  );

  return (
    <Screen>
      {/* 상단 라벨(피그마처럼) */}
      <div className="mt-1 text-[18px] font-extrabold text-black">
        {project.org}
      </div>

      <SectionTitle
        left="나의 프로젝트"
        right={<GhostChip label="수정" onClick={() => navigate(`/project/${projectId}/edit`)} />}
      />

      {/* 검정 프로젝트 카드 */}
      <div className="mt-3">
        <DarkHeroCard>
          <div className="px-4 py-4">
            <div className="flex items-start justify-between">
              <div className="text-[20px] font-extrabold">{project.title}</div>
              <button
                type="button"
                onClick={() => navigate(`/project/${projectId}`)}
                className="flex items-center gap-2 text-[12px] font-semibold text-white/80"
              >
                자세히 보기 <RightArrow />
              </button>
            </div>

            <div className="mt-4 flex items-end justify-between">
              <div className="text-[34px] font-extrabold">{project.percent}%</div>
              <div className="text-[12px] font-semibold text-white/70">
                {project.dday}
              </div>
            </div>

            <SliderBar percent={project.percent} />

            <div className="mt-5 grid grid-cols-[72px_1fr] gap-y-3 text-[13px]">
              <div className="text-white/70 font-semibold">카테고리</div>
              <div className="flex justify-end">
                <BlueChip label={project.category} />
              </div>

              <div className="text-white/70 font-semibold">파트너</div>
              <div className="flex justify-end gap-2">
                {project.partners.map((p) => (
                  <BlueChip key={p} label={p} />
                ))}
              </div>
            </div>
          </div>

          <div className="bg-[#F2F3F5] px-4 py-3 text-[13px] font-semibold text-black/80">
            {project.desc}
          </div>
        </DarkHeroCard>
      </div>

      {/* TASK 섹션 */}
      <SubTitle
        left="TASK 진행상황"
        right={
          <div className="flex items-center gap-3">
            <span className="text-[13px] font-semibold text-black/60">
              전체 채팅 ○
            </span>
            <button
              type="button"
              onClick={() => navigate(`/project/${projectId}/tasks/new`)}
              className="text-[13px] font-semibold text-black/60"
            >
              추가
            </button>
          </div>
        }
      />

      <div className="mt-3 space-y-3">
        {tasks.map((t) => (
          <LightCard key={t.id}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <TaskTag text={`task ${t.id}`} />
                <div className="text-[16px] font-extrabold text-black">{t.title}</div>
              </div>
              <div className="text-[18px] font-extrabold text-black">{t.percent}%</div>
            </div>

            <div className="mt-2 text-[13px] font-semibold text-black/60">
              {t.partnerLabel}
            </div>
            <div className="text-[13px] font-semibold text-black/60">
              {t.partnerDesc}
            </div>

            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={() => navigate(`/project/${projectId}/tasks/${t.id}/edit`)}
                className="flex items-center gap-2 text-[13px] font-semibold text-black/50"
              >
                자세히 보기 <RightArrow />
              </button>
            </div>
          </LightCard>
        ))}
      </div>
    </Screen>
  );
}
