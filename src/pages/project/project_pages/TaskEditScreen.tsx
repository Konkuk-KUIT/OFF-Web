import { useNavigate, useParams } from "react-router-dom";
import {
  Screen,
  LightCard,
  TaskTag,
  RightArrow,
  DangerPill,
  BottomCTA,
} from "../components/_ui";

export default function TaskEditPage() {
  const navigate = useNavigate();
  const { projectId, taskId } = useParams();

  return (
    <Screen>
      <div className="mt-2 flex items-center justify-between">
        <div className="text-[18px] font-extrabold text-black">TASK 진행상황</div>
        <DangerPill label="TASK 삭제" onClick={() => {}} />
      </div>

      <div className="mt-3 space-y-3">
        <LightCard>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <TaskTag text={`task${taskId ?? 1}`} />
              <div className="text-[16px] font-extrabold text-black">
                앱 경쟁사 분석
              </div>
            </div>
            <div className="text-[18px] font-extrabold text-black">100%</div>
          </div>

          <div className="mt-2 text-[13px] font-semibold text-black/60">
            경쟁사 분석
          </div>
          <div className="text-[13px] font-semibold text-black/60">
            1차 데스크 리서치, 2차 데스크 리서치
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
              KUIT 6th 디자이너(닉네임)
            </button>
          </div>
        </div>

        {/* 설명 영역 */}
        <div className="rounded-2xl bg-[#F2F3F5] p-4">
          <div className="text-[13px] font-semibold text-black/60">
            Task 상세 설명(크리에이터, 담당 파트너 모두 수정 가능)
          </div>
          <div className="mt-4 text-[13px] font-semibold text-black/60">
            To do list로 변경 예정
          </div>
        </div>
      </div>

      <BottomCTA
        label="저장하기"
        onClick={() => navigate(`/project/${projectId}`)}
      />
    </Screen>
  );
}
