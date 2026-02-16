import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Page from "../../components/Page";

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


export default function PartnerRecruit() {
  const navigate = useNavigate();
  const [deadline, setDeadline] = useState("2026-01-01");
  const [editingDeadline, setEditingDeadline] = useState(false);
  const [designerPrice, setDesignerPrice] = useState(80000);
  const [developerPrice, setDeveloperPrice] = useState(150000);
  const [editingDesignerPrice, setEditingDesignerPrice] = useState(false);
  const [editingDeveloperPrice, setEditingDeveloperPrice] = useState(false);
  const [serviceSummary, setServiceSummary] = useState(
    "서비스 설명 및 요구사항 바탕 AI로 정리 서비스 설명 및 요구사항 바탕 AI로 정리 서비스 설명 및 요구사항 바탕 AI로 정리 서비스 설명 및 요구사항 바탕 AI로 정리"
  );
  const [designerCardTitle, setDesignerCardTitle] = useState("쿠잇 6기 프론트 개발자");
  const [designerCardDesc, setDesignerCardDesc] = useState("UX/UI 특화 디자이너입니다");
  const [designerCardExp, setDesignerCardExp] = useState("5회 이상");
  const [developerCardTitle, setDeveloperCardTitle] = useState("쿠잇 6기 프론트 개발자");
  const [developerCardDesc, setDeveloperCardDesc] = useState("UX/UI 특화 디자이너입니다");
  const [developerCardExp, setDeveloperCardExp] = useState("3회");

  const totalCost = designerPrice + developerPrice;
  const formatDate = (d: string) =>
    d ? d.split("-").join(".") : "";
  const formatPrice = (n: number) => `${n.toLocaleString()}원`;

  return (
    <Page className="space-y-6 pb-28">
      {/* 프로젝트 유형 */}
      <section>
        <label className="mb-1 block" style={sectionLabelStyle}>프로젝트 유형</label>
        <span style={webDevTagStyle}>웹 개발</span>
      </section>

      {/* 파트너 모집 분야 */}
      <section>
        <label className="mb-1 block" style={sectionLabelStyle}>파트너 모집 분야</label>
        <div className="flex flex-wrap gap-2">
          <span
            style={{
              ...tagButtonStyle,
              background: "#121212",
              color: "white",
            }}
          >
            개발자
          </span>
          <span
            style={{
              ...tagButtonStyle,
              background: "#121212",
              color: "white",
            }}
          >
            디자이너
          </span>
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

        {/* 디자이너 */}
        <div>
          <div className="mb-2 flex items-center justify-between gap-2">
            <span style={roleHeadingStyle}>디자이너</span>
            <div className="flex items-center gap-1">
              {editingDesignerPrice ? (
                <>
                  <input
                    type="number"
                    value={designerPrice}
                    onChange={(e) =>
                      setDesignerPrice(Number(e.target.value) || 0)
                    }
                    className="w-24 rounded border border-zinc-200 px-2 py-1 text-right text-sm"
                  />
                  <span style={priceStyle}>원</span>
                  <button
                    type="button"
                    style={editBtnStyle}
                    onClick={() => setEditingDesignerPrice(false)}
                  >
                    확인
                  </button>
                </>
              ) : (
                <>
                  <span style={priceStyle}>{formatPrice(designerPrice)}</span>
                  <button
                    type="button"
                    style={editBtnStyle}
                    onClick={() => setEditingDesignerPrice(true)}
                  >
                    수정
                  </button>
                </>
              )}
            </div>
          </div>
          <article className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
            <div className="flex items-start justify-between gap-2">
              <input
                type="text"
                value={designerCardTitle}
                onChange={(e) => setDesignerCardTitle(e.target.value)}
                className="min-w-0 flex-1 bg-transparent outline-none"
                style={cardTitleStyle}
              />
              <input type="checkbox" className="mt-0.5 h-4 w-4 shrink-0" />
            </div>
            <input
              type="text"
              value={designerCardDesc}
              onChange={(e) => setDesignerCardDesc(e.target.value)}
              className="mt-1 w-full bg-transparent outline-none"
              style={cardDescStyle}
            />
            <div className="mt-2 flex items-center justify-between gap-2">
              <span style={projectExpLabelStyle}>프로젝트 경험</span>
              <input
                type="text"
                value={designerCardExp}
                onChange={(e) => setDesignerCardExp(e.target.value)}
                className="w-20 bg-transparent text-right outline-none"
                style={projectExpValueStyle}
              />
            </div>
            <div className="mt-3 flex justify-end">
              <button type="button" className="text-sm font-medium text-zinc-700">
                자세히 보기 &gt;
              </button>
            </div>
          </article>
        </div>

        {/* 개발자 */}
        <div>
          <div className="mb-2 flex items-center justify-between gap-2">
            <span style={roleHeadingStyle}>개발자</span>
            <div className="flex items-center gap-1">
              {editingDeveloperPrice ? (
                <>
                  <input
                    type="number"
                    value={developerPrice}
                    onChange={(e) =>
                      setDeveloperPrice(Number(e.target.value) || 0)
                    }
                    className="w-24 rounded border border-zinc-200 px-2 py-1 text-right text-sm"
                  />
                  <span style={priceStyle}>원</span>
                  <button
                    type="button"
                    style={editBtnStyle}
                    onClick={() => setEditingDeveloperPrice(false)}
                  >
                    확인
                  </button>
                </>
              ) : (
                <>
                  <span style={priceStyle}>{formatPrice(developerPrice)}</span>
                  <button
                    type="button"
                    style={editBtnStyle}
                    onClick={() => setEditingDeveloperPrice(true)}
                  >
                    수정
                  </button>
                </>
              )}
            </div>
          </div>
          <article className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
            <div className="flex items-start justify-between gap-2">
              <input
                type="text"
                value={developerCardTitle}
                onChange={(e) => setDeveloperCardTitle(e.target.value)}
                className="min-w-0 flex-1 bg-transparent outline-none"
                style={cardTitleStyle}
              />
              <input type="checkbox" className="mt-0.5 h-4 w-4 shrink-0" />
            </div>
            <input
              type="text"
              value={developerCardDesc}
              onChange={(e) => setDeveloperCardDesc(e.target.value)}
              className="mt-1 w-full bg-transparent outline-none"
              style={cardDescStyle}
            />
            <div className="mt-2 flex items-center justify-between gap-2">
              <span style={projectExpLabelStyle}>프로젝트 경험</span>
              <input
                type="text"
                value={developerCardExp}
                onChange={(e) => setDeveloperCardExp(e.target.value)}
                className="w-20 bg-transparent text-right outline-none"
                style={projectExpValueStyle}
              />
            </div>
            <div className="mt-3 flex justify-end">
              <button type="button" className="text-sm font-medium text-zinc-700">
                자세히 보기 &gt;
              </button>
            </div>
          </article>
        </div>
      </section>

      {/* 예상 비용 */}
      <div
        className="flex flex-row items-center justify-between text-white"
        style={estimatedCostStyle}
      >
        <span className="font-semibold">예상 비용</span>
        <span className="font-semibold">{formatPrice(totalCost)}</span>
      </div>

      {/* 파트너 모집 시작하기 - 홈으로 이동 */}
      <div className="flex justify-center pt-2">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex h-12 w-full max-w-[340px] items-center justify-center rounded-full bg-[#0060EF] text-base font-semibold text-white"
        >
          파트너 모집 시작하기
        </button>
      </div>
    </Page>
  );
}
