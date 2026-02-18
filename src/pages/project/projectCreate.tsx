import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Page from "../../components/Page";
import { estimateProject } from "../../api/project";
import type { EstimateProjectPayload, RecruitmentRequest } from "../../api/project";

const PROJECT_TYPES = [
  { id: "app", label: "앱 개발", projectTypeId: 1 },
  { id: "service", label: "서비스 제작", projectTypeId: 2 },
  { id: "content", label: "콘텐츠 제작", projectTypeId: 3 },
  { id: "product", label: "제품 제작", projectTypeId: 4 },
] as const;

const PARTNER_ROLES = [
  { id: "planner", label: "기획자", roleId: "PM" as const },
  { id: "developer", label: "개발자", roleId: "DEV" as const },
  { id: "designer", label: "디자이너", roleId: "DES" as const },
  { id: "marketer", label: "마케터", roleId: "MAR" as const },
  { id: "editor", label: "영상 편집자", roleId: null },
] as const;

const tagBaseClass =
  "inline-flex h-8 items-center justify-center rounded border px-2.5 py-1 text-sm font-medium transition-colors";
const tagSelectedClass =
  "border-[#0060EF] bg-[rgba(0,96,239,0.15)] text-[#0060EF]";
const tagUnselectedClass = "border-zinc-300 bg-white text-zinc-700";

const inputClass =
  "w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#0060EF]/30";

const labelStyle: React.CSSProperties = {
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

const detailTextStyle: React.CSSProperties = {
  color: "var(--gray-gray_300, #999)",
  fontFamily: "Inter, sans-serif",
  fontSize: "12px",
  fontStyle: "normal",
  fontWeight: 500,
  lineHeight: "18px",
};

export default function ProjectCreate() {
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState("KUIT 6th Project OFF");
  const [serviceDesc, setServiceDesc] = useState("");
  const [projectType, setProjectType] = useState<string>("app");
  const [directInputValue, setDirectInputValue] = useState("");
  const [selectedPartners, setSelectedPartners] = useState<string[]>([
    "developer",
    "designer",
  ]);
  const [developerCount] = useState(3);
  const [designerCount] = useState(2);
  const [requirements, setRequirements] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalEstimate, setTotalEstimate] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const togglePartner = (id: string) => {
    setSelectedPartners((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectedType = PROJECT_TYPES.find((t) => t.id === projectType);
  const projectTypeId = selectedType?.projectTypeId ?? 1;

  const buildRecruitmentList = (): RecruitmentRequest[] => {
    const list: RecruitmentRequest[] = [];
    PARTNER_ROLES.forEach((r) => {
      if (!r.roleId || !selectedPartners.includes(r.id)) return;
      const count =
        r.id === "developer"
          ? developerCount
          : r.id === "designer"
            ? designerCount
            : 1;
      list.push({ roleId: r.roleId, count });
    });
    return list;
  };

  const handleSubmit = async () => {
    setError(null);
    if (!projectName.trim()) {
      setError("프로젝트 명을 입력해주세요.");
      return;
    }
    const payload: EstimateProjectPayload = {
      name: projectName.trim(),
      description: serviceDesc.trim(),
      projectTypeId,
      requirement: requirements.trim(),
      recruitmentList: buildRecruitmentList(),
    };
    setSubmitting(true);
    try {
      const estimateData = await estimateProject(payload);
      const formData = {
        name: projectName.trim(),
        description: serviceDesc.trim(),
        projectTypeId,
        requirement: requirements.trim(),
        recruitmentList: buildRecruitmentList(),
      };
      navigate("/project/partner-recruit", {
        state: { estimateData, formData },
        replace: true,
      });
    } catch (err: unknown) {
      const ax = err as {
        message?: string;
        code?: string;
        response?: { status?: number; data?: { message?: string } };
      };
      const msgFromServer = ax?.response?.data?.message;
      if (import.meta.env.DEV) {
        console.error("[estimateProject] error:", {
          message: ax?.message,
          code: ax?.code,
          status: ax?.response?.status,
          data: ax?.response?.data,
        });
      }
      if (!ax?.response) {
        setError(
          ax?.code === "ECONNABORTED"
            ? "요청 시간이 초과되었습니다(30초). 서버가 응답하지 않거나 네트워크를 확인해 주세요."
            : "견적 조회 요청이 네트워크/CORS 문제로 차단되었습니다. (VITE_API_BASE_URL, https/혼합콘텐츠, 서버 CORS 설정 확인)"
        );
        return;
      }
      setError(msgFromServer ?? "견적 조회에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Page className="space-y-6 pb-24">
      {/* 프로젝트 명 */}
      <section>
        <label className="mb-1 block" style={labelStyle}>프로젝트 명</label>
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className={inputClass}
          placeholder="프로젝트 명 입력"
        />
      </section>

      {/* 서비스 설명 */}
      <section>
        <label className="mb-1 block" style={labelStyle}>서비스 설명</label>
        <textarea
          value={serviceDesc}
          onChange={(e) => setServiceDesc(e.target.value)}
          className={`${inputClass} min-h-[120px] resize-y`}
          placeholder="서비스 설명 상세 서비스 설명 상세 서비스 설명 상세 서비스 설명 상세..."
          rows={4}
        />
      </section>

      {/* 프로젝트 유형 */}
      <section>
        <label className="mb-1 block" style={labelStyle}>프로젝트 유형*</label>
        <div className="flex flex-wrap gap-2">
          {PROJECT_TYPES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setProjectType(t.id)}
              className={`${tagBaseClass} ${
                projectType === t.id ? tagSelectedClass : tagUnselectedClass
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="mt-2">
          <input
            type="text"
            value={directInputValue}
            onChange={(e) => setDirectInputValue(e.target.value)}
            className="w-full border-0 border-b-2 border-zinc-200 bg-white py-2 text-zinc-900 placeholder:text-zinc-400 focus:border-[#0060EF] focus:outline-none focus:ring-0"
            placeholder="직접 입력"
          />
        </div>
      </section>

      {/* 모집 희망 파트너 선택 */}
      <section>
        <label className="mb-1 block" style={labelStyle}>모집 희망 파트너 선택</label>
        <div className="flex flex-wrap gap-2">
          {PARTNER_ROLES.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => togglePartner(r.id)}
              className={`${tagBaseClass} ${
                selectedPartners.includes(r.id)
                  ? tagSelectedClass
                  : tagUnselectedClass
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
        {selectedPartners.includes("developer") && (
          <p className="mt-3 text-left" style={detailTextStyle}>
            개발자 모집 인원: {developerCount}명
          </p>
        )}
        {selectedPartners.includes("designer") && (
          <p className="mt-1 text-left" style={detailTextStyle}>
            디자이너 모집 인원: {designerCount}명
          </p>
        )}
      </section>

      {/* 요구사항 */}
      <section>
        <label className="mb-1 block" style={labelStyle}>요구사항</label>
        <textarea
          value={requirements}
          onChange={(e) => setRequirements(e.target.value)}
          className={`${inputClass} min-h-[120px] resize-y`}
          placeholder="요구사항 상세 입력 요구사항 상세 입력 요구사항 상세 입력..."
          rows={4}
        />
      </section>

      {/* 마감일 */}
      <section>
        <label className="mb-1 block" style={labelStyle}>마감일 *</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className={inputClass}
        />
      </section>

      {/* 총 견적 (선택) */}
      <section>
        <label className="mb-1 block" style={labelStyle}>총 견적 (원)</label>
        <input
          type="number"
          min={0}
          value={totalEstimate || ""}
          onChange={(e) => setTotalEstimate(Number(e.target.value) || 0)}
          className={inputClass}
          placeholder="0"
        />
      </section>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {/* 프로젝트 생성하기 버튼 */}
      <div className="flex justify-center pt-4">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="flex h-12 w-full max-w-[340px] items-center justify-center rounded-full bg-[#0060EF] text-base font-semibold text-white disabled:opacity-50"
        >
          {submitting ? "생성 중..." : "프로젝트 생성하기"}
        </button>
      </div>
    </Page>
  );
}
