import { useNavigate } from "react-router-dom";
import Page from "../../components/Page";
import PartnerPortfolioCard, {
  type PortfolioItemData,
} from "./PartnerPortfolioCard";

const chaticonUrl = new URL("../../assets/chaticon.svg", import.meta.url).href;

const MOCK_SUPPORTED_PARTNER = {
  role: "쿠잇 6기 프론트 개발자",
  description: "앱 개발 프론트 개발자입니다.",
  projectExperience: "5",
  estimatedQuote: "150,000원",
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
  ] as PortfolioItemData[],
};

export default function SupportedPartner() {
  const navigate = useNavigate();
  const data = MOCK_SUPPORTED_PARTNER;

  return (
    <Page className="pb-28 pt-2">
      <div className="space-y-4">
        {/* 파트너 요약 카드 */}
        <section className="rounded-2xl bg-zinc-100 p-4">
          <h2 className="text-lg font-bold text-zinc-900">{data.role}</h2>
          <p className="mt-1 text-sm text-zinc-700">{data.description}</p>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-600">프로젝트 경험</span>
              <span className="font-medium text-zinc-900">
                {data.projectExperience}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-600">예상 견적</span>
              <span className="font-medium text-zinc-900">
                {data.estimatedQuote}
              </span>
            </div>
          </div>
        </section>

        {/* 파트너 소개 카드 */}
        <section className="rounded-2xl bg-zinc-100 p-4">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-800">
            {data.intro}
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
            {data.portfolios.map((item, i) => (
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

      {/* 수락하기 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 z-10 mx-auto w-full max-w-screen-sm border-t border-zinc-100 bg-white px-4 pb-8 pt-4">
        <button
          type="button"
          onClick={() => navigate("/partner/supported/confirm")}
          className="w-full rounded-full bg-[#0060EF] py-4 text-base font-semibold text-white"
        >
          수락하기
        </button>
      </div>
    </Page>
  );
}
