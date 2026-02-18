import { useSearchParams, useNavigate } from "react-router-dom";
import Page from "../../components/Page";

/** 기존 UI: 실패 메시지/코드/orderId, 결제 화면으로 / 홈으로 버튼 */
export default function PaymentFail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const message = searchParams.get("message") ?? "결제에 실패했습니다. 잠시 후 다시 시도해 주세요.";
  const code = searchParams.get("code") ?? "";
  const orderId = searchParams.get("orderId") ?? "";

  return (
    <Page className="space-y-6 pb-28" title="결제 실패">
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
        <p className="font-medium">{message}</p>
        {code && <p className="mt-1 text-sm text-red-600">코드: {code}</p>}
        {orderId && <p className="mt-1 text-sm text-zinc-600">주문번호: {orderId}</p>}
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
    </Page>
  );
}
