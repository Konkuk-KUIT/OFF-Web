import { useState } from "react";
import Page from "../components/Page";

const PAYMENT_METHODS = [
  { id: "account", label: "계좌이체" },
  { id: "deposit", label: "무통장입금" },
  { id: "mobile", label: "휴대폰" },
  { id: "toss", label: "토스페이" },
  { id: "naver", label: "네이버페이" },
  { id: "kakao", label: "카카오페이" },
] as const;

const BANKS = [
  "하나",
  "신한",
  "삼성",
  "카카오뱅크",
  "현대",
  "농협",
  "국민",
  "우리",
] as const;

const btnBase =
  "rounded-lg border border-zinc-200 bg-zinc-100 px-4 py-3 text-sm font-medium text-zinc-900 transition-colors";
const btnSelected =
  "border-zinc-300 bg-zinc-200 font-semibold text-zinc-900";

export default function Account() {
  const [paymentMethod, setPaymentMethod] = useState<string>("account");
  const [selectedBank, setSelectedBank] = useState<string>("하나");

  return (
    <Page className="space-y-6 pb-28">
      {/* 결제 방법 */}
      <section className="space-y-3">
        <h2 className="text-base font-bold text-zinc-900">결제 방법</h2>
        <div className="flex rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900">
          <span className="flex-1">신용·체크카드</span>
          <span className="text-zinc-400">▼</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {PAYMENT_METHODS.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setPaymentMethod(m.id)}
              className={`${btnBase} ${paymentMethod === m.id ? btnSelected : ""}`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </section>

      {/* 은행 선택 */}
      <section className="space-y-3">
        <div className="grid grid-cols-4 gap-2">
          {BANKS.map((bank) => (
            <button
              key={bank}
              type="button"
              onClick={() => setSelectedBank(bank)}
              className={`${btnBase} ${selectedBank === bank ? btnSelected : ""}`}
            >
              {bank}
            </button>
          ))}
        </div>
      </section>

      {/* 결제 유형 */}
      <section>
        <div className="flex rounded-lg border border-zinc-200 bg-zinc-100 px-4 py-3 text-zinc-900">
          <span className="flex-1">일시불</span>
          <span className="text-zinc-400">▼</span>
        </div>
      </section>

      {/* 결제하기 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 mx-auto max-w-screen-sm px-4 pb-6 pt-4 bg-white">
        <button
          type="button"
          className="flex h-12 w-full items-center justify-center rounded-xl bg-[#0060EF] text-base font-semibold text-white"
        >
          결제하기
        </button>
      </div>
    </Page>
  );
}
