import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Page from "../components/Page";
import { confirmPayment } from "../api/payment";

export default function AccountSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get("orderId") ?? "";
  const paymentKey = searchParams.get("paymentKey") ?? "";
  const amountParam = searchParams.get("amount");
  const amount = amountParam ? Number(amountParam) : 0;

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (!orderId || !paymentKey || amount <= 0) {
      setStatus("error");
      setMessage("결제 정보가 올바르지 않습니다. 토스 결제 완료 후 이 페이지로 돌아와 주세요.");
      return;
    }

    confirmPayment({ orderId, paymentKey, amount })
      .then(() => {
        setStatus("success");
        navigate("/home", { replace: true });
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err instanceof Error ? err.message : "결제 확정에 실패했습니다.");
      });
  }, [orderId, paymentKey, amount]);

  if (status === "loading") {
    return (
      <Page className="space-y-6 pb-28">
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-zinc-600">결제를 확정하는 중입니다...</p>
        </div>
      </Page>
    );
  }

  if (status === "error") {
    return (
      <Page className="space-y-6 pb-28">
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          {message}
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate("/account", { replace: true })}
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
      </Page>
    );
  }

  return null;
}
