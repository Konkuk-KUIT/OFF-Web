import { Link } from "react-router-dom";
import Page from "../../components/Page";
import type { HomeProject, HomePartner } from "./types";

const homeBg = new URL("../../assets/home.svg", import.meta.url).href;
const logoUrl = new URL("../../assets/logo.svg", import.meta.url).href;

// TODO: API 연동 시 이 데이터를 API 호출 결과로 교체
const MOCK_PROJECTS: HomeProject[] = [
  {
    id: "1",
    title: "KUIT 6th Project",
    type: "content",
    typeLabel: "콘텐츠 제작",
    description:
      "프로젝트 1줄 소개 프로젝트 1줄 소개 프로젝트 1줄 소개 프로젝트 1줄 소개 프로젝트 1줄 소개",
    recruiting: true,
    recruitSummary: "파트너 모집 중 (개발자 1명, 디자이너 2명)",
  },
  {
    id: "2",
    title: "KUIT 6th Project",
    type: "service",
    typeLabel: "서비스 제작",
    description:
      "프로젝트 1줄 소개 프로젝트 1줄 소개 프로젝트 1줄 소개 프로젝트 1줄 소개 프로젝트 1줄 소개",
    recruiting: true,
    recruitSummary: "파트너 모집 중 (개발자 1명, 디자이너 2명)",
  },
  {
    id: "3",
    title: "KUIT 6th Project",
    type: "app",
    typeLabel: "앱 개발",
    description:
      "프로젝트 1줄 소개 프로젝트 1줄 소개 프로젝트 1줄 소개 프로젝트 1줄 소개 프로젝트 1줄 소개",
    recruiting: false,
  },
  {
    id: "4",
    title: "KUIT 6th Project",
    type: "app",
    typeLabel: "앱 개발",
    description:
      "프로젝트 1줄 소개 프로젝트 1줄 소개 프로젝트 1줄 소개 프로젝트 1줄 소개 프로젝트 1줄 소개",
    recruiting: false,
  },
];

const MOCK_PARTNERS: HomePartner[] = [
  {
    id: "1",
    role: "쿠잇 6기 서버 개발자",
    description: "웹앱 서버 개발자입니다. 프로젝트 경험",
    experience: "3회",
  },
  {
    id: "2",
    role: "쿠잇 6기 디자이너",
    description: "UX/UI 특화 디자이너입니다 프로젝트 경험",
    experience: "5회 이상",
  },
];

const projectTypeTagStyle: React.CSSProperties = {
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
  flexShrink: 0,
};

const projectTitleStyle: React.CSSProperties = {
  display: "flex",
  height: "24px",
  flexDirection: "column",
  justifyContent: "center",
  flex: "1 0 0",
  color: "var(--gray-gray_900, #121212)",
  fontFamily: "Inter, sans-serif",
  fontSize: "16px",
  fontStyle: "normal",
  fontWeight: 700,
  lineHeight: "24px",
  letterSpacing: "-0.16px",
};

const projectDescStyle: React.CSSProperties = {
  display: "-webkit-box",
  width: "305px",
  maxWidth: "100%",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 2,
  overflow: "hidden",
  color: "var(--gray-gray_400, #858585)",
  textOverflow: "ellipsis",
  fontFamily: "Inter, sans-serif",
  fontSize: "14px",
  fontStyle: "normal",
  fontWeight: 400,
  lineHeight: "22px",
};

const projectRecruitStyle: React.CSSProperties = {
  width: "305px",
  maxWidth: "100%",
  height: "22px",
  flexShrink: 0,
  overflow: "hidden",
  color: "var(--gray-gray_900, #121212)",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontFamily: "Inter, sans-serif",
  fontSize: "14px",
  fontStyle: "normal",
  fontWeight: 400,
  lineHeight: "22px",
};

const sectionHeadingStyle: React.CSSProperties = {
  display: "flex",
  width: "340px",
  maxWidth: "100%",
  height: "24px",
  flexDirection: "column",
  justifyContent: "center",
  color: "var(--gray-gray_900, #121212)",
  fontFamily: "Inter, sans-serif",
  fontSize: "18px",
  fontStyle: "normal",
  fontWeight: 700,
  lineHeight: "28px",
  letterSpacing: "-0.18px",
};

const aiBannerStyle: React.CSSProperties = {
  width: "100%",
  minHeight: "184px",
  backgroundColor: "#1E4682",
};

const aiBannerTextWrapStyle: React.CSSProperties = {
  display: "flex",
  width: "255px",
  maxWidth: "100%",
  height: "72px",
  flexDirection: "column",
  justifyContent: "center",
};

const aiBannerTextStyle: React.CSSProperties = {
  color: "var(--gray-white, #FFF)",
  fontFamily: "Inter, sans-serif",
  fontSize: "24px",
  fontStyle: "normal",
  fontWeight: 700,
  lineHeight: "34px",
  letterSpacing: "-0.24px",
};

export default function Home() {
  return (
    <Page className="space-y-6">
      {/* AI 프로젝트 관리 배너 */}
      <section
        className="relative overflow-hidden rounded-2xl px-5 py-6 text-white"
        style={aiBannerStyle}
      >
        <img
          src={homeBg}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="relative z-10 flex items-start gap-4">
          <img
            src={logoUrl}
            alt=""
            className="shrink-0 object-contain"
            style={{ width: "79.202px", height: "79.202px" }}
          />
          <div className="min-w-0 flex-1" style={aiBannerTextWrapStyle}>
            <p style={aiBannerTextStyle}>AI로</p>
            <p style={aiBannerTextStyle}>프로젝트를 관리하세요</p>
          </div>
        </div>
        <div className="relative z-10 mt-4 flex justify-center">
          <Link
            to="/project/create"
            className="inline-flex h-[50px] min-w-0 shrink-0 items-center justify-center rounded-[50px] bg-[var(--gray-gray_900,#121212)] px-8 py-[14px] text-white whitespace-nowrap"
            style={{
              fontFamily: "Inter, sans-serif",
            }}
          >
            프로젝트 생성하기
          </Link>
        </div>
      </section>

      {/* 진행중인 프로젝트 */}
      <section className="space-y-4">
        <h2 style={sectionHeadingStyle}>진행중인 프로젝트</h2>
        <ul className="space-y-3">
          {MOCK_PROJECTS.map((project) => (
            <li key={project.id}>
              <article className="rounded-2xl border border-zinc-200 bg-white p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 style={projectTitleStyle}>{project.title}</h3>
                  <span style={projectTypeTagStyle}>{project.typeLabel}</span>
                </div>
                <p className="mt-2" style={projectDescStyle}>
                  {project.description}
                </p>
                {project.recruiting && project.recruitSummary && (
                  <p className="mt-2" style={projectRecruitStyle}>
                    {project.recruitSummary}
                  </p>
                )}
                {!project.recruiting && (
                  <p className="mt-2" style={projectRecruitStyle}>
                    모집 마감
                  </p>
                )}
                <div className="mt-3 flex justify-end">
                  <Link
                    to={`/project/${project.id}`}
                    className="text-sm font-medium text-zinc-700"
                  >
                    자세히 보기 &gt;
                  </Link>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </section>

      {/* 파트너 둘러보기 */}
      <section className="space-y-4">
        <h2 style={sectionHeadingStyle}>파트너 둘러보기</h2>
        <ul className="space-y-3">
          {MOCK_PARTNERS.map((partner) => (
            <li key={partner.id}>
              <article className="rounded-2xl border border-zinc-200 bg-white p-4">
                <h3 className="font-semibold text-zinc-900">{partner.role}</h3>
                <p className="mt-2 text-sm text-zinc-600">{partner.description}</p>
                <div className="mt-3 flex justify-end">
                  <span className="text-sm text-zinc-500">
                    {partner.experience}
                  </span>
                </div>
                <div className="mt-1 flex justify-end">
                  <Link
                    to={`/partner/${partner.id}`}
                    className="text-sm font-medium text-zinc-700"
                  >
                    자세히 보기 &gt;
                  </Link>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </section>
    </Page>
  );
}
