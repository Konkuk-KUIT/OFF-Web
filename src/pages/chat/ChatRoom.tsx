import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PrevIcon from "../../assets/layouts/header/Prev.svg";

type Message = {
  id: string;
  text: string;
  isMine: boolean;
  time: string;
};

const MOCK_ROOM_TITLE: Record<string, string> = {
  "1": "KUIT 6th 디자이너",
  "2": "닉네임",
  "3": "닉네임",
  "4": "닉네임",
};

const MOCK_MESSAGES: Message[] = [
  { id: "1", text: "채팅을 입력하세요", isMine: true, time: "23:00" },
  { id: "2", text: "채팅을 입력하세요", isMine: true, time: "23:00" },
  { id: "3", text: "채팅을 입력하세요", isMine: false, time: "23:00" },
  {
    id: "4",
    text: "채팅을 입력하세요\n채팅을 입력하세요\n채팅을 입력하세요",
    isMine: false,
    time: "23:00",
  },
  {
    id: "5",
    text: "채팅을 입력하세요\n채팅을 입력하세요\n채팅을 입력하세요\n채팅을 입력하세요",
    isMine: false,
    time: "23:00",
  },
];

const roomTitleStyle: React.CSSProperties = {
  display: "flex",
  width: "173px",
  height: "25px",
  flexDirection: "column",
  justifyContent: "center",
  color: "var(--gray-gray_900, #121212)",
  textAlign: "center",
  fontFamily: "Inter, sans-serif",
  fontSize: "16px",
  fontStyle: "normal",
  fontWeight: 700,
  lineHeight: "24px",
  letterSpacing: "-0.16px",
};

const chatBubbleWrapStyle = (isMine: boolean): React.CSSProperties => ({
  display: "inline-flex",
  justifyContent: isMine ? "flex-end" : "flex-start",
  alignItems: "flex-end",
  gap: "8px",
});

const messageBubbleStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  maxWidth: "270px",
  minHeight: "40px",
  padding: "8px 20px",
  alignItems: "flex-start",
  gap: "8px",
  borderRadius: "4px",
  background: "var(--blue-background-card-coolgray, #F2F3F5)",
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

function MenuIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-zinc-900"
    >
      <path
        d="M4 6h16M4 12h16M4 18h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function ChatRoom() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");

  const roomTitle = id ? MOCK_ROOM_TITLE[id] ?? "채팅방" : "채팅방";

  const handleSend = () => {
    if (!inputValue.trim()) return;
    setInputValue("");
  };

  return (
    <div className="flex h-full min-h-[80vh] flex-col bg-white">
      {/* 헤더: 뒤로가기 | 제목 | 메뉴 */}
      <header className="fixed left-0 right-0 top-0 z-10 flex h-12 items-center justify-between border-b border-zinc-200 bg-white px-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex h-8 w-8 items-center justify-center"
          aria-label="뒤로가기"
        >
          <img src={PrevIcon} alt="" className="h-6 w-6" />
        </button>
        <h1
          className="absolute left-1/2 -translate-x-1/2"
          style={roomTitleStyle}
        >
          {roomTitle}
        </h1>
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center"
          aria-label="메뉴"
        >
          <MenuIcon />
        </button>
      </header>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 pt-14">
        <div className="mx-auto max-w-screen-sm space-y-3 py-4">
          {MOCK_MESSAGES.map((msg) => (
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
                      className="text-zinc-900"
                      style={{
                        ...messageBubbleStyle,
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
                      className="text-zinc-900"
                      style={{
                        ...messageBubbleStyle,
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
      </div>

      {/* 입력 영역 */}
      <div className="border-t border-zinc-200 bg-white p-4 pb-8">
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
            className="rounded-xl bg-zinc-800 px-5 py-3 text-sm font-medium text-white transition-opacity active:opacity-90"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            전송
          </button>
        </div>
      </div>
    </div>
  );
}
