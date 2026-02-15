import { useState } from "react";

type Message = {
  id: string;
  text: string;
  isMine: boolean;
  time: string;
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

export default function ChatRoom() {
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (!inputValue.trim()) return;
    setInputValue("");
  };

  return (
    <div className="flex h-full min-h-[80vh] flex-col bg-white">
      {/* 메시지 영역 (앱 뒤로가기 헤더 사용) */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 pt-4">
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
