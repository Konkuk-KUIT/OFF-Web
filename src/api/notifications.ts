import axiosInstance from "./axiosInstance";

export type NotificationItem = {
  notificationId: number;
  title: string;
  type: string;
  content: string;
  redirectUrl: string;
  createdAt: string;
  isRead: boolean;
  /** 지원/제안 알림일 때 백엔드에서 직접 내려주면 redirectUrl 파싱 없이 사용 (redirectUrl 형식 변경이 어려울 때) */
  projectId?: number;
  applicationId?: number;
  invitationId?: number;
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
 * 알림 URL 패턴별 플로우 구분 (가이드라인)
 * - /invitations/{applicationId} → 파트너 초대 알림 (수락/거절)
 * - /payments/prepare/{applicationId} → 기획자 결제 알림 (결제하기/거절)
 */
export type NotificationFlowType = "invitation" | "payment" | null;

export function getNotificationFlowType(redirectUrl: string): NotificationFlowType {
  if (!redirectUrl || typeof redirectUrl !== "string") return null;
  if (/\/invitations\/\d+/.test(redirectUrl)) return "invitation";
  if (/\/payments\/prepare\/\d+/.test(redirectUrl)) return "payment";
  return null;
}

/**
 * /invitations/{applicationId} 또는 /projects/invitations/{id} 에서 ID 추출
 * 가이드: POST /invitations/{applicationId}/accept 에 사용
 */
export function parseInvitationIdFromRedirectUrl(redirectUrl: string): number | null {
  if (!redirectUrl || typeof redirectUrl !== "string") return null;
  const match = redirectUrl.match(/\/(?:invitations|projects\/invitations)\/(\d+)$/);
  if (!match) return null;
  const id = parseInt(match[1], 10);
  return Number.isNaN(id) ? null : id;
}

/** /invitations/123 → 123 (파트너 초대 알림용 applicationId) */
export function parseApplicationIdFromInvitationUrl(redirectUrl: string): number | null {
  return parseInvitationIdFromRedirectUrl(redirectUrl);
}

/**
 * 지원 알림 등 redirectUrl에서 projectId 추출
 * 예: "/projects/123", "/projects/123/applications/456", "?projectId=123"
 */
export function parseProjectIdFromRedirectUrl(redirectUrl: string): number | null {
  if (!redirectUrl || typeof redirectUrl !== "string") return null;
  const pathMatch = redirectUrl.match(/\/projects\/(\d+)/);
  if (pathMatch) {
    const id = parseInt(pathMatch[1], 10);
    return Number.isNaN(id) ? null : id;
  }
  const queryMatch = redirectUrl.match(/[?&]projectId=(\d+)/);
  if (queryMatch) {
    const id = parseInt(queryMatch[1], 10);
    return Number.isNaN(id) ? null : id;
  }
  return null;
}

/**
 * 지원 알림 redirectUrl에서 applicationId 추출
 * 예: "/payments/prepare/7" → 7 (결제 prepare에 쓰는 applicationId)
 */
export function parseApplicationIdFromRedirectUrl(redirectUrl: string): number | null {
  if (!redirectUrl || typeof redirectUrl !== "string") return null;
  const match = redirectUrl.match(/\/payments\/prepare\/(\d+)/);
  if (!match) return null;
  const id = parseInt(match[1], 10);
  return Number.isNaN(id) ? null : id;
}

/** 프로젝트 제안 알림인지 type으로 판단 */
export function isProjectInvitationType(type: string): boolean {
  if (!type) return false;
  const t = type.toUpperCase();
  return t.includes("INVITATION") || t.includes("제안") || t === "PROJECT_INVITATION";
}

/** 지원 알림(파트너가 프로젝트에 지원)인지 type으로 판단 */
export function isSupportNotificationType(type: string): boolean {
  if (!type) return false;
  const t = type.toUpperCase();
  return t.includes("APPLICATION") || t.includes("지원") || t === "SUPPORT" || t === "APPLY";
}

/**
 * 알림 클릭 시 라우팅용 state 추출
 * - flowType: invitation → /partner/invitation, payment → /partner/supported
 * - 항상 GET /applications/{applicationId} 로 상세 조회
 */
export function getSupportedPartnerState(notice: NotificationItem): {
  flowType: NotificationFlowType;
  projectId?: number;
  invitationId?: number;
  applicationId?: number;
} {
  const redirectUrl = notice.redirectUrl ?? "";
  const flowType = getNotificationFlowType(redirectUrl);

  const isInvitation = isProjectInvitationType(notice.type);
  const isSupport = isSupportNotificationType(notice.type);
  if (!isInvitation && !isSupport && !flowType) {
    return { flowType: null };
  }

  const applicationIdFromInvitation =
    flowType === "invitation" ? parseApplicationIdFromInvitationUrl(redirectUrl) : null;
  const applicationIdFromPayment =
    flowType === "payment" ? parseApplicationIdFromRedirectUrl(redirectUrl) : null;
  const applicationIdFromUrl = applicationIdFromInvitation ?? applicationIdFromPayment;

  const projectIdFromUrl = isSupport ? parseProjectIdFromRedirectUrl(redirectUrl) : null;
  const invitationIdFromUrl = (isInvitation || isSupport)
    ? parseInvitationIdFromRedirectUrl(redirectUrl)
    : null;

  return {
    flowType: flowType ?? (isInvitation || isSupport ? "payment" : null),
    projectId: notice.projectId ?? (projectIdFromUrl ?? undefined),
    invitationId: notice.invitationId ?? (invitationIdFromUrl ?? undefined),
    applicationId: notice.applicationId ?? (applicationIdFromUrl ?? undefined),
  };
}
