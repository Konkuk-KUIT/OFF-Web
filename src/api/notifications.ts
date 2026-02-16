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
