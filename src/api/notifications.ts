import axiosInstance from "./axiosInstance";

export type NotificationItem = {
  notificationId: number;
  title: string;
  type: string;
  content: string;
  redirectUrl: string;
  createdAt: string;
  isRead: boolean;
};

export type NotificationsResponse = {
  success: boolean;
  code: number;
  message: string;
  data: {
    unReadCount: number;
    notifications: NotificationItem[];
    hasNext: boolean;
  };
};

export type NotificationsQuery = {
  /** 마지막으로 조회된 알림 ID (첫 페이지 조회 시 생략) */
  cursor?: number | null;
  /** 한 번에 조회할 알림 개수 (기본값 10) */
  size?: number;
};

/**
 * 커서 기반 페이징 및 자동 읽음 처리가 포함된 알림 목록 조회
 */
export const getNotifications = (params: NotificationsQuery = {}) => {
  const { cursor, size = 10 } = params;
  return axiosInstance.get<NotificationsResponse>("/notifications", {
    params:
      cursor != null && cursor !== undefined
        ? { cursor, size }
        : { size },
  });
};

export type MarkReadResponse = {
  success: boolean;
  code: number;
  message: string;
  data: {
    notificationId: number;
    isRead: boolean;
  };
};

/**
 * URL이 포함된 알림을 클릭했을 때 읽음 상태로 변경
 */
export const markNotificationAsRead = (notificationId: number) => {
  return axiosInstance.patch<MarkReadResponse>(
    `/notifications/${notificationId}/read`
  );
};

/**
 * 제안 관련 알림의 redirectUrl에서 invitationId 추출
 * 예: "/projects/invitations/123" → 123
 * type 필드로 '프로젝트 제안' 여부 확인 후 이 ID를 사용
 */
export function parseInvitationIdFromRedirectUrl(redirectUrl: string): number | null {
  if (!redirectUrl || typeof redirectUrl !== "string") return null;
  const match = redirectUrl.match(/\/(?:invitations|projects\/invitations)\/(\d+)$/);
  if (!match) return null;
  const id = parseInt(match[1], 10);
  return Number.isNaN(id) ? null : id;
}

/** 프로젝트 제안 알림인지 type으로 판단 (백엔드에서 내려주는 값에 맞게 조정) */
export function isProjectInvitationType(type: string): boolean {
  if (!type) return false;
  const t = type.toUpperCase();
  return t.includes("INVITATION") || t.includes("제안") || t === "PROJECT_INVITATION";
}
