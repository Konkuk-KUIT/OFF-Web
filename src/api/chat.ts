import axiosInstance from "./axiosInstance";

export type ChatRoomType = "PROJECT" | "CONTACT";

/** 채팅방 목록 한 건 (서버 필드명은 백엔드 명세에 맞춰 조정 가능) */
export type ChatRoomResponse = {
  roomId?: number;
  chatRoomId?: number;
  nickname?: string;
  partnerNickname?: string;
  projectName?: string;
  lastMessage?: string;
  lastMessageAt?: string;
  lastMessageContent?: string;
  unreadCount?: number;
  [key: string]: unknown;
};

export type ChatRoomsResponse = {
  success: boolean;
  code: number;
  message: string;
  data: {
    chatRoomResponses: ChatRoomResponse[];
  };
};

/**
 * 사용자가 참여 중인 채팅방 목록을 타입별로 조회
 * @param type PROJECT(프로젝트) | CONTACT(파트너 컨택)
 */
export const getChatRooms = (type: ChatRoomType) => {
  return axiosInstance.get<ChatRoomsResponse>("/chat/rooms", {
    params: { type },
  });
};
