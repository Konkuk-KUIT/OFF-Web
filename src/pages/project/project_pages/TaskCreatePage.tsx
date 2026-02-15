import { useNavigate, useParams } from "react-router-dom";
import { Screen, LightCard, TaskTag, BottomCTA } from "../components/_ui";

export default function TaskCreatePage() {
  const navigate = useNavigate();
  const { projectId } = useParams();

  return (
    <Screen>
      <div className="mt-2 text-center text-[18px] font-extrabold text-black">
        TASK 추가
      </div>

      <div className="mt-4 text-[18px] font-extrabold text-black">TASK 진행상황</div>

      <div className="mt-3 space-y-3">
        <LightCard>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <TaskTag text="task 4" />
              <div className="text-[16px] font-extrabold text-black">새로운 Task</div>
            </div>
            <div className="text-[18px] font-extrabold text-black">0%</div>
          </div>
        </LightCard>

        {/* 담당 파트너 선택 블랙 바 */}
        <div className="overflow-hidden rounded-2xl bg-black text-white">
          <div className="flex">
            <div className="w-16 bg-white/10" />
            <button
              type="button"
              onClick={() => navigate(`/project/${projectId}/tasks/4/assign`)}
              className="flex-1 px-4 py-6 text-left text-[16px] font-extrabold"
            >
              담당 파트너 선택
            </button>
          </div>
        </div>

        {/* To do list 박스 */}
        <div className="rounded-2xl bg-[#F2F3F5] p-4">
          <div className="text-[13px] font-semibold text-black/40">To do list</div>
          <div className="h-32" />
        </div>
      </div>

      <BottomCTA
        label="추가하기"
        onClick={() => navigate(`/project/${projectId}`)}
      />
    </Screen>
  );
}
