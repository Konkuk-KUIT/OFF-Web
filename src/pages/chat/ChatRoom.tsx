import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getRoomMessages,
  sendMessage as sendMessageApi,
} from "../../api/chat";

type Message = {
  id: string;
  text: string;
  isMine: boolean;
  time: string;
};

function formatMessageTime(createdAt: string): string {
  try {
    const d = new Date(createdAt);
    if (Number.isNaN(d.getTime())) return "";
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  } catch {
    return "";
  }
}

const chatBubbleWrapStyle = (isMine: boolean): React.CSSProperties => ({
  display: "inline-flex",
  justifyContent: isMine ? "flex-end" : "flex-start",
  alignItems: "flex-end",
  gap: "8px",
});

const messageBubbleStyleBase: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  maxWidth: "270px",
  minHeight: "40px",
  padding: "8px 20px",
  alignItems: "flex-start",
  gap: "8px",
  borderRadius: "4px",
};
const opponentBubbleStyle: React.CSSProperties = {
  ...messageBubbleStyleBase,
  background: "var(--blue-background-card-coolgray, #F2F3F5)",
};
const myBubbleStyle: React.CSSProperties = {
  ...messageBubbleStyleBase,
  background: "rgba(0, 96, 239, 0.15)",
  color: "#121212",
};

const timestampStyle: React.CSSProperties = {
  color: "var(--gray-gray_300, #999)",
  fontFamily: "Inter, sans-serif",
  fontSize: "12px",
  fontStyle: "normal",
  fontWeight: 400,
  lineHeight: "18px",
};

const inputStyle: React.CSSProperties = {
  color: "var(--gray-gray_500, #666)",
  fontFamily: "Inter, sans-serif",
  fontSize: "14px",
  fontStyle: "normal",
  fontWeight: 400,
  lineHeight: "22px",
};

const chatInputBoxStyle: React.CSSProperties = {
  display: "flex",
  width: "263px",
  height: "50px",
  padding: "8px 20px",
  alignItems: "center",
  gap: "8px",
  borderRadius: "8px",
  background: "var(--blue-background-card-coolgray, #F2F3F5)",
};

function toMessage(item: {
  id: number;
  content: string;
  createdAt: string;
  mine?: boolean;
  isMine?: boolean;
}): Message {
  const isMine = item.mine ?? item.isMine ?? false;
  return {
    id: String(item.id),
    text: item.content ?? "",
    isMine,
    time: formatMessageTime(item.createdAt ?? ""),
  };
}

export default function ChatRoom() {
  const { id: roomIdParam } = useParams<{ id: string }>();
  const roomId = roomIdParam ? Number(roomIdParam) : NaN;
  const [messages, setMessages] = useState<Message[]>([]);
  const [hasNext, setHasNext] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);

  useEffect(() => {
    if (Number.isNaN(roomId)) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setLoadError(null);
    getRoomMessages(roomId, { size: 20 })
      .then((res) => {
        const data = res.data?.data;
        const list = data?.chatMessageResponses ?? data?.messageResponses ?? data?.messages ?? [];
        const mapped = list.map(toMessage);
        setMessages(mapped.reverse());
        setHasNext(data?.hasNext ?? false);
      })
      .catch((err) => {
        setLoadError(err?.response?.data?.message ?? "메시지를 불러오지 못했습니다.");
        setMessages([]);
        setHasNext(false);
      })
      .finally(() => setLoading(false));
  }, [roomId]);

  const loadMoreOlder = () => {
    if (loadingMore || !hasNext || messages.length === 0) return;
    // 현재 목록에서 가장 오래된 메시지 id를 커서로 사용 (API가 최신순이면 마지막 요소)
    const oldestInList = messages[messages.length - 1];
    const cursorId = Number(oldestInList.id);
    if (Number.isNaN(cursorId)) return;
    setLoadingMore(true);
    getRoomMessages(roomId, { cursor: cursorId, size: 20 })
      .then((res) => {
        const data = res.data?.data;
        const list = data?.chatMessageResponses ?? data?.messageResponses ?? data?.messages ?? [];
        const older = list.map(toMessage).reverse();
        setMessages((prev) => [...older, ...prev]);
        setHasNext(data?.hasNext ?? false);
      })
      .finally(() => setLoadingMore(false));
  };

  const handleSend = () => {
    const content = inputValue.trim();
    if (!content || Number.isNaN(roomId) || sending) return;
    setInputValue("");
    setSendError(null);
    setSending(true);
    sendMessageApi({ roomId, content })
      .then((res) => {
        const d = res.data.data;
        setMessages((prev) => [
          ...prev,
          {
            id: String(d.id),
            text: d.content,
            isMine: d.mine,
            time: formatMessageTime(d.createdAt),
          },
        ]);
      })
      .catch((err) => {
        setInputValue(content);
        const status = err?.response?.status;
        const message = err?.response?.data?.message;
        if (status === 404) {
          setSendError(message ?? "상대방을 찾을 수 없습니다.");
        } else if (status === 400) {
          setSendError(message ?? "유효하지 않은 요청입니다.");
        } else {
          setSendError(message ?? "메시지 전송에 실패했습니다.");
        }
      })
      .finally(() => setSending(false));
  };

  if (Number.isNaN(roomId)) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center p-4 text-zinc-500">
        유효하지 않은 채팅방입니다.
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-[80vh] flex-col bg-white">
      <div className="flex-1 overflow-y-auto px-4 pb-4 pt-4">
        {loading && (
          <div className="flex justify-center py-8 text-zinc-500">로딩 중...</div>
        )}
        {loadError && !loading && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {loadError}
          </div>
        )}
        {!loading && !loadError && (
          <div className="mx-auto max-w-screen-sm space-y-3 py-4">
            {hasNext && (
              <div className="flex justify-center py-2">
                <button
                  type="button"
                  onClick={loadMoreOlder}
                  disabled={loadingMore}
                  className="text-sm text-zinc-500 underline disabled:opacity-50"
                >
                  {loadingMore ? "불러오는 중..." : "이전 메시지 더 보기"}
                </button>
              </div>
            )}
            {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.isMine ? "items-end" : "items-start"}`}
            >
              <div
                className="max-w-[80%]"
                style={chatBubbleWrapStyle(msg.isMine)}
              >
                {msg.isMine ? (
                  <>
                    <span style={timestampStyle}>{msg.time}</span>
                    <div
                      style={{
                        ...myBubbleStyle,
                        fontFamily: "Inter, sans-serif",
                        fontSize: "14px",
                      }}
                    >
                      {msg.text.split("\n").map((line, i) => (
                        <p key={i}>{line}</p>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      style={{
                        ...opponentBubbleStyle,
                        fontFamily: "Inter, sans-serif",
                        fontSize: "14px",
                      }}
                    >
                      {msg.text.split("\n").map((line, i) => (
                        <p key={i}>{line}</p>
                      ))}
                    </div>
                    <span style={timestampStyle}>{msg.time}</span>
                  </>
                )}
              </div>
            </div>
          ))}
          </div>
        )}
      </div>

      {/* 입력 영역 */}
      <div className="border-t border-zinc-200 bg-white p-4 pb-8">
        {sendError && (
          <p className="mx-auto mb-2 max-w-screen-sm text-center text-sm text-red-600">
            {sendError}
          </p>
        )}
        <div className="mx-auto flex max-w-screen-sm justify-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="채팅을 입력하세요"
            className="placeholder:text-[#666] focus:outline-none focus:ring-2 focus:ring-[#0060EF]/30"
            style={{ ...chatInputBoxStyle, ...inputStyle }}
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={sending || !inputValue.trim() || Number.isNaN(roomId)}
            className="rounded-xl bg-zinc-800 px-5 py-3 text-sm font-medium text-white transition-opacity active:opacity-90 disabled:opacity-50"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            {sending ? "전송 중..." : "전송"}
          </button>
        </div>
      </div>
    </div>
  );
}
