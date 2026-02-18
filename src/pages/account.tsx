import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Page from "../components/Page";
import { confirmPayment, getPaymentClientKey } from "../api/payment";

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

export type AccountPaymentState = {
  applicationId?: number;
  orderId?: string;
  amount?: number;
  redirectUrl?: string;
};

export default function Account() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state as AccountPaymentState | null) ?? {};
  const { orderId, amount = 0, redirectUrl } = state;

  const [paymentMethod, setPaymentMethod] = useState<string>("toss");
  const [selectedBank, setSelectedBank] = useState<string>("하나");
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** 결제하기: client-key API로 paymentKey 받은 뒤 confirm 호출 → 성공 시 홈으로 */
  const handlePayment = async () => {
    setError(null);
    if (redirectUrl) {
      setPaying(true);
      window.location.href = redirectUrl;
      return;
    }
    if (!orderId || amount <= 0) {
      setError("결제 정보가 없습니다. 파트너 매칭 완료 후 다시 시도해 주세요.");
      return;
    }
    setPaying(true);
    try {
      const paymentKey = await getPaymentClientKey();
      await confirmPayment({ orderId, paymentKey, amount });
      navigate("/home", { replace: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : "결제에 실패했습니다.");
      setPaying(false);
    }
  };

  const formatAmount = (n: number) => `${n.toLocaleString()}원`;

  return (
    <Page className="space-y-6 pb-28">
      {/* 결제 금액 (prepare에서 넘어온 경우) */}
      {amount > 0 && (
        <section className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-zinc-700">결제 비용</span>
            <span className="text-lg font-bold text-zinc-900">{formatAmount(amount)}</span>
          </div>
        </section>
      )}

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

      {error && (
        <p className="text-center text-sm text-red-600">{error}</p>
      )}

      {/* 결제하기 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 mx-auto max-w-screen-sm px-4 pb-6 pt-4 bg-white">
        <button
          type="button"
          onClick={handlePayment}
          disabled={paying || (amount <= 0 && !orderId)}
          className="flex h-12 w-full items-center justify-center rounded-xl bg-[#0060EF] text-base font-semibold text-white disabled:opacity-50"
        >
          {paying ? "결제 진행 중..." : "결제하기"}
        </button>
      </div>
    </Page>
  );
}
