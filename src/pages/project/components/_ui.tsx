import React from "react";

export function Screen({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-white">
      <div className="mx-auto w-full max-w-[420px] px-4 pb-28 pt-3">
        {children}
      </div>
    </div>
  );
}

export function SectionTitle({
  left,
  right,
}: {
  left: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <div className="mt-4 flex items-center justify-between">
      <h2 className="text-[22px] font-extrabold text-black">{left}</h2>
      {right ? <div>{right}</div> : null}
    </div>
  );
}

export function SubTitle({
  left,
  right,
}: {
  left: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <div className="mt-6 flex items-center justify-between">
      <h3 className="text-[20px] font-extrabold text-black">{left}</h3>
      {right ? <div className="flex items-center gap-3">{right}</div> : null}
    </div>
  );
}

export function GhostChip({
  label,
  onClick,
}: {
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "h-8 rounded-full px-4",
        "bg-[#F2F3F5]",
        "text-[13px] font-semibold text-black/70",
        "border border-black/5 shadow-sm",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

export function DangerPill({
  label,
  onClick,
}: {
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-8 rounded-full bg-[#FF3B30] px-4 text-[13px] font-bold text-white shadow-sm"
    >
      {label}
    </button>
  );
}

export function BlueChip({
  label,
  active = true,
}: {
  label: string;
  active?: boolean;
}) {
  return (
    <span
      className={[
        "inline-flex h-8 items-center rounded-md px-4",
        "text-[13px] font-extrabold",
        active ? "bg-[#0B5CFF] text-white" : "bg-[#E9EEF7] text-black/70",
        "shadow-[0_6px_14px_rgba(11,92,255,0.18)]",
      ].join(" ")}
    >
      {label}
    </span>
  );
}

export function BottomCTA({
  label,
  onClick,
  variant = "blue",
}: {
  label: string;
  onClick?: () => void;
  variant?: "blue" | "danger";
}) {
  const cls =
    variant === "danger"
      ? "bg-[#0B5CFF] text-white"
      : "bg-[#0B5CFF] text-white";

  return (
    <div className="fixed inset-x-0 bottom-[8%] z-30 bg-white">
      <div className="mx-auto w-full max-w-[420px] px-4 pb-6 pt-3">
        <button
          type="button"
          onClick={onClick}
          className={[
            "h-14 w-full rounded-full text-[16px] font-extrabold",
            cls,
            "shadow-[0_10px_22px_rgba(11,92,255,0.25)]",
          ].join(" ")}
        >
          {label}
        </button>
      </div>
    </div>
  );
}

export function LightCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-[#F2F3F5] px-5 py-5 shadow-[0_1px_0_rgba(0,0,0,0.06)]">
      {children}
    </div>
  );
}

export function DarkHeroCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-gradient-to-b from-[#0B0B0C] to-[#242426] text-white shadow-[0_14px_40px_rgba(0,0,0,0.18)]">
      {children}
    </div>
  );
}

export function SliderBar({ percent }: { percent: number }) {
  const p = Math.max(0, Math.min(100, percent));
  return (
    <div className="relative mt-3 h-[10px] w-full rounded-full bg-white/25">
      {/* 사진 느낌: 파란 진행보다 “밝은 트랙 + 흰 노브”가 핵심 */}
      <div
        className="h-[10px] rounded-full bg-white/35"
        style={{ width: `${p}%` }}
      />
      <div
        className="absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-white shadow-[0_10px_18px_rgba(0,0,0,0.25)]"
        style={{ left: `calc(${p}% - 10px)` }}
      />
    </div>
  );
}

export function TaskTag({ text }: { text: string }) {
  return (
    <span className="inline-flex h-9 min-w-[74px] items-center justify-center rounded-xl bg-black px-4 text-[13px] font-extrabold text-white">
      {text}
    </span>
  );
}

/** 색을 고정하지 말고, 부모의 text 색을 그대로 쓰게 */
export function RightArrow() {
  return <span className="leading-none">&gt;</span>;
}

export function ChatBubbleIcon({
  className = "h-[18px] w-[18px]",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
    </svg>
  );
}
