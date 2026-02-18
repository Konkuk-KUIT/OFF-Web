import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Page from "../../components/Page";
import { acceptInvitation, getApplicationDetail, getProjectDetail } from "../../api/project";
import type { ProjectDetail } from "../../api/project";
import { getRoleLabel } from "../../api/partner";

const DEFAULT_SERVICE_SUMMARY =
  "서비스 설명 및 요구사항 바탕 AI로 정리 서비스 설명 및 요구사항 바탕 AI로 정리 서비스 설명 및 요구사항 바탕 AI로 정리 서비스 설명 및 요구사항 바탕 AI로 정리";

/** 프로젝트 유형이 API에 없을 때 표시할 기본값 */
const DEFAULT_PROJECT_TYPE = "앱 개발";

type PartnerDataFromSupported = {
  role?: string;
  description?: string;
  projectExperience?: string;
  estimatedQuote?: string;
  intro?: string;
};

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
  const state = (location.state as {
    invitationId?: number;
    projectId?: number;
    applicationId?: number;
    partnerId?: number;
    partnerData?: PartnerDataFromSupported;
    serviceSummary?: string;
    recruitRole?: string;
  } | null) ?? {};
  const invitationId = state.invitationId ?? null;
  const projectId = state.projectId ?? null;
  const applicationIdFromState = state.applicationId ?? null;
  const partnerId = state.partnerId ?? null;
  const partnerData = state.partnerData;
  const stateServiceSummary = state.serviceSummary;
  const stateRecruitRole = state.recruitRole;

  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [projectLoading, setProjectLoading] = useState(false);
  const [projectError, setProjectError] = useState<string | null>(null);
  const [resolvedPartnerId, setResolvedPartnerId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (partnerId != null && partnerId > 0) return;
    if (applicationIdFromState == null || applicationIdFromState <= 0) return;
    getApplicationDetail(applicationIdFromState)
      .then((detail) => {
        if (detail.partnerId > 0) setResolvedPartnerId(detail.partnerId);
      })
      .catch(() => {});
  }, [applicationIdFromState, partnerId]);

  useEffect(() => {
    if (projectId == null) return;
    setProjectLoading(true);
    setProjectError(null);
    getProjectDetail(projectId)
      .then(setProject)
      .catch((e) => setProjectError(e instanceof Error ? e.message : "프로젝트 조회 실패"))
      .finally(() => setProjectLoading(false));
  }, [projectId]);

  const projectType = project?.name?.trim() || DEFAULT_PROJECT_TYPE;
  const recruitPartLabels = project?.recruits?.length
    ? project.recruits.map((r) => getRoleLabel(r.role)).filter(Boolean)
    : [];
  const recruitPart =
    recruitPartLabels.length > 0
      ? recruitPartLabels.join(", ")
      : (stateRecruitRole ?? "개발자");
  const serviceSummaryFromProject = (project?.description?.trim() || project?.introduction?.trim()) || undefined;
  const serviceSummary =
    serviceSummaryFromProject || stateServiceSummary || partnerData?.intro || DEFAULT_SERVICE_SUMMARY;
  const roleLabel = partnerData?.role ?? "개발자";
  const paymentAmountLabel = partnerData?.estimatedQuote ?? "150,000원";
  const partnerDesc = partnerData?.description ?? "UX/UI 특화 디자이너입니다";
  const projectExp = partnerData?.projectExperience ?? "5";
  const partnerIdForDetail = (partnerId ?? resolvedPartnerId) ?? 0;

  /** 파트너 매칭 완료하기: 결제 페이지(/payment)로 이동 → 거기서 GET client-key, POST prepare, Toss 위젯 → success 시 confirm */
  const handleMatchComplete = async () => {
    let applicationIdToUse: number | null =
      applicationIdFromState != null && applicationIdFromState > 0
        ? applicationIdFromState
        : null;
    if (applicationIdToUse == null && invitationId != null) {
      try {
        const res = await acceptInvitation(invitationId);
        applicationIdToUse = res.applicationId > 0 ? res.applicationId : null;
      } catch (e) {
        setError(e instanceof Error ? e.message : "제안 수락에 실패했습니다.");
        setLoading(false);
        return;
      }
    }
    if (applicationIdToUse == null || applicationIdToUse <= 0) {
      setError("결제 정보를 찾을 수 없습니다. 알림에서 자세히 보기로 들어와 다시 시도해 주세요.");
      return;
    }
    setError(null);
    navigate("/payment", { state: { applicationId: applicationIdToUse }, replace: false });
  };

  return (
    <Page className="pb-36 pt-2">
      {projectLoading && (
        <p className="mb-4 text-center text-sm text-zinc-500">프로젝트 정보를 불러오는 중...</p>
      )}
      {projectError && (
        <p className="mb-4 text-center text-sm text-red-600">{projectError}</p>
      )}
      <div className="space-y-5">
        {/* 프로젝트 유형 (알림에서 받은 projectId로 조회한 값) */}
        <section>
          <h2 className="text-base font-bold text-zinc-900">프로젝트 유형</h2>
          <span className="mt-2 inline-flex h-8 items-center rounded border border-[#0060EF] bg-[rgba(0,96,239,0.15)] px-3 text-sm font-medium text-[#0060EF]">
            {projectType}
          </span>
        </section>

        {/* 모집 파트 (프로젝트 recruits 기반) */}
        <section>
          <h2 className="text-base font-bold text-zinc-900">모집 파트</h2>
          <span className="mt-2 inline-flex h-8 items-center rounded bg-zinc-900 px-3 text-sm font-medium text-white">
            {recruitPart}
          </span>
        </section>

        {/* 서비스 요약 */}
        <section>
          <h2 className="text-base font-bold text-zinc-900">서비스 요약</h2>
          <div className="mt-2 rounded-2xl bg-zinc-100 p-4">
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-600">
              {serviceSummary}
            </p>
          </div>
        </section>

        {/* 견적 확인 */}
        <section>
          <h2 className="text-base font-bold text-zinc-900">견적 확인</h2>
          <div className="mt-2 w-full" style={estimateRowStyle}>
            <span>{roleLabel}</span>
            <span>{paymentAmountLabel}</span>
          </div>
          <div className="mt-3 rounded-2xl bg-zinc-100 p-4">
            <h3 className="text-base font-bold text-zinc-900">
              {roleLabel}
            </h3>
            <p className="mt-1 text-sm text-zinc-600">
              {partnerDesc}
            </p>
            <div className="mt-3 flex justify-between text-sm">
              <span className="text-zinc-600">프로젝트 경험</span>
              <span className="font-medium text-zinc-900">{projectExp}</span>
            </div>
            {partnerIdForDetail > 0 ? (
              <button
                type="button"
                onClick={() => navigate(`/partner/${partnerIdForDetail}`)}
                className="mt-3 w-full text-right text-sm font-medium text-[#0060EF] hover:underline"
              >
                자세히 보기 &gt;
              </button>
            ) : (
              <p className="mt-3 text-right text-sm text-zinc-500">
                자세히 보기 &gt;
              </p>
            )}
          </div>
        </section>
      </div>

      {/* 결제 비용 바 + 파트너 매칭 완료하기 */}
      <div className="fixed bottom-0 left-0 right-0 z-10 mx-auto w-full max-w-screen-sm bg-white px-4 pb-8">
        <div className="w-full text-white" style={paymentBarStyle}>
          <span className="text-sm font-medium">결제 비용</span>
          <span className="text-base font-semibold">{paymentAmountLabel}</span>
        </div>
        {error && (
          <p className="mt-2 text-center text-sm text-red-600">{error}</p>
        )}
        <div className="pt-4">
          <button
            type="button"
            onClick={handleMatchComplete}
            disabled={
            loading ||
            (invitationId == null && applicationIdFromState == null)
          }
            className="w-full rounded-full bg-[#0060EF] py-4 text-base font-semibold text-white disabled:opacity-50"
          >
            {loading ? "처리 중..." : "파트너 매칭 완료하기"}
          </button>
        </div>
      </div>
    </Page>
  );
}
