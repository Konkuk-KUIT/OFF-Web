import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Page from "../../components/Page";
import PartnerPortfolioCard, {
  type PortfolioItemData,
} from "./PartnerPortfolioCard";

const chaticonUrl = new URL("../../assets/chaticon.svg", import.meta.url).href;

// 목업: id별 상세 데이터 (실제로는 API 연동)
const MOCK_PARTNER_DETAIL: Record<
  string,
  {
    role: string;
    specialization: string;
    experience: string;
    intro: string;
    portfolios: PortfolioItemData[];
  }
> = {
  "1": {
    role: "쿠잇 6기 서버 개발자",
    specialization: "웹앱 서버 개발자입니다.",
    experience: "3회 이상",
    intro:
      "파트너 한 줄 소개 파트너 한 줄 소개 파트너 한 줄 소개 파트너 한 줄 소개 파트너 한 줄 소개 파트너 한 줄 소개 파트너 한 줄 소개 파트너 한 줄 소개 파트너 한 줄 소개 파트너 한 줄 소개 파트너 한 줄 소개 파트너 한 줄 소개",
    portfolios: [
      {
        title: "포트폴리오 제목1",
        linkLabel: "링크1",
        description: "프로필 등록 페이지에서 작성한 포트폴리오 설명",
      },
      {
        title: "포트폴리오 제목2",
        linkLabel: "링크2",
        description: "프로필 등록 페이지에서 작성한 포트폴리오 설명",
      },
      {
        title: "포트폴리오 제목3",
        linkLabel: "링크3",
        description: "프로필 등록 페이지에서 작성한 포트폴리오 설명",
      },
    ],
  },
  "2": {
    role: "쿠잇 6기 프론트 개발자",
    specialization: "UX/UI 특화 디자이너입니다",
    experience: "5회 이상",
    intro:
      "파트너 한 줄 소개 파트너 한 줄 소개 파트너 한 줄 소개 파트너 한 줄 소개 파트너 한 줄 소개 파트너 한 줄 소개 파트너 한 줄 소개 파트너 한 줄 소개 파트너 한 줄 소개 파트너 한 줄 소개 파트너 한 줄 소개 파트너 한 줄 소개",
    portfolios: [
      {
        title: "포트폴리오 제목1",
        linkLabel: "링크1",
        description: "프로필 등록 페이지에서 작성한 포트폴리오 설명",
      },
      {
        title: "포트폴리오 제목2",
        linkLabel: "링크2",
        description: "프로필 등록 페이지에서 작성한 포트폴리오 설명",
      },
      {
        title: "포트폴리오 제목3",
        linkLabel: "링크3",
        description: "프로필 등록 페이지에서 작성한 포트폴리오 설명",
      },
    ],
  },
};

const defaultDetail = MOCK_PARTNER_DETAIL["1"];

export default function PartnerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showRequestToast, setShowRequestToast] = useState(false);

  const detail = (id && MOCK_PARTNER_DETAIL[id]) || defaultDetail;

  const handleRequest = () => {
    setShowRequestToast(true);
    setTimeout(() => {
      setShowRequestToast(false);
      navigate("/");
    }, 2500);
  };

  return (
    <Page className="pb-28 pt-2">
      {showRequestToast && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
          <div className="flex h-[50px] w-[304px] items-center justify-center rounded-[50px] bg-[#9B9B9B] text-center text-white">
            요청이 완료되었습니다.
          </div>
        </div>
      )}

      <div className="space-y-4">
        {/* 파트너 요약 카드 */}
        <section className="rounded-2xl bg-zinc-100 p-4">
          <h2 className="text-lg font-bold text-zinc-900">{detail.role}</h2>
          <p className="mt-1 text-sm text-zinc-700">{detail.specialization}</p>
          <div className="mt-3 flex justify-between text-sm">
            <span className="text-zinc-600">프로젝트 경험</span>
            <span className="font-medium text-zinc-900">{detail.experience}</span>
          </div>
        </section>

        {/* 파트너 소개 카드 */}
        <section className="rounded-2xl bg-zinc-100 p-4">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-800">
            {detail.intro}
          </p>
        </section>

        {/* 파트너의 포트폴리오 */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-zinc-900">
              파트너의 포트폴리오
            </h3>
            <span className="flex cursor-default items-center gap-1.5 text-sm font-medium text-zinc-700">
              채팅하기
              <img src={chaticonUrl} alt="" className="h-6 w-6 shrink-0" />
            </span>
          </div>

          <ul className="space-y-3">
            {detail.portfolios.map((item, i) => (
              <li key={i}>
                <PartnerPortfolioCard
                  title={item.title}
                  linkLabel={item.linkLabel}
                  description={item.description}
                />
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* 요청하기 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 z-10 mx-auto w-full max-w-screen-sm border-t border-zinc-100 bg-white px-4 pb-8 pt-4">
        <button
          type="button"
          onClick={handleRequest}
          className="w-full rounded-full bg-[#0060EF] py-4 text-base font-semibold text-white"
        >
          요청하기
        </button>
      </div>
    </Page>
  );
}
