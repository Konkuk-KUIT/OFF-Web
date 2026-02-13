import React from "react";

export function Screen({ children }: { children: React.ReactNode }) {
  // 피그마: 전체 배경은 흰색 + 섹션 카드들은 연회색
  return (
    <div className="min-h-dvh bg-white">
      <div className="mx-auto w-full max-w-[420px] px-4 pb-28 pt-3">{children}</div>
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
      <h2 className="text-[18px] font-extrabold text-black">{left}</h2>
      {right ? <div className="text-[12px] text-black/60">{right}</div> : null}
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
      <h3 className="text-[18px] font-extrabold text-black">{left}</h3>
      {right ? <div>{right}</div> : null}
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
      className="h-7 rounded-full bg-[#F2F3F5] px-3 text-[12px] font-semibold text-black/70"
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
      className="h-7 rounded-full bg-[#FF3B30] px-4 text-[12px] font-bold text-white"
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
        "inline-flex h-7 items-center rounded-md px-3 text-[12px] font-bold",
        active ? "bg-[#0B5CFF] text-white" : "bg-[#E9EEF7] text-black/70",
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
      ? "bg-[#0B5CFF] text-white" // 피그마 종료확인도 파란 버튼
      : "bg-[#0B5CFF] text-white";

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 bg-white">
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
  // 피그마의 TASK 카드/회색 박스
  return (
    <div className="rounded-2xl bg-[#F2F3F5] px-4 py-4">{children}</div>
  );
}

export function DarkHeroCard({ children }: { children: React.ReactNode }) {
  // 상단 검정 카드 (그라데이션)
  return (
    <div className="overflow-hidden rounded-2xl bg-gradient-to-b from-[#0B0B0C] to-[#242426] text-white">
      {children}
    </div>
  );
}

export function HeroDivider() {
  return <div className="h-px bg-white/10" />;
}

export function SliderBar({ percent }: { percent: number }) {
  // 피그마: 회색 선 + 파란 진행 + 흰 원형 노브
  const p = Math.max(0, Math.min(100, percent));
  return (
    <div className="relative mt-3 h-2 w-full rounded-full bg-white/25">
      <div className="h-2 rounded-full bg-[#0B5CFF]" style={{ width: `${p}%` }} />
      <div
        className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-white shadow"
        style={{ left: `calc(${p}% - 8px)` }}
      />
    </div>
  );
}

export function TaskTag({ text }: { text: string }) {
  return (
    <span className="inline-flex h-7 items-center rounded-md bg-black px-3 text-[12px] font-bold text-white">
      {text}
    </span>
  );
}

export function RightArrow() {
  return <span className="text-black/40">&gt;</span>;
}
