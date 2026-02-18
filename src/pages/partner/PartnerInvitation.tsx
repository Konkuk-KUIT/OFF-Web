import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Page from "../../components/Page";
import {
  getApplicationDetail,
  acceptInvitationByApplicationId,
  type ApplicationDetailResponse,
} from "../../api/project";
import { getRoleLabel } from "../../api/partner";

export default function PartnerInvitation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [applicationId, setApplicationId] = useState<number | null>(null);
  const [detail, setDetail] = useState<ApplicationDetailResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accepting, setAccepting] = useState(false);
  const [acceptSuccess, setAcceptSuccess] = useState(false);
  const [rejectSuccess, setRejectSuccess] = useState(false);

  useEffect(() => {
    const state = location.state as { applicationId?: number } | null;
    const id = state?.applicationId ?? null;
    setApplicationId(id);
  }, [location.state]);

  useEffect(() => {
    if (applicationId == null || applicationId <= 0) return;
    setLoading(true);
    setError(null);
    getApplicationDetail(applicationId)
      .then(setDetail)
      .catch((e) => setError(e instanceof Error ? e.message : "초대 정보를 불러오지 못했습니다."))
      .finally(() => setLoading(false));
  }, [applicationId]);

  /** 알림에서 왔을 때: 초대 상세 로드 후 프로젝트 페이지로 이동 (자세히 보기 → 프로젝트 페이지) */
  useEffect(() => {
    if (!detail?.projectId || applicationId == null) return;
    navigate(`/project/${detail.projectId}`, {
      replace: true,
      state: { applicationId },
    });
  }, [detail?.projectId, applicationId, navigate]);

  const handleAccept = () => {
    if (applicationId == null || applicationId <= 0) return;
    setAccepting(true);
    acceptInvitationByApplicationId(applicationId)
      .then(() => setAcceptSuccess(true))
      .catch((e) => setError(e instanceof Error ? e.message : "수락 처리에 실패했습니다."))
      .finally(() => setAccepting(false));
  };

  const handleReject = () => {
    // 가이드에 거절 API 미명시 — 추후 추가 시 POST /invitations/{applicationId}/reject 등 호출
    setRejectSuccess(true);
  };

  if (acceptSuccess) {
    return (
      <Page className="pb-28 pt-2">
        <div className="rounded-2xl bg-zinc-100 p-6 text-center">
          <p className="text-base font-medium text-zinc-900">
            제안을 수락했습니다. 기획자가 결제를 진행하면 매칭이 완료됩니다.
          </p>
          <button
            type="button"
            onClick={() => navigate("/home", { replace: true })}
            className="mt-4 rounded-full bg-[#0060EF] px-6 py-2 text-sm font-medium text-white"
          >
            홈으로
          </button>
        </div>
      </Page>
    );
  }

  if (rejectSuccess) {
    return (
      <Page className="pb-28 pt-2">
        <div className="rounded-2xl bg-zinc-100 p-6 text-center">
          <p className="text-base font-medium text-zinc-900">초대를 거절했습니다.</p>
          <button
            type="button"
            onClick={() => navigate("/home", { replace: true })}
            className="mt-4 rounded-full bg-zinc-700 px-6 py-2 text-sm font-medium text-white"
          >
            홈으로
          </button>
        </div>
      </Page>
    );
  }

  /* 알림에서 왔을 때: 상세 로드 후 프로젝트 페이지로 리다이렉트하므로 폼 대신 안내만 표시 */
  if (!loading && detail?.projectId && applicationId != null) {
    return (
      <Page className="pb-28 pt-2" title="초대 상세">
        <p className="mb-4 text-center text-sm text-zinc-500">프로젝트 페이지로 이동 중...</p>
      </Page>
    );
  }

  return (
    <Page className="pb-28 pt-2" title="초대 상세">
      {loading && (
        <p className="mb-4 text-center text-sm text-zinc-500">초대 정보를 불러오는 중...</p>
      )}
      {error && (
        <p className="mb-4 text-center text-sm text-red-600">{error}</p>
      )}
      {!loading && detail && (
        <>
          <section className="rounded-2xl bg-zinc-100 p-4">
            <h2 className="text-lg font-bold text-zinc-900">{detail.projectName}</h2>
            {detail.projectDescription && (
              <p className="mt-1 text-sm text-zinc-700">{detail.projectDescription}</p>
            )}
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-600">역할</span>
                <span className="font-medium text-zinc-900">{getRoleLabel(detail.role)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-600">예상 비용</span>
                <span className="font-medium text-zinc-900">
                  {(detail.cost ?? 0).toLocaleString()}원
                </span>
              </div>
            </div>
          </section>

          <div className="fixed bottom-0 left-0 right-0 z-10 mx-auto flex w-full max-w-screen-sm gap-3 border-t border-zinc-100 bg-white px-4 pb-8 pt-4">
            <button
              type="button"
              onClick={handleReject}
              className="flex-1 rounded-full border border-zinc-300 bg-white py-4 text-base font-semibold text-zinc-700"
            >
              거절하기
            </button>
            <button
              type="button"
              onClick={handleAccept}
              disabled={accepting}
              className="flex-1 rounded-full bg-[#0060EF] py-4 text-base font-semibold text-white disabled:opacity-60"
            >
              {accepting ? "처리 중..." : "수락하기"}
            </button>
          </div>
        </>
      )}
      {!loading && !detail && !error && applicationId == null && (
        <p className="text-center text-sm text-zinc-500">초대 정보가 없습니다.</p>
      )}
    </Page>
  );
}
