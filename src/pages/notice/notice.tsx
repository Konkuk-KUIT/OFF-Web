import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getNotifications,
  markNotificationAsRead,
  getSupportedPartnerState,
  isProjectInvitationType,
  isSupportNotificationType,
  toProjectDetailPath,
} from "../../api/notifications";
import type { NotificationItem } from "../../api/notifications";

function formatNoticeDate(createdAt: string): string {
  try {
    const d = new Date(createdAt);
    if (Number.isNaN(d.getTime())) return createdAt;
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const h = String(d.getHours()).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");
    return `${y}.${m}.${day} ${h}:${min}`;
  } catch {
    return createdAt;
  }
}

export default function Notice() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unReadCount, setUnReadCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNotificationLinkClick = useCallback(
    (
      e: React.MouseEvent,
      notice: NotificationItem,
      isExternal: boolean
    ) => {
      if (notice.isRead) return;
      e.preventDefault();
      markNotificationAsRead(notice.notificationId)
        .then(() => {
          setNotifications((prev) =>
            prev.map((n) =>
              n.notificationId === notice.notificationId
                ? { ...n, isRead: true }
                : n
            )
          );
          setUnReadCount((c) => Math.max(0, c - 1));
          if (isExternal) {
            window.open(notice.redirectUrl, "_blank", "noopener,noreferrer");
          } else {
            const isInvitation = isProjectInvitationType(notice.type);
            const isSupport = isSupportNotificationType(notice.type);
            if (isInvitation || isSupport) {
              const payload = getSupportedPartnerState(notice);
              const to =
                payload.flowType === "invitation"
                  ? "/partner/invitation"
                  : "/partner/supported";
              navigate(to, {
                state: {
                  ...payload,
                  notificationId: notice.notificationId,
                },
              });
            } else {
              const projectPath = toProjectDetailPath(notice.redirectUrl ?? "");
              navigate(projectPath ?? notice.redirectUrl);
            }
          }
        })
        .catch(() => {
          if (isExternal) {
            window.open(notice.redirectUrl, "_blank", "noopener,noreferrer");
          } else {
            const isInvitation = isProjectInvitationType(notice.type);
            const isSupport = isSupportNotificationType(notice.type);
            if (isInvitation || isSupport) {
              const payload = getSupportedPartnerState(notice);
              const to =
                payload.flowType === "invitation"
                  ? "/partner/invitation"
                  : "/partner/supported";
              navigate(to, {
                state: {
                  ...payload,
                  notificationId: notice.notificationId,
                },
              });
            } else {
              const projectPath = toProjectDetailPath(notice.redirectUrl ?? "");
              navigate(projectPath ?? notice.redirectUrl);
            }
          }
        });
    },
    [navigate]
  );

  const fetchPage = useCallback(
    (cursor?: number | null) => {
      const isFirst = cursor == null;
      if (isFirst) setLoading(true);
      else setLoadingMore(true);
      setError(null);

      getNotifications({ cursor, size: 10 })
        .then((res) => {
          const { data } = res.data;
          if (isFirst) {
            setNotifications(data.notifications ?? []);
          } else {
            setNotifications((prev) => [
              ...prev,
              ...(data.notifications ?? []),
            ]);
          }
          setUnReadCount(data.unReadCount ?? 0);
          setHasNext(data.hasNext ?? false);
        })
        .catch((err) => {
          const message = err?.response?.data?.message;
          setError(message ?? "알림 목록을 불러오지 못했습니다.");
        })
        .finally(() => {
          setLoading(false);
          setLoadingMore(false);
        });
    },
    []
  );

  useEffect(() => {
    fetchPage();
  }, [fetchPage]);

  const loadMore = () => {
    if (loadingMore || !hasNext || notifications.length === 0) return;
    const lastId = notifications[notifications.length - 1]?.notificationId;
    if (lastId == null) return;
    fetchPage(lastId);
  };

  if (loading) {
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-screen-sm flex-col bg-white pt-[5vh]">
        <div className="flex flex-1 items-center justify-center px-4 py-8">
          <p className="text-zinc-500">로딩 중...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-screen-sm flex-col bg-white pt-[5vh]">
        <div className="px-4 py-6">
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-screen-sm flex-col bg-white pt-[5vh]">
      <div className="flex-1 overflow-y-auto px-4 pt-2 pb-4 flex flex-col items-center">
        {unReadCount > 0 && (
          <p className="mb-3 w-full text-sm text-zinc-500">
            읽지 않은 알림 {unReadCount}건
          </p>
        )}
        <ul className="space-y-2 w-full flex flex-col items-center">
          {notifications.map((notice) => (
            <li key={notice.notificationId} className="notice-card w-full">
              <p className="notice-card-title mb-3">{notice.title}</p>
              <p className="notice-card-content mb-3 whitespace-pre-line">
                {notice.content}
              </p>
              <p className="notice-card-time text-right">
                {formatNoticeDate(notice.createdAt)}
              </p>
              {notice.redirectUrl && (
                <div className="mt-2 text-right">
                  {notice.redirectUrl.startsWith("http") ? (
                    <a
                      href={notice.redirectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-zinc-700"
                      onClick={(e) =>
                        handleNotificationLinkClick(e, notice, true)
                      }
                    >
                      자세히 보기 &gt;
                    </a>
                  ) : (() => {
                    const payload = getSupportedPartnerState(notice);
                    const isInviteOrPayment =
                      payload.flowType === "invitation" ||
                      payload.flowType === "payment" ||
                      payload.applicationId != null ||
                      payload.invitationId != null;
                    const projectDetailPath = toProjectDetailPath(notice.redirectUrl ?? "");
                    const to =
                      payload.flowType === "invitation"
                        ? "/partner/invitation"
                        : isInviteOrPayment
                          ? "/partner/supported"
                          : projectDetailPath ?? notice.redirectUrl;
                    return (
                      <Link
                        to={typeof to === "string" ? to : "/partner/supported"}
                        state={{
                          ...payload,
                          notificationId: notice.notificationId,
                        }}
                        className="text-sm font-medium text-zinc-700"
                        onClick={(e) =>
                          handleNotificationLinkClick(e, notice, false)
                        }
                      >
                        자세히 보기 &gt;
                      </Link>
                    );
                  })()}
                </div>
              )}
            </li>
          ))}
        </ul>
        {hasNext && (
          <div className="mt-4 w-full flex justify-center">
            <button
              type="button"
              onClick={loadMore}
              disabled={loadingMore}
              className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-700 disabled:opacity-50"
            >
              {loadingMore ? "불러오는 중..." : "더 보기"}
            </button>
          </div>
        )}
        {notifications.length === 0 && (
          <p className="py-8 text-center text-zinc-500">알림이 없습니다.</p>
        )}
      </div>
    </main>
  );
}
