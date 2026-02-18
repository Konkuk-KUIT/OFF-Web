import axiosInstance from "./axiosInstance";

/** 채팅방 타입: PROJECT(팀 채팅), CONTACT(개인 문의/연락) */
export type ChatRoomType = "PROJECT" | "CONTACT";

/* ========== 채팅방 목록 조회 GET /chat/rooms ========== */
/** 채팅방 목록 한 건 (서버 응답: id, opponentResponse, lastMessageInfo, unReadCount 등) */
export type ChatRoomResponse = {
  id?: number;
  roomId?: number;
  chatRoomId?: number;
  chatType?: string;
  opponentResponse?: { nickname?: string; profileImage?: string };
  chatProjectInfo?: { projectName?: string } | null;
  lastMessageInfo?: { content?: string; createdAt?: string } | null;
  nickname?: string;
  partnerNickname?: string;
  projectName?: string;
  lastMessage?: string;
  lastMessageAt?: string;
  lastMessageContent?: string;
  unReadCount?: number;
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

/** 참여 중인 채팅방 목록을 타입(PROJECT, CONTACT)별로 필터링하여 조회. GET /chat/rooms?type=CONTACT */
export const getChatRooms = (type: ChatRoomType) => {
  const typeParam = type === "CONTACT" ? "CONTACT" : "PROJECT";
  return axiosInstance.get<ChatRoomsResponse>("/chat/rooms", {
    params: { type: typeParam },
  });
};

/* ========== 채팅방 메시지 조회 GET /chat/rooms/:roomId ========== */
export type RoomMessageItem = {
  id: number;
  content: string;
  createdAt: string;
  mine?: boolean;
  isMine?: boolean;
};

export type RoomMessagesResponse = {
  success: boolean;
  code: number;
  message: string;
  data: {
    chatMessageResponses?: RoomMessageItem[];
    messageResponses?: RoomMessageItem[];
    messages?: RoomMessageItem[];
    hasNext?: boolean;
  };
};

export type RoomMessagesQuery = {
  cursor?: number;
  size?: number;
};

/** 특정 채팅방의 메시지 내역을 커서 기반 페이징으로 조회 */
export const getRoomMessages = (roomId: number, params?: RoomMessagesQuery) => {
  const { cursor, size = 20 } = params ?? {};
  const numSize = typeof size === "number" && Number.isFinite(size) ? Math.min(100, Math.max(1, size)) : 20;
  const numCursor = cursor != null && Number.isFinite(Number(cursor)) ? Number(cursor) : undefined;
  const query: Record<string, number> = { size: numSize };
  if (numCursor != null) query.cursor = numCursor;
  return axiosInstance.get<RoomMessagesResponse>(`/chat/rooms/${Number(roomId)}`, {
    params: query,
  });
};

/* ========== 일반 메시지 발송 POST /chat/rooms/messages ========== */
export type SendMessagePayload = {
  roomId: number;
  content: string;
};

export type SendMessageResponse = {
  success: boolean;
  code: number;
  message: string;
  data: {
    id: number;
    content: string;
    createdAt: string;
    mine: boolean;
  };
};

export const sendMessage = (payload: SendMessagePayload) => {
  return axiosInstance.post<SendMessageResponse>("/chat/rooms/messages", payload);
};

/* ========== 첫 메시지 발송 POST /chat/rooms/first ========== */
export type SendFirstMessagePayload = {
  opponentId: number;
  content: string;
};

export type SendFirstMessageResponse = {
  success: boolean;
  code: number;
  message: string;
  data: {
    chatRoomId: number;
    messageId: number;
    content: string;
    createdAt: string;
    mine: boolean;
  };
};

export const sendFirstMessage = (payload: SendFirstMessagePayload) => {
  return axiosInstance.post<SendFirstMessageResponse>("/chat/rooms/first", payload);
};
