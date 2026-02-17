import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Page from "../../components/Page";
import { acceptInvitation } from "../../api/project";

const SERVICE_SUMMARY =
  "서비스 설명 및 요구사항 바탕 AI로 정리 서비스 설명 및 요구사항 바탕 AI로 정리 서비스 설명 및 요구사항 바탕 AI로 정리 서비스 설명 및 요구사항 바탕 AI로 정리";

const estimateRowStyle: React.CSSProperties = {
  display: "flex",
  height: "24px",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  alignSelf: "stretch",
  color: "var(--gray-gray_900, #121212)",
  fontFamily: "Inter, sans-serif",
  fontSize: "16px",
  fontStyle: "normal",
  fontWeight: 700,
  lineHeight: "24px",
  letterSpacing: "-0.16px",
};

const paymentBarStyle: React.CSSProperties = {
  display: "flex",
  padding: "18px 20px",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  alignSelf: "stretch",
  borderRadius: "8px",
  background: "var(--gray-gray_900, #121212)",
};

export default function SupportedPartnerConfirm() {
  const location = useLocation();
  const navigate = useNavigate();
  const invitationId = (location.state as { invitationId?: number } | null)?.invitationId ?? null;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMatchComplete = async () => {
    if (invitationId == null) {
      setError("제안 정보를 찾을 수 없습니다. 알림에서 다시 시도해 주세요.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const { applicationId } = await acceptInvitation(invitationId);
      navigate("/account", { state: { applicationId }, replace: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : "제안 수락에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page className="pb-36 pt-2">
      <div className="space-y-5">
        {/* 프로젝트 유형 */}
        <section>
          <h2 className="text-base font-bold text-zinc-900">프로젝트 유형</h2>
          <span className="mt-2 inline-flex h-8 items-center rounded border border-[#0060EF] bg-[rgba(0,96,239,0.15)] px-3 text-sm font-medium text-[#0060EF]">
            앱 개발
          </span>
        </section>

        {/* 모집 파트 */}
        <section>
          <h2 className="text-base font-bold text-zinc-900">모집 파트</h2>
          <span className="mt-2 inline-flex h-8 items-center rounded bg-zinc-900 px-3 text-sm font-medium text-white">
            개발자
          </span>
        </section>

        {/* 서비스 요약 */}
        <section>
          <h2 className="text-base font-bold text-zinc-900">서비스 요약</h2>
          <div className="mt-2 rounded-2xl bg-zinc-100 p-4">
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-600">
              {SERVICE_SUMMARY}
            </p>
          </div>
        </section>

        {/* 견적 확인 */}
        <section>
          <h2 className="text-base font-bold text-zinc-900">견적 확인</h2>
          <div className="mt-2 w-full" style={estimateRowStyle}>
            <span>개발자</span>
            <span>150,000원</span>
          </div>
          <div className="mt-3 rounded-2xl bg-zinc-100 p-4">
            <h3 className="text-base font-bold text-zinc-900">
              쿠잇 6기 프론트 개발자
            </h3>
            <p className="mt-1 text-sm text-zinc-600">
              UX/UI 특화 디자이너입니다
            </p>
            <div className="mt-3 flex justify-between text-sm">
              <span className="text-zinc-600">프로젝트 경험</span>
              <span className="font-medium text-zinc-900">5</span>
            </div>
            <p className="mt-3 text-right text-sm text-zinc-500">
              자세히 보기 &gt;
            </p>
          </div>
        </section>
      </div>

      {/* 결제 비용 바 + 파트너 매칭 완료하기 */}
      <div className="fixed bottom-0 left-0 right-0 z-10 mx-auto w-full max-w-screen-sm bg-white px-4 pb-8">
        <div className="w-full text-white" style={paymentBarStyle}>
          <span className="text-sm font-medium">결제 비용</span>
          <span className="text-base font-semibold">150,000원</span>
        </div>
        {error && (
          <p className="mt-2 text-center text-sm text-red-600">{error}</p>
        )}
        <div className="pt-4">
          <button
            type="button"
            onClick={handleMatchComplete}
            disabled={loading || invitationId == null}
            className="w-full rounded-full bg-[#0060EF] py-4 text-base font-semibold text-white disabled:opacity-50"
          >
            {loading ? "처리 중..." : "파트너 매칭 완료하기"}
          </button>
        </div>
      </div>
    </Page>
  );
}
