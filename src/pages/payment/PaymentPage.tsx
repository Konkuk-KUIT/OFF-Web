import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Page from "../../components/Page";
import { getPaymentClientKey, preparePayment } from "../../api/payment";
import { loadTossPayments, ANONYMOUS } from "@tosspayments/tosspayments-sdk";

/** Step 1: 마운트에 clientKey 조회. Step 2: 결제하기 클릭 시 prepare → loadTossPayments → requestPayment */
export default function PaymentPage() {
  const location = useLocation();
  const applicationId = (location.state as { applicationId?: number } | null)?.applicationId ?? null;
  const [clientKey, setClientKey] = useState("");
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1: clientKey 받아오기
  useEffect(() => {
    if (applicationId == null || applicationId <= 0) {
      setError("결제 정보가 없습니다. 파트너 매칭 완료 후 다시 시도해 주세요.");
      setReady(false);
      return;
    }
    const fetchClientKey = async () => {
      try {
        const key = await getPaymentClientKey();
        setClientKey(key);
        setReady(true);
        setError(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : "클라이언트 키 조회에 실패했습니다.");
      }
    };
    fetchClientKey();
  }, [applicationId]);

  // Step 2: 결제하기 버튼 클릭 시
  const handlePayment = async () => {
    if (!clientKey || applicationId == null || applicationId <= 0) return;
    setError(null);
    try {
      // 2-1. prepare 호출 (orderId, amount, orderName 받기)
      const data = await preparePayment({ applicationId });
      const orderId = data.orderId;
      const amount = data.amount;
      const orderName = data.orderName?.trim() || "OFF 파트너 매칭 결제";

      if (!orderId || amount == null || amount <= 0) {
        setError("결제 준비 응답이 올바르지 않습니다.");
        return;
      }

      const tossPayments = await loadTossPayments(clientKey);
      const payment = tossPayments.payment({ customerKey: ANONYMOUS });
      await payment.requestPayment({
        method: "CARD",
        amount: { currency: "KRW", value: amount },
        orderId,
        orderName,
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "결제 요청 중 오류가 발생했습니다.");
    }
  };

  if (applicationId == null || applicationId <= 0) {
    return (
      <Page className="pb-28 pt-2">
        <p className="text-center text-sm text-red-600">{error ?? "결제 정보가 없습니다."}</p>
      </Page>
    );
  }

  return (
    <Page className="pb-36 pt-2" title="결제하기">
      {!ready && !error && (
        <p className="mb-4 text-center text-sm text-zinc-500">결제를 준비하는 중...</p>
      )}
      {error && (
        <p className="mb-4 text-center text-sm text-red-600">{error}</p>
      )}
      {ready && (
        <>
          <div className="mb-4 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-zinc-700">결제 금액</span>
              <span className="text-lg font-bold text-zinc-900">결제창에서 확인</span>
            </div>
          </div>
          <div className="fixed bottom-0 left-0 right-0 z-10 mx-auto w-full max-w-screen-sm bg-white px-4 pb-8 pt-4">
            <button
              type="button"
              onClick={handlePayment}
              disabled={!ready}
              className="w-full rounded-full bg-[#0060EF] py-4 text-base font-semibold text-white disabled:opacity-50"
            >
              결제하기
            </button>
          </div>
        </>
      )}
    </Page>
  );
}
