import { useMemo } from "react";
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

type Task = {
  id: number;
  title: string;
  partnerLabel: string;
  partnerDesc: string;
  percent: number;
};

export default function ProjectClosePage() {
  const navigate = useNavigate();
  const { projectId } = useParams();

  const project = {
    title: "어플 개발",
    dday: "D-0",
    startDate: "2025.02.19",
    category: "앱 개발",
    partners: ["마케팅", "디자인", "개발"],
    desc: "OFF the Limit 한계를 ‘OFF’하고 오직 실행에만 집중하는 올인원 프로젝트 플랫폼",
    statusText: "모집 마감",
    percent: 100,
  };

  const tasks = useMemo<Task[]>(
    () => [
      {
        id: 1,
        title: "앱 경쟁사 분석",
        partnerLabel: "경쟁사 분석",
        partnerDesc: "1차 데스크 리서치, 2차 데스크 리서치",
        percent: 100,
      },
      {
        id: 2,
        title: "개발 환경 셋업",
        partnerLabel: "프레임워크 셋업(Next.js/React 등)",
        partnerDesc: "인프라 및 CI/CD 파이프라인 구축",
        percent: 100,
      },
      {
        id: 3,
        title: "개발 환경 셋업",
        partnerLabel: "프레임워크 셋업(Next.js/React 등)",
        partnerDesc: "인프라 및 CI/CD 파이프라인 구축",
        percent: 100,
      },
    ],
    []
  );

  return (
    <Screen>
      <div className="mt-1 text-[18px] font-extrabold text-black">내 프로젝트</div>
      <div className="mt-2 text-[18px] font-extrabold text-black">{project.title}</div>

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

            <SliderBar percent={project.percent} />

            <div className="mt-6 grid grid-cols-[72px_1fr] gap-y-3 text-[13px]">
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
            <div className="mt-2 text-black/50">{project.statusText}</div>
          </div>
        </DarkHeroCard>
      </div>

      <div className="mt-6 text-[18px] font-extrabold text-black">TASK 진행상황</div>

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

      <BottomCTA
        label="프로젝트 종료 확인"
        onClick={() => {
          // TODO: 종료 API 붙이면 됨
          navigate(`/project/${projectId}`);
        }}
      />
    </Screen>
  );
}
