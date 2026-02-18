import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Page from "../../components/Page";
import PartnerPortfolioCard from "./PartnerPortfolioCard";
import { getPartnerProfile, getRoleLabel } from "../../api/partner";
import { getMyProjects, type ProjectItem } from "../../api/member";
import { invitePartner } from "../../api/project";
import { getChatRooms, sendFirstMessage } from "../../api/chat";

const chaticonUrl = new URL("../../assets/chaticon.svg", import.meta.url).href;

const PROJECT_COUNT_LABEL: Record<string, string> = {
  ZERO: "0회",
  ONCE: "1회",
  TWICE: "2회",
  THREE_TIMES: "3회",
  FOUR_TIMES: "4회",
  PLUS_FIVE: "5회 이상",
};

function getProjectCountLabel(value: string): string {
  return PROJECT_COUNT_LABEL[value] ?? value;
}

export default function PartnerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showRequestToast, setShowRequestToast] = useState(false);
  const [profile, setProfile] = useState<Awaited<ReturnType<typeof getPartnerProfile>> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showProjectPicker, setShowProjectPicker] = useState(false);
  const [myProjects, setMyProjects] = useState<ProjectItem[]>([]);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [showFirstMessageModal, setShowFirstMessageModal] = useState(false);
  const [firstMessageInput, setFirstMessageInput] = useState("");

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    const partnerId = Number(id);
    if (Number.isNaN(partnerId)) {
      setError("잘못된 파트너 ID입니다.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    getPartnerProfile(partnerId)
      .then((data) => {
        setProfile(data);
      })
      .catch((err: unknown) => {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
        setError(msg ?? "파트너 정보를 불러오지 못했습니다.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleRequestClick = () => {
    setInviteError(null);
    getMyProjects()
      .then((res) => {
        const list = res.projectList ?? [];
        if (list.length === 0) {
          setInviteError("참여 중인 프로젝트가 없습니다. 프로젝트를 먼저 생성해주세요.");
          return;
        }
        setMyProjects(list);
        setShowProjectPicker(true);
      })
      .catch((err: unknown) => {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
        setInviteError(msg ?? "프로젝트 목록을 불러오지 못했습니다.");
      });
  };

  /** 채팅하기: 1) GET /chat/rooms(CONTACT) 2) 방 있으면 바로 이동, 없으면 첫 메시지 입력 모달 → 전송 시 POST /chat/rooms/first */
  const handleChatClick = () => {
    if (!profile) return;
    setChatError(null);
    setChatLoading(true);
    getChatRooms("CONTACT")
      .then((res) => {
        const rooms = res.data?.data?.chatRoomResponses ?? [];
        const existing = rooms.find(
          (r: { chatRoomId?: number; roomId?: number; partnerId?: number; partnerNickname?: string }) =>
            r.partnerId === profile!.memberId || r.partnerNickname === profile!.nickname
        );
        const roomId = existing ? (existing.chatRoomId ?? existing.roomId) : null;
        if (roomId != null) {
          navigate(`/chat/${Number(roomId)}`);
          return;
        }
        setFirstMessageInput("");
        setShowFirstMessageModal(true);
      })
      .catch((err: unknown) => {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
        setChatError(msg ?? "채팅을 시작할 수 없습니다.");
      })
      .finally(() => setChatLoading(false));
  };

  const handleFirstMessageSubmit = () => {
    if (!profile) return;
    const content = firstMessageInput.trim();
    if (!content) {
      setChatError("첫 메시지를 입력해 주세요.");
      return;
    }
    setChatError(null);
    setChatLoading(true);
    console.log("[POST /chat/rooms/first] 파트너 id (opponentId):", profile.memberId);
    sendFirstMessage({ opponentId: profile.memberId, content })
      .then((res) => {
        const chatRoomId = res.data?.data?.chatRoomId;
        if (chatRoomId != null) {
          setShowFirstMessageModal(false);
          setFirstMessageInput("");
          navigate(`/chat/${Number(chatRoomId)}`);
        } else {
          setChatError("채팅방을 열 수 없습니다.");
        }
      })
      .catch((err: unknown) => {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
        setChatError(msg ?? "채팅을 시작할 수 없습니다.");
      })
      .finally(() => setChatLoading(false));
  };

  const handleSelectProject = (project: ProjectItem) => {
    if (!profile) return;
    setInviteError(null);
    setInviteLoading(true);
    invitePartner(project.id, {
      partnerId: profile.memberId,
      role: profile.role,
    })
      .then(() => {
        setShowProjectPicker(false);
        setShowRequestToast(true);
        setTimeout(() => {
          setShowRequestToast(false);
          navigate("/home");
        }, 2500);
      })
      .catch((err: unknown) => {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
        setInviteError(msg ?? "파트너 제안에 실패했습니다.");
      })
      .finally(() => {
        setInviteLoading(false);
      });
  };

  if (loading) {
    return (
      <Page className="pb-28 pt-2">
        <div className="flex justify-center py-12 text-zinc-500">로딩 중...</div>
      </Page>
    );
  }

  if (error || !profile) {
    return (
      <Page className="pb-28 pt-2">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
          {error ?? "파트너를 찾을 수 없습니다."}
        </div>
      </Page>
    );
  }

  return (
    <Page className="pb-28 pt-2">
      {showRequestToast && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
          <div className="flex h-[50px] w-[304px] items-center justify-center rounded-[50px] bg-[#9B9B9B] text-center text-white">
            요청이 완료되었습니다.
          </div>
        </div>
      )}

      {showProjectPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-4 shadow-lg">
            <h3 className="text-lg font-bold text-zinc-900">프로젝트 선택</h3>
            <p className="mt-1 text-sm text-zinc-600">
              파트너를 어떤 프로젝트에 초대할까요?
            </p>
            {inviteError && (
              <p className="mt-2 text-sm text-red-600">{inviteError}</p>
            )}
            <ul className="mt-4 max-h-60 space-y-2 overflow-y-auto">
              {myProjects.map((project) => (
                <li key={project.id}>
                  <button
                    type="button"
                    disabled={inviteLoading}
                    onClick={() => handleSelectProject(project)}
                    className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-left text-sm font-medium text-zinc-900 hover:bg-zinc-100 disabled:opacity-50"
                  >
                    {project.name}
                  </button>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => {
                setShowProjectPicker(false);
                setInviteError(null);
              }}
              className="mt-4 w-full rounded-full border border-zinc-300 py-3 text-sm font-medium text-zinc-700"
            >
              취소
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {/* 파트너 요약 카드 */}
        <section className="rounded-2xl bg-zinc-100 p-4">
          <div className="flex items-center gap-3">
            {profile.profileImage && (
              <img
                src={profile.profileImage}
                alt=""
                className="h-14 w-14 shrink-0 rounded-full object-cover"
              />
            )}
            <div>
              <h2 className="text-lg font-bold text-zinc-900">
                {profile.nickname} · {getRoleLabel(profile.role)}
              </h2>
              {profile.name && (
                <p className="mt-0.5 text-sm text-zinc-600">{profile.name}</p>
              )}
            </div>
          </div>
          <div className="mt-3 flex justify-between text-sm">
            <span className="text-zinc-600">프로젝트 경험</span>
            <span className="font-medium text-zinc-900">
              {getProjectCountLabel(profile.projectCount)}
            </span>
          </div>
          {profile.isWorking !== undefined && (
            <div className="mt-1 flex justify-between text-sm">
              <span className="text-zinc-600">활동 여부</span>
              <span className="font-medium text-zinc-900">
                {profile.isWorking ? "활동 중" : "비활동"}
              </span>
            </div>
          )}
        </section>

        {/* 파트너 소개 카드 */}
        <section className="rounded-2xl bg-zinc-100 p-4">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-800">
            {profile.selfIntroduction || "소개가 없습니다."}
          </p>
        </section>

        {/* 파트너의 포트폴리오 */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-zinc-900">파트너의 포트폴리오</h3>
            <button
              type="button"
              onClick={handleChatClick}
              disabled={chatLoading}
              className="flex cursor-pointer items-center gap-1.5 text-sm font-medium text-zinc-700 hover:text-zinc-900 disabled:opacity-50"
            >
              채팅하기
              <img src={chaticonUrl} alt="" className="h-6 w-6 shrink-0" />
            </button>
          </div>
          {chatError && (
            <p className="text-sm text-red-600">{chatError}</p>
          )}

          {profile.portfolios && profile.portfolios.length > 0 ? (
            <ul className="space-y-3">
              {profile.portfolios.map((item, i) => (
                <li key={i}>
                  <PartnerPortfolioCard
                    title={item.description ? item.description.slice(0, 30) + (item.description.length > 30 ? "…" : "") : "포트폴리오 " + (i + 1)}
                    linkLabel="링크 보기"
                    description={item.description || ""}
                    link={item.link || undefined}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-4 text-center text-sm text-zinc-500">등록된 포트폴리오가 없습니다.</p>
          )}
        </section>
      </div>

      {/* 요청하기 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 z-10 mx-auto w-full max-w-screen-sm border-t border-zinc-100 bg-white px-4 pb-8 pt-4">
        {inviteError && !showProjectPicker && (
          <p className="mb-2 text-center text-sm text-red-600">{inviteError}</p>
        )}
        <button
          type="button"
          onClick={handleRequestClick}
          disabled={inviteLoading}
          className="w-full rounded-full bg-[#0060EF] py-4 text-base font-semibold text-white disabled:opacity-50"
        >
          요청하기
        </button>
      </div>

      {/* 첫 메시지 입력 모달: 방 없을 때만 표시, 전송 시 POST /chat/rooms/first */}
      {showFirstMessageModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-4 sm:items-center">
          <div className="w-full max-w-md rounded-2xl bg-white p-4 shadow-lg">
            <h3 className="text-lg font-bold text-zinc-900">첫 메시지를 입력하세요</h3>
            <textarea
              value={firstMessageInput}
              onChange={(e) => setFirstMessageInput(e.target.value)}
              placeholder="안녕하세요, 백엔드 포지션 지원하고 싶습니다!"
              rows={3}
              className="mt-3 w-full resize-none rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-800 placeholder:text-zinc-400 focus:border-[#0060EF] focus:outline-none"
            />
            {chatError && <p className="mt-2 text-sm text-red-600">{chatError}</p>}
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowFirstMessageModal(false);
                  setFirstMessageInput("");
                  setChatError(null);
                }}
                className="flex-1 rounded-full border border-zinc-300 py-3 text-sm font-medium text-zinc-700"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleFirstMessageSubmit}
                disabled={chatLoading || !firstMessageInput.trim()}
                className="flex-1 rounded-full bg-[#0060EF] py-3 text-sm font-medium text-white disabled:opacity-50"
              >
                {chatLoading ? "전송 중..." : "전송"}
              </button>
            </div>
          </div>
        </div>
      )}
    </Page>
  );
}
