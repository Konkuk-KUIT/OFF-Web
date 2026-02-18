import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Page from "../../components/Page";
import { getChatRooms } from "../../api/chat";
import type { ChatRoomResponse } from "../../api/chat";
import type { ChatItem, TabType } from "./types";

const NEW_MESSAGE_LABEL = "새로운 채팅 메세지";
const NEW_MESSAGE_TIME = "now";

const TAB_TO_TYPE: Record<TabType, "PROJECT" | "CONTACT"> = {
  project: "PROJECT",
  partner: "CONTACT",
};

function formatChatTime(dateStr?: string): string {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const h = String(d.getHours()).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");
    return `${y}.${m}.${day} ${h}:${min}`;
  } catch {
    return dateStr;
  }
}

function mapRoomToItem(room: ChatRoomResponse): ChatItem {
  const id = String(room.id ?? room.roomId ?? room.chatRoomId ?? "");
  const nickname =
    room.opponentResponse?.nickname ?? room.nickname ?? room.partnerNickname ?? "알 수 없음";
  const lastMessage =
    room.lastMessageInfo?.content ?? room.lastMessage ?? room.lastMessageContent ?? "";
  const rawTime = room.lastMessageInfo?.createdAt ?? room.lastMessageAt;
  const timestamp = rawTime ? formatChatTime(rawTime) : "";
  const unreadCount = room.unReadCount ?? room.unreadCount;
  const hasNew = (unreadCount ?? 0) > 0;
  const projectName = room.chatProjectInfo?.projectName ?? room.projectName;
  return {
    id,
    nickname,
    projectName: projectName ?? undefined,
    lastMessage: hasNew ? NEW_MESSAGE_LABEL : lastMessage,
    timestamp: hasNew ? NEW_MESSAGE_TIME : timestamp,
    unreadCount,
  };
}

const nicknameStyle: React.CSSProperties = {
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 1,
  overflow: "hidden",
  color: "var(--gray-gray_900, #121212)",
  textOverflow: "ellipsis",
  fontFamily: "Inter, sans-serif",
  fontSize: "14px",
  fontStyle: "normal",
  fontWeight: 700,
  lineHeight: "22px",
};

const projectNameStyle: React.CSSProperties = {
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 1,
  overflow: "hidden",
  color: "var(--gray-gray_400, #858585)",
  textOverflow: "ellipsis",
  fontFamily: "Inter, sans-serif",
  fontSize: "10px",
  fontStyle: "normal",
  fontWeight: 400,
  lineHeight: "22px",
};

const detailXsStyle: React.CSSProperties = {
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 1,
  overflow: "hidden",
  color: "var(--gray-gray_500, #666)",
  textOverflow: "ellipsis",
  fontFamily: "Inter, sans-serif",
  fontSize: "12px",
  fontStyle: "normal",
  fontWeight: 400,
  lineHeight: "18px",
};

const newMessageLabelStyle: React.CSSProperties = {
  ...detailXsStyle,
  color: "#dc2626",
  fontWeight: 600,
};

const cardStyle: React.CSSProperties = {
  display: "flex",
  width: "345px",
  maxWidth: "100%",
  paddingRight: "20px",
  paddingLeft: "20px",
  paddingTop: "16px",
  paddingBottom: "16px",
  alignItems: "center",
  borderRadius: "8px",
  background: "var(--blue-background-card-coolgray, #F2F3F5)",
};

function ChatListItem({ item }: { item: ChatItem }) {
  return (
    <Link
      to={`/chat/${item.id}`}
      className="transition-opacity active:opacity-90"
      style={cardStyle}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="min-w-0 flex-shrink" style={nicknameStyle}>
            {item.nickname}
          </span>
          {item.projectName && (
            <span className="shrink-0" style={projectNameStyle}>
              {item.projectName}
            </span>
          )}
        </div>
        <p className="mt-1" style={detailXsStyle}>
          {item.lastMessage}
        </p>
        <div className="mt-3 flex items-center justify-between gap-2">
          {item.unreadCount != null && item.unreadCount > 0 ? (
            <span style={newMessageLabelStyle}>
              {item.unreadCount === 1 ? "1 new message" : `${item.unreadCount} new messages`}
            </span>
          ) : (
            <span />
          )}
          <span style={detailXsStyle}>{item.timestamp}</span>
        </div>
      </div>
    </Link>
  );
}

/** 새 메시지가 왔을 때 목록에 보여줄 컴포넌트 (lastMessage: 새로운 채팅 메세지, timestamp: now, 1 new message 빨간색) */
function NewMessageChatItem({ item }: { item: ChatItem }) {
  return (
    <Link
      to={`/chat/${item.id}`}
      className="transition-opacity active:opacity-90"
      style={cardStyle}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="min-w-0 flex-shrink" style={nicknameStyle}>
            {item.nickname}
          </span>
          {item.projectName && (
            <span className="shrink-0" style={projectNameStyle}>
              {item.projectName}
            </span>
          )}
        </div>
        <p className="mt-1" style={detailXsStyle}>
          {NEW_MESSAGE_LABEL}
        </p>
        <div className="mt-3 flex items-center justify-between gap-2">
          {item.unreadCount != null && item.unreadCount > 0 ? (
            <span style={newMessageLabelStyle}>
              {item.unreadCount === 1 ? "1 new message" : `${item.unreadCount} new messages`}
            </span>
          ) : (
            <span />
          )}
          <span style={detailXsStyle}>{NEW_MESSAGE_TIME}</span>
        </div>
      </div>
    </Link>
  );
}

export default function ChatList() {
  const [activeTab, setActiveTab] = useState<TabType>("project");
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);
  const fetchingTabRef = useRef<TabType>(activeTab);

  const fetchRooms = useCallback((tab: TabType) => {
    const type = TAB_TO_TYPE[tab];
    fetchingTabRef.current = tab;
    setLoading(true);
    setError(null);
    getChatRooms(type)
      .then((res) => {
        if (fetchingTabRef.current !== tab) return;
        const rawList = res.data?.data?.chatRoomResponses ?? [];
        const sorted = [...rawList].sort((a, b) => {
          const tA = a.lastMessageInfo?.createdAt ?? a.lastMessageAt ?? "";
          const tB = b.lastMessageInfo?.createdAt ?? b.lastMessageAt ?? "";
          return tB.localeCompare(tA);
        });
        setChats(sorted.map(mapRoomToItem));
      })
      .catch((err) => {
        if (fetchingTabRef.current !== tab) return;
        const status = err?.response?.status;
        const message = err?.response?.data?.message;
        if (status === 500) {
          setError(
            message ??
              (tab === "partner"
                ? "파트너 컨택 목록을 불러오지 못했습니다. 서버 오류일 수 있어 잠시 후 다시 시도해 주세요."
                : "서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.")
          );
        } else {
          setError(message ?? "채팅방 목록을 불러오지 못했습니다.");
        }
        setChats([]);
      })
      .finally(() => {
        if (fetchingTabRef.current === tab) setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchRooms(activeTab);
  }, [activeTab, fetchRooms, retryKey]);

  const handleRetry = () => {
    setError(null);
    setRetryKey((k) => k + 1);
  };

  const tabButtonClass =
    "flex min-w-[74px] h-[28px] py-1 px-2.5 justify-center items-center gap-2.5 rounded-[4px] border-none cursor-pointer transition-colors";
  const tabTextClass =
    "font-bold text-[12px] leading-[18px] text-[#121212] whitespace-nowrap";
  const tabActiveBg = { background: "rgba(0, 96, 239, 0.50)" };
  const tabInactiveBg = { background: "rgba(0, 0, 0, 0.06)" };

  return (
    <Page className="flex flex-col items-center space-y-4">
      <div className="flex justify-center gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("project")}
          className={tabButtonClass}
          style={activeTab === "project" ? tabActiveBg : tabInactiveBg}
        >
          <span className={tabTextClass} style={{ fontFamily: "Inter, sans-serif" }}>
            프로젝트
          </span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("partner")}
          className={tabButtonClass}
          style={activeTab === "partner" ? tabActiveBg : tabInactiveBg}
        >
          <span className={tabTextClass} style={{ fontFamily: "Inter, sans-serif" }}>
            파트너 컨택
          </span>
        </button>
      </div>

      {loading && (
        <div className="flex w-full justify-center py-8 text-zinc-500">로딩 중...</div>
      )}
      {error && !loading && (
        <div className="w-full rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <p>{error}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleRetry}
              className="rounded-lg bg-red-100 px-3 py-1.5 text-sm font-medium text-red-800 transition-opacity hover:bg-red-200 active:opacity-90"
            >
              다시 시도
            </button>
            {activeTab === "partner" && (
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setActiveTab("project");
                }}
                className="rounded-lg bg-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-800 transition-opacity hover:bg-zinc-300 active:opacity-90"
              >
                프로젝트 탭 보기
              </button>
            )}
          </div>
        </div>
      )}
      {!loading && !error && chats.length > 0 && (
        <ul className="flex w-full flex-col items-center gap-3">
          {chats.map((item, index) => (
            <li key={item.id ? String(item.id) : `room-${index}`} className="flex w-full justify-center">
              {item.timestamp === NEW_MESSAGE_TIME ? (
                <NewMessageChatItem item={item} />
              ) : (
                <ChatListItem item={item} />
              )}
            </li>
          ))}
        </ul>
      )}
      {!loading && !error && chats.length === 0 && (
        <p className="w-full py-8 text-center text-zinc-500">채팅방이 없습니다.</p>
      )}
    </Page>
  );
}
