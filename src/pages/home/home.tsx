import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Page from "../../components/Page";
import { getHome } from "../../api/home";
import type { HomeProjectItem, HomePartnerItem } from "../../api/home";

const homeBg = new URL("../../assets/home.svg", import.meta.url).href;
const logoUrl = new URL("../../assets/logo.svg", import.meta.url).href;

const ROLE_LABEL: Record<string, string> = {
  PM: "기획",
  DEVELOPER: "개발자",
  DESIGNER: "디자이너",
  MARKETER: "마케터",
};

function formatRecruitSummary(recruitList: { role: string; count: number }[]): string {
  if (!recruitList.length) return "파트너 모집 중";
  const parts = recruitList.map(
    (r) => `${ROLE_LABEL[r.role] ?? r.role} ${r.count}명`
  );
  return `파트너 모집 중 (${parts.join(", ")})`;
}

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<HomeProjectItem[]>([]);
  const [partners, setPartners] = useState<HomePartnerItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getHome({ page: 1, size: 10 })
      .then((res) => {
        if (cancelled) return;
        const { data } = res.data;
        setProjects(data.projects ?? []);
        setPartners(data.partners ?? []);
      })
      .catch((err) => {
        if (cancelled) return;
        const status = err?.response?.status;
        const message = err?.response?.data?.message;
        if (status === 401) {
          setError("로그인이 필요합니다.");
        } else {
          setError(message ?? "데이터를 불러오지 못했습니다.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <Page className="space-y-6">
        <div className="flex justify-center py-12 text-zinc-500">
          로딩 중...
        </div>
      </Page>
    );
  }

  if (error) {
    return (
      <Page className="space-y-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
        {error === "로그인이 필요합니다." && (
          <Link
            to="/login"
            className="inline-block rounded-lg bg-zinc-800 px-4 py-2 text-white"
          >
            로그인하기
          </Link>
        )}
      </Page>
    );
  }

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
          {projects.map((project) => (
            <li key={project.projectId}>
              <article className="rounded-2xl border border-zinc-200 bg-white p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 style={projectTitleStyle}>{project.name}</h3>
                  <span style={projectTypeTagStyle}>
                    D-{project.dday >= 0 ? project.dday : "마감"}
                  </span>
                </div>
                <p className="mt-2" style={projectDescStyle}>
                  {project.creatorNickname} · 진행률 {project.progressPercent}%
                </p>
                {project.recruiting && project.recruitList?.length > 0 && (
                  <p className="mt-2" style={projectRecruitStyle}>
                    {formatRecruitSummary(project.recruitList)}
                  </p>
                )}
                {project.recruiting && (!project.recruitList || project.recruitList.length === 0) && (
                  <p className="mt-2" style={projectRecruitStyle}>
                    파트너 모집 중
                  </p>
                )}
                {!project.recruiting && (
                  <p className="mt-2" style={projectRecruitStyle}>
                    모집 마감
                  </p>
                )}
                <div className="mt-3 flex justify-end">
                  <Link
                    to={`/project/${project.projectId}`}
                    className="text-sm font-medium text-zinc-700"
                  >
                    자세히 보기 &gt;
                  </Link>
                </div>
              </article>
            </li>
          ))}
        </ul>
        {projects.length === 0 && (
          <p className="py-4 text-center text-zinc-500">진행 중인 프로젝트가 없습니다.</p>
        )}
      </section>

      {/* 파트너 둘러보기 */}
      <section className="space-y-4">
        <h2 style={sectionHeadingStyle}>파트너 둘러보기</h2>
        <ul className="space-y-3">
          {partners.map((partner) => (
            <li key={partner.memberId}>
              <article className="rounded-2xl border border-zinc-200 bg-white p-4">
                <h3 className="font-semibold text-zinc-900">
                  {partner.nickname} · {ROLE_LABEL[partner.role] ?? partner.role}
                </h3>
                <p className="mt-2 text-sm text-zinc-600">
                  {partner.selfIntroduction || "소개가 없습니다."}
                </p>
                <div className="mt-3 flex justify-end">
                  <span className="text-sm text-zinc-500">
                    프로젝트 {partner.projectCount}회 · 포트폴리오 {partner.portfolioCount}개
                  </span>
                </div>
                <div className="mt-1 flex justify-end">
                  <Link
                    to={`/partner/${partner.memberId}`}
                    className="text-sm font-medium text-zinc-700"
                  >
                    자세히 보기 &gt;
                  </Link>
                </div>
              </article>
            </li>
          ))}
        </ul>
        {partners.length === 0 && (
          <p className="py-4 text-center text-zinc-500">추천 파트너가 없습니다.</p>
        )}
      </section>
    </Page>
  );
}
