import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Screen,
  DarkHeroCard,
  SliderBar,
  BlueChip,
  DangerPill,
  BottomCTA,
} from "../components/_ui";

export default function ProjectEditPage() {
  const navigate = useNavigate();
  const { projectId } = useParams();

  // 피그마 화면 그대로 “표시용”
  const [title] = useState("어플 개발 프로젝트");
  const [percent] = useState(75);

  const category = "프로덕트 개발";
  const partners = useMemo(() => ["마케팅", "디자인", "개발"], []);

  return (
    <Screen>
      <div className="mt-2 flex items-center justify-between">
        <div className="text-[18px] font-extrabold text-black">{title}</div>
        <DangerPill
          label="프로젝트 종료"
          onClick={() => navigate(`/project/${projectId}/close`)}
        />
      </div>

      <div className="mt-3">
        <DarkHeroCard>
          <div className="px-4 py-4">
            <div className="text-[34px] font-extrabold">D-4</div>

            <div className="mt-2 flex items-center justify-between text-[12px] font-semibold text-white/70">
              <div>시작일</div>
              <div>마감일</div>
            </div>

            <div className="mt-1 flex items-center justify-between text-[12px] font-semibold text-white/80">
              <div>2025.02.19</div>
              <div />
            </div>

            <SliderBar percent={percent} />

            <div className="mt-6 grid grid-cols-[72px_1fr] gap-y-3 text-[13px]">
              <div className="text-white/70 font-semibold">카테고리</div>
              <div className="flex justify-end">
                <BlueChip label={category} />
              </div>

              <div className="text-white/70 font-semibold">파트너</div>
              <div className="flex justify-end gap-2">
                {partners.map((p) => (
                  <BlueChip key={p} label={p} />
                ))}
              </div>
            </div>
          </div>

          <div className="bg-[#F2F3F5] px-4 py-3 text-[13px] font-semibold text-black/80">
            OFF the Limit 한계를 ‘OFF’하고 오직 실행에만 집중하는 올인원 프로젝트 플랫폼
          </div>
        </DarkHeroCard>
      </div>

      {/* 실제 입력은 나중에 붙이면 됨: 지금은 피그마처럼 “보기”만 */}
      <div className="mt-3 text-[12px] font-semibold text-black/40">
        (필요하면 여기서 title/퍼센트/파트너를 입력 UI로 바꾸면 됩니다.)
      </div>

      <BottomCTA
        label="저장하기"
        onClick={() => {
          // TODO: API 저장 후 이동
          navigate(`/project/${projectId}`);
        }}
      />
    </Screen>
  );
}
