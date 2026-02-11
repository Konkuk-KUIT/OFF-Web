import { useState } from "react";
import Page from "../../components/Page";

const PROJECT_TYPES = [
  { id: "app", label: "앱 개발" },
  { id: "service", label: "서비스 제작" },
  { id: "content", label: "콘텐츠 제작" },
  { id: "product", label: "제품 제작" },
] as const;

const PARTNER_ROLES = [
  { id: "planner", label: "기획자" },
  { id: "developer", label: "개발자" },
  { id: "designer", label: "디자이너" },
  { id: "marketer", label: "마케터" },
  { id: "editor", label: "영상 편집자" },
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

const detailStyle: React.CSSProperties = {
  display: "flex",
  width: "345px",
  maxWidth: "100%",
  height: "24px",
  flexDirection: "column",
  justifyContent: "center",
  flexShrink: 0,
  color: "var(--gray-gray_300, #999)",
  fontFamily: "Inter, sans-serif",
  fontSize: "12px",
  fontStyle: "normal",
  fontWeight: 500,
  lineHeight: "18px",
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

  const togglePartner = (id: string) => {
    setSelectedPartners((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
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

      {/* 프로젝트 생성하기 버튼 */}
      <div className="flex justify-center pt-4">
        <button
          type="button"
          className="flex h-12 w-full max-w-[340px] items-center justify-center rounded-full bg-[#0060EF] text-base font-semibold text-white"
        >
          프로젝트 생성하기
        </button>
      </div>
    </Page>
  );
}
