import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Page from "../../components/Page";
import PartnerPortfolioCard, {
  type PortfolioItemData,
} from "./PartnerPortfolioCard";
import {
  getNotifications,
  parseInvitationIdFromRedirectUrl,
  isProjectInvitationType,
} from "../../api/notifications";
import { getApplicationDetail, type ApplicationDetailResponse } from "../../api/project";
import { getRoleLabel } from "../../api/partner";
import { getChatRooms, sendFirstMessage } from "../../api/chat";

const chaticonUrl = new URL("../../assets/chaticon.svg", import.meta.url).href;

type PartnerDisplayData = {
  role: string;
  description: string;
  projectExperience: string;
  estimatedQuote: string;
  intro: string;
  portfolios: PortfolioItemData[];
  projectId?: number;
  serviceSummary?: string;
  recruitRole?: string;
};

const MOCK_SUPPORTED_PARTNER: PartnerDisplayData = {
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
  ],
};

function applicationToDisplayData(detail: ApplicationDetailResponse): PartnerDisplayData {
  const roleLabel = getRoleLabel(detail.role);
  const roleTitle = detail.partnerNickname
    ? `${detail.partnerNickname} · ${roleLabel}`
    : roleLabel;
  return {
    role: roleTitle,
    description: detail.partnerIntroduction || "",
    projectExperience: "-",
    estimatedQuote: `${(detail.cost ?? 0).toLocaleString()}원`,
    intro: detail.partnerIntroduction || "",
    portfolios: [],
    projectId: detail.projectId,
    serviceSummary: detail.projectDescription,
    recruitRole: roleLabel,
  };
}

export default function SupportedPartner() {
  const navigate = useNavigate();
  const location = useLocation();
  const [invitationId, setInvitationId] = useState<number | null>(null);
  const [projectId, setProjectId] = useState<number | null>(null);
  const [applicationId, setApplicationId] = useState<number | null>(null);

  const [applicationDetail, setApplicationDetail] = useState<ApplicationDetailResponse | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);

  useEffect(() => {
    const fromState = location.state as {
      invitationId?: number;
      projectId?: number;
      applicationId?: number;
    } | null;
    if (
      fromState?.invitationId != null ||
      fromState?.projectId != null ||
      fromState?.applicationId != null
    ) {
      if (fromState.invitationId != null) setInvitationId(fromState.invitationId);
      if (fromState.projectId != null) setProjectId(fromState.projectId);
      if (fromState.applicationId != null) setApplicationId(fromState.applicationId);
      return;
    }
    getNotifications({ size: 20 })
      .then((res) => {
        const list = res.data.data?.notifications ?? [];
        const invitation = list.find(
          (n) =>
            isProjectInvitationType(n.type) &&
            parseInvitationIdFromRedirectUrl(n.redirectUrl) != null
        );
        const id = invitation
          ? parseInvitationIdFromRedirectUrl(invitation.redirectUrl)
          : null;
        setInvitationId(id);
      })
      .catch(() => setInvitationId(null));
  }, [location.state]);

  /* 2. 지원 정보 조회 API 호출 → 3. 응답에서 프로젝트 정보(projectId, serviceSummary, recruitRole 등) 확인 */
  useEffect(() => {
    if (applicationId == null) return;
    setDetailLoading(true);
    setDetailError(null);
    getApplicationDetail(applicationId)
      .then(setApplicationDetail)
      .catch((e) => setDetailError(e instanceof Error ? e.message : "지원 정보를 불러오지 못했습니다."))
      .finally(() => setDetailLoading(false));
  }, [applicationId]);

  const displayData = applicationDetail
    ? applicationToDisplayData(applicationDetail)
    : MOCK_SUPPORTED_PARTNER;
  const data = displayData;
  const partnerDataForConfirm = applicationDetail
    ? {
        role: displayData.role,
        description: displayData.description,
        projectExperience: displayData.projectExperience,
        estimatedQuote: displayData.estimatedQuote,
        intro: displayData.serviceSummary ?? displayData.intro,
      }
    : MOCK_SUPPORTED_PARTNER;

  /** 채팅하기: 기존 CONTACT 방 있으면 해당 방으로, 없으면 POST /chat/rooms/first 후 방으로 이동 */
  const handleChatClick = () => {
    const partnerId = applicationDetail?.partnerId;
    if (partnerId == null || partnerId <= 0) {
      setChatError("채팅할 파트너 정보가 없습니다.");
      return;
    }
    setChatError(null);
    setChatLoading(true);
    getChatRooms("CONTACT")
      .then((res) => {
        const rooms = res.data?.data?.chatRoomResponses ?? [];
        const existing = rooms.find(
          (r: { chatRoomId?: number; roomId?: number; partnerId?: number; partnerNickname?: string }) =>
            r.partnerId === partnerId || r.partnerNickname === applicationDetail?.partnerNickname
        );
        const roomId = existing ? (existing.chatRoomId ?? existing.roomId) : null;
        if (roomId != null) {
          navigate(`/chat/${roomId}`);
          return;
        }
        return sendFirstMessage({ opponentId: partnerId, content: "안녕하세요" });
      })
      .then((res) => {
        if (!res) return;
        const chatRoomId = res.data?.data?.chatRoomId;
        if (chatRoomId != null) {
          navigate(`/chat/${chatRoomId}`);
        } else {
          setChatError("채팅방을 열 수 없습니다.");
        }
      })
      .catch((err: unknown) => {
        const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
        setChatError(msg ?? "채팅을 시작할 수 없습니다.");
      })
      .finally(() => {
        setChatLoading(false);
      });
  };

  return (
    <Page className="pb-28 pt-2">
      {detailLoading && (
        <p className="mb-4 text-center text-sm text-zinc-500">지원 정보를 불러오는 중...</p>
      )}
      {detailError && (
        <p className="mb-4 text-center text-sm text-red-600">{detailError}</p>
      )}
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
            <button
              type="button"
              onClick={handleChatClick}
              disabled={chatLoading || !applicationDetail?.partnerId}
              className="flex cursor-pointer items-center gap-1.5 text-sm font-medium text-zinc-700 hover:text-zinc-900 disabled:opacity-50"
            >
              채팅하기
              <img src={chaticonUrl} alt="" className="h-6 w-6 shrink-0" />
            </button>
          </div>
      {chatError && (
        <p className="mt-2 text-sm text-red-600">{chatError}</p>
      )}

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
          onClick={() =>
            navigate("/partner/supported/confirm", {
              state: {
                invitationId: invitationId ?? undefined,
                projectId: projectId ?? displayData.projectId ?? undefined,
                applicationId:
                  (applicationDetail?.applicationId && applicationDetail.applicationId > 0)
                    ? applicationDetail.applicationId
                    : (applicationId && applicationId > 0 ? applicationId : undefined),
                partnerId: applicationDetail?.partnerId,
                partnerData: partnerDataForConfirm,
                serviceSummary: displayData.serviceSummary,
                recruitRole: displayData.recruitRole,
              },
            })
          }
          className="w-full rounded-full bg-[#0060EF] py-4 text-base font-semibold text-white"
        >
          수락하기
        </button>
      </div>
    </Page>
  );
}
