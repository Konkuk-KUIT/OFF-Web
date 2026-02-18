import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Page from "../../components/Page";
import { confirmPayment } from "../../api/payment";

const CONFIRM_TIMEOUT_MS = 15000; // 15초 내 응답 없으면 실패 처리

/** 가이드: paymentKey, orderId, amount 추출 → confirm 호출 → success면 2초 후 이동, status: processing / success / fail */
export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"processing" | "success" | "fail">("processing");
  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const confirmTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didRunRef = useRef(false);

  useEffect(() => {
    if (didRunRef.current) return;
    didRunRef.current = true;

    const paymentKey = searchParams.get("paymentKey") ?? "";
    const orderId = searchParams.get("orderId") ?? "";
    const amountParam = searchParams.get("amount");
    const amount = amountParam ? Number(amountParam) : 0;

    if (!paymentKey || !orderId || !amount) {
      setStatus("fail");
      return;
    }

    let cancelled = false;

    const clearTimers = () => {
      if (successTimerRef.current) {
        clearTimeout(successTimerRef.current);
        successTimerRef.current = null;
      }
      if (confirmTimeoutRef.current) {
        clearTimeout(confirmTimeoutRef.current);
        confirmTimeoutRef.current = null;
      }
    };

    confirmTimeoutRef.current = setTimeout(() => {
      confirmTimeoutRef.current = null;
      if (cancelled) return;
      setStatus("fail");
    }, CONFIRM_TIMEOUT_MS);

    confirmPayment({ orderId, paymentKey, amount })
      .then(() => {
        if (cancelled) return;
        clearTimers();
        setStatus("success");
        successTimerRef.current = setTimeout(() => {
          navigate("/home", { replace: true });
        }, 2000);
      })
      .catch(() => {
        if (!cancelled) {
          clearTimers();
          setStatus("fail");
        }
      });

    return () => {
      cancelled = true;
      clearTimers();
    };
  }, [searchParams, navigate]);

  return (
    <Page className="space-y-6 pb-28">
      {status === "processing" && (
        <div className="flex flex-col items-center justify-center py-16 gap-6">
          <p className="text-zinc-600">결제를 확인하는 중입니다...</p>
          <button
            type="button"
            onClick={() => navigate("/home", { replace: true })}
            className="text-sm text-zinc-500 underline underline-offset-2 hover:text-zinc-700"
          >
            오래 걸리면 홈으로 이동
          </button>
        </div>
      )}
      {status === "success" && (
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-zinc-900">✅ 파트너 매칭이 완료되었습니다!</p>
        </div>
      )}
      {status === "fail" && (
        <>
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            ❌ 결제 확인에 실패했습니다.
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate("/payment", { replace: true })}
              className="flex-1 rounded-xl border border-zinc-300 bg-white py-3 text-sm font-medium text-zinc-700"
            >
              결제 화면으로
            </button>
            <button
              type="button"
              onClick={() => navigate("/home", { replace: true })}
              className="flex-1 rounded-xl bg-[#0060EF] py-3 text-sm font-semibold text-white"
            >
              홈으로
            </button>
          </div>
        </>
      )}
    </Page>
  );
}
