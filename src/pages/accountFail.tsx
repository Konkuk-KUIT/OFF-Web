import { useSearchParams, useNavigate } from "react-router-dom";
import Page from "../components/Page";

export default function AccountFail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const message =
    searchParams.get("message") ??
    "결제에 실패했습니다. 잠시 후 다시 시도해 주세요.";

  return (
    <Page className="space-y-6 pb-28" title="결제 실패">
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

