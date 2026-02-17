import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Page from "../../components/Page";
import { createProject } from "../../api/project";
import type {
  EstimateProjectResponse,
  EstimateItem,
  ConfirmProjectPayload,
} from "../../api/project";

const sectionLabelStyle: React.CSSProperties = {
  display: "flex",
  height: "24px",
  flexDirection: "column",
  justifyContent: "center",
  alignSelf: "stretch",
  color: "var(--gray-gray_900, #121212)",
  fontFamily: "Inter, sans-serif",
  fontSize: "18px",
  fontStyle: "normal",
  fontWeight: 700,
  lineHeight: "28px",
  letterSpacing: "-0.18px",
};

const roleHeadingStyle: React.CSSProperties = {
  display: "flex",
  height: "24px",
  flexDirection: "column",
  justifyContent: "center",
  alignSelf: "stretch",
  color: "var(--gray-gray_900, #121212)",
  fontFamily: "Inter, sans-serif",
  fontSize: "16px",
  fontStyle: "normal",
  fontWeight: 700,
  lineHeight: "24px",
  letterSpacing: "-0.16px",
};

const priceStyle: React.CSSProperties = {
  color: "var(--gray-gray_900, #121212)",
  fontFamily: "Inter, sans-serif",
  fontSize: "14px",
  fontStyle: "normal",
  fontWeight: 700,
  lineHeight: "22px",
};

const cardTitleStyle: React.CSSProperties = {
  width: "171px",
  color: "var(--gray-gray_900, #121212)",
  fontFamily: "Inter, sans-serif",
  fontSize: "16px",
  fontStyle: "normal",
  fontWeight: 700,
  lineHeight: "22px",
};

const cardDescStyle: React.CSSProperties = {
  width: "231px",
  maxWidth: "100%",
  color: "var(--gray-gray_900, #121212)",
  fontFamily: "Inter, sans-serif",
  fontSize: "14px",
  fontStyle: "normal",
  fontWeight: 400,
  lineHeight: "22px",
};

const projectExpLabelStyle: React.CSSProperties = {
  width: "116px",
  color: "var(--gray-gray_900, #121212)",
  fontFamily: "Inter, sans-serif",
  fontSize: "14px",
  fontStyle: "normal",
  fontWeight: 400,
  lineHeight: "22px",
};

const projectExpValueStyle: React.CSSProperties = {
  color: "var(--gray-gray_900, #121212)",
  fontFamily: "Inter, sans-serif",
  fontSize: "14px",
  fontStyle: "normal",
  fontWeight: 400,
  lineHeight: "22px",
};

const tagButtonStyle: React.CSSProperties = {
  display: "flex",
  height: "28px",
  padding: "4px 10px",
  justifyContent: "center",
  alignItems: "center",
  gap: "10px",
  borderRadius: "4px",
  cursor: "pointer",
};

const webDevTagStyle: React.CSSProperties = {
  ...tagButtonStyle,
  border: "1px solid #0060EF",
  background: "rgba(0, 96, 239, 0.15)",
  color: "#0060EF",
  display: "inline-flex",
  width: "auto",
  flexShrink: 0,
};

/** 홈 '콘텐츠 제작' 태그와 동일 스타일 */
const editBtnStyle: React.CSSProperties = {
  display: "flex",
  height: "28px",
  padding: "4px 10px",
  justifyContent: "center",
  alignItems: "center",
  gap: "10px",
  borderRadius: "4px",
  border: "1px solid #0060EF",
  background: "rgba(0, 96, 239, 0.15)",
  color: "#0060EF",
  fontFamily: "Inter, sans-serif",
  fontSize: "12px",
  fontWeight: 500,
  cursor: "pointer",
};

const estimatedCostStyle: React.CSSProperties = {
  display: "flex",
  padding: "18px 20px",
  flexDirection: "column",
  alignItems: "center",
  gap: "8px",
  alignSelf: "stretch",
  borderRadius: "8px",
  background: "var(--gray-gray_900, #121212)",
};


type FormDataForConfirm = Omit<
  ConfirmProjectPayload,
  "serviceSummary" | "endDate" | "totalEstimate"
>;

type PartnerRecruitState = {
  estimateData: EstimateProjectResponse;
  formData: FormDataForConfirm;
};

export default function PartnerRecruit() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as PartnerRecruitState | null;

  const [estimateList, setEstimateList] = useState<EstimateItem[]>([]);
  const [deadline, setDeadline] = useState("");
  const [editingDeadline, setEditingDeadline] = useState(false);
  const [serviceSummary, setServiceSummary] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!state?.estimateData) {
      navigate("/project/create", { replace: true });
      return;
    }
    setEstimateList(state.estimateData.estimateList ?? []);
    setDeadline(state.estimateData.endDate ?? "");
    setServiceSummary(state.estimateData.serviceSummary ?? "");
  }, [state, navigate]);

  const totalCost = estimateList.reduce((sum, item) => sum + item.cost * item.count, 0);
  const formatDate = (d: string) =>
    d ? d.replace(/-/g, ".") : "";
  const formatPrice = (n: number) => `${n.toLocaleString()}원`;

  const updateEstimateCost = (index: number, cost: number) => {
    setEstimateList((prev) =>
      prev.map((item, i) => (i === index ? { ...item, cost } : item))
    );
  };

  /** 백엔드(Java LocalDate 등)는 보통 yyyy-MM-dd만 허용 */
  const normalizeEndDateForApi = (dateStr: string): string => {
    if (!dateStr || !dateStr.trim()) return dateStr;
    const trimmed = dateStr.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
    if (trimmed.length >= 10 && /^\d{4}-\d{2}-\d{2}/.test(trimmed)) return trimmed.slice(0, 10);
    const dotMatch = trimmed.match(/^(\d{4})\.(\d{2})\.(\d{2})/);
    if (dotMatch) return `${dotMatch[1]}-${dotMatch[2]}-${dotMatch[3]}`;
    return trimmed;
  };

  const handleStartRecruit = async () => {
    if (!state?.formData || !state?.estimateData) return;
    setError(null);

    const recruitmentList = (state.formData.recruitmentList ?? []).map((r) => ({
      roleId: String(r.roleId),
      count: Math.max(1, Math.round(Number(r.count))),
    })).filter((r) => r.roleId && r.count > 0);

    if (recruitmentList.length === 0) {
      setError("모집 직무를 1개 이상 선택해주세요.");
      return;
    }

    const normalizedEndDate = normalizeEndDateForApi(deadline);
    if (!normalizedEndDate || !/^\d{4}-\d{2}-\d{2}$/.test(normalizedEndDate)) {
      setError("프로젝트 마감일을 올바른 날짜(YYYY-MM-DD)로 입력해주세요.");
      return;
    }

    const projectTypeId = Math.round(Number(state.formData.projectTypeId)) || 1;
    if (projectTypeId < 1 || projectTypeId > 4) {
      setError("프로젝트 유형이 올바르지 않습니다.");
      return;
    }

    const total = estimateList.reduce((s, i) => s + i.cost * i.count, 0);
    const totalEstimateValue = Math.max(0, Math.round(Number(total)));
    if (totalEstimateValue <= 0) {
      setError("예상 비용이 0원입니다. 견적 확인에서 역할별 비용(원)을 입력한 뒤 다시 시도해주세요.");
      return;
    }

    setSubmitting(true);
    try {
      const payload: ConfirmProjectPayload = {
        name: (state.formData.name ?? "").trim() || "제목 없음",
        description: (state.formData.description ?? "").trim(),
        projectTypeId,
        requirement: (state.formData.requirement ?? "").trim(),
        recruitmentList,
        serviceSummary: (serviceSummary ?? "").trim(),
        endDate: normalizedEndDate,
        totalEstimate: totalEstimateValue,
      };
      const { projectId } = await createProject(payload);
      navigate("/account", { state: { projectId }, replace: true });
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? "프로젝트 확정에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!state?.estimateData) return null;
  const { projectType, recruitmentRoles } = state.estimateData;

  return (
    <Page className="space-y-6 pb-28">
      {/* 프로젝트 유형 */}
      <section>
        <label className="mb-1 block" style={sectionLabelStyle}>프로젝트 유형</label>
        <span style={webDevTagStyle}>{projectType}</span>
      </section>

      {/* 파트너 모집 분야 */}
      <section>
        <label className="mb-1 block" style={sectionLabelStyle}>파트너 모집 분야</label>
        <div className="flex flex-wrap gap-2">
          {recruitmentRoles.map((role) => (
            <span
              key={role}
              style={{
                ...tagButtonStyle,
                background: "#121212",
                color: "white",
              }}
            >
              {role}
            </span>
          ))}
        </div>
      </section>

      {/* 프로젝트 마감일 */}
      <section>
        <label className="mb-1 block" style={sectionLabelStyle}>프로젝트 마감일</label>
        <div className="flex items-center gap-2">
          {editingDeadline ? (
            <>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="rounded border border-zinc-200 px-2 py-1 text-sm"
              />
              <button
                type="button"
                style={editBtnStyle}
                onClick={() => setEditingDeadline(false)}
              >
                확인
              </button>
            </>
          ) : (
            <>
              <p className="text-sm text-zinc-500">{formatDate(deadline)}</p>
              <button
                type="button"
                style={editBtnStyle}
                onClick={() => setEditingDeadline(true)}
              >
                수정
              </button>
            </>
          )}
        </div>
      </section>

      {/* 서비스 요약 */}
      <section>
        <label className="mb-1 block" style={sectionLabelStyle}>서비스 요약</label>
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
          <textarea
            value={serviceSummary}
            onChange={(e) => setServiceSummary(e.target.value)}
            className="min-h-[100px] w-full resize-y bg-transparent text-sm text-zinc-600 outline-none placeholder:text-zinc-400"
            placeholder="서비스 설명 및 요구사항을 입력하세요."
            rows={4}
          />
        </div>
      </section>

      {/* 견적 확인 */}
      <section className="space-y-4">
        <h2 className="mb-1 block" style={sectionLabelStyle}>견적 확인</h2>

        {estimateList.map((item, index) => (
          <div key={`${item.role}-${index}`}>
            <div className="mb-2 flex items-center justify-between gap-2">
              <span style={roleHeadingStyle}>{item.role}</span>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={item.cost}
                  onChange={(e) =>
                    updateEstimateCost(index, Number(e.target.value) || 0)
                  }
                  className="w-24 rounded border border-zinc-200 px-2 py-1 text-right text-sm"
                />
                <span style={priceStyle}>원</span>
              </div>
            </div>
            {item.candidatePartners?.map((partner) => (
              <article
                key={partner.memberId}
                className="rounded-xl border border-zinc-200 bg-zinc-50 p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="min-w-0 flex-1" style={cardTitleStyle}>
                    {partner.nickname}
                  </span>
                  <input type="checkbox" className="mt-0.5 h-4 w-4 shrink-0" />
                </div>
                <p className="mt-1 w-full" style={cardDescStyle}>
                  {partner.introduction}
                </p>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <span style={projectExpLabelStyle}>프로젝트 경험</span>
                  <span style={projectExpValueStyle}>
                    {partner.projectCount}회
                  </span>
                </div>
                <div className="mt-3 flex justify-end">
                  <button type="button" className="text-sm font-medium text-zinc-700">
                    자세히 보기 &gt;
                  </button>
                </div>
              </article>
            ))}
          </div>
        ))}
      </section>

      {/* 예상 비용 */}
      <div
        className="flex flex-row items-center justify-between text-white"
        style={estimatedCostStyle}
      >
        <span className="font-semibold">예상 비용</span>
        <span className="font-semibold">{formatPrice(totalCost)}</span>
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {/* 파트너 모집 시작하기 → 결제 화면 */}
      <div className="flex justify-center pt-2">
        <button
          type="button"
          onClick={handleStartRecruit}
          disabled={submitting}
          className="flex h-12 w-full max-w-[340px] items-center justify-center rounded-full bg-[#0060EF] text-base font-semibold text-white disabled:opacity-50"
        >
          {submitting ? "처리 중..." : "파트너 모집 시작하기"}
        </button>
      </div>
    </Page>
  );
}
