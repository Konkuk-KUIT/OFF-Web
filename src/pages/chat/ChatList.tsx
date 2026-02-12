import { useState } from "react";
import { Link } from "react-router-dom";
import Page from "../../components/Page";
import type { ChatItem, TabType } from "./types";

/** 새 메시지가 왔을 때 표시할 항목 (lastMessage: 새로운 채팅 메세지, timestamp: now) */
const NEW_MESSAGE_LABEL = "새로운 채팅 메세지";
const NEW_MESSAGE_TIME = "now";

const MOCK_CHATS: ChatItem[] = [
  {
    id: "1",
    nickname: "닉네임",
    projectName: "프로젝트명",
    lastMessage: NEW_MESSAGE_LABEL,
    timestamp: NEW_MESSAGE_TIME,
    unreadCount: 3,
  },
  {
    id: "2",
    nickname: "닉네임",
    lastMessage: "마지막 채팅 내용",
    timestamp: "2026.00.00 00:00",
  },
  {
    id: "3",
    nickname: "닉네임",
    lastMessage: "마지막 채팅 내용",
    timestamp: "2026.00.00 00:00",
  },
  {
    id: "4",
    nickname: "닉네임",
    lastMessage: "마지막 채팅 내용",
    timestamp: "2026.00.00 00:00",
  },
];

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
            <span style={detailXsStyle}>
              {item.unreadCount} new messages
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

/** 새 메시지가 왔을 때 목록에 보여줄 컴포넌트 (lastMessage: 새로운 채팅 메세지, timestamp: now) */
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
            <span style={detailXsStyle}>
              {item.unreadCount} new messages
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
          <span
            className={tabTextClass}
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            프로젝트
          </span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("partner")}
          className={tabButtonClass}
          style={activeTab === "partner" ? tabActiveBg : tabInactiveBg}
        >
          <span
            className={tabTextClass}
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            파트너 컨택
          </span>
        </button>
      </div>

      <ul className="flex w-full flex-col items-center gap-3">
        {MOCK_CHATS.map((item) => (
          <li key={item.id} className="flex w-full justify-center">
            {item.timestamp === NEW_MESSAGE_TIME ? (
              <NewMessageChatItem item={item} />
            ) : (
              <ChatListItem item={item} />
            )}
          </li>
        ))}
      </ul>
    </Page>
  );
}
