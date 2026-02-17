import axiosInstance from "./axiosInstance";

/** 채팅방 타입: PROJECT(팀 채팅), CONTACT(개인 문의/연락) */
export type ChatRoomType = "PROJECT" | "CONTACT";

/* ========== 채팅방 목록 조회 GET /chat/rooms ========== */
/** ChatRoomListResponse: 채팅방 목록 한 건 */
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

/** 참여 중인 채팅방 목록을 타입(PROJECT, CONTACT)별로 필터링하여 조회 */
export const getChatRooms = (type: ChatRoomType) => {
  return axiosInstance.get<ChatRoomsResponse>("/chat/rooms", { params: { type } });
};

/* ========== 채팅방 메시지 조회 GET /chat/rooms/:roomId ========== */
/** ChatMessageDetailResponse: 특정 채팅방의 상세 메시지 한 건 */
export type RoomMessageItem = {
  id: number;
  content: string;
  createdAt: string;
  mine: boolean;
};

export type RoomMessagesResponse = {
  success: boolean;
  code: number;
  message: string;
  data: {
    messageResponses?: RoomMessageItem[];
    messages?: RoomMessageItem[];
    hasNext?: boolean;
  };
};

export type RoomMessagesQuery = {
  /** 이전 메시지 페이지 커서 (메시지 ID) */
  cursor?: number;
  /** 페이지 크기 (기본 20) */
  size?: number;
};

/** 특정 채팅방의 메시지 내역을 커서 기반 페이징으로 조회 (기본 20개) */
export const getRoomMessages = (roomId: number, params?: RoomMessagesQuery) => {
  const { cursor, size = 20 } = params ?? {};
  return axiosInstance.get<RoomMessagesResponse>(`/chat/rooms/${roomId}`, {
    params: cursor != null ? { cursor, size } : { size },
  });
};

/* ========== 일반 메시지 발송 POST /chat/rooms/messages ========== */
/** SendMessageRequest: roomId(Long), content(String) */
export type SendMessagePayload = {
  roomId: number;
  content: string;
};

/** SendMessageResponse: id, content, createdAt, mine */
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

/** 기존 채팅방에서 텍스트 메시지 전송 */
export const sendMessage = (payload: SendMessagePayload) => {
  return axiosInstance.post<SendMessageResponse>("/chat/rooms/messages", payload);
};

/* ========== 첫 메시지 발송 POST /chat/rooms/first ========== */
/** ChatInitialSendRequest: opponentId(Long), content(String) */
export type SendFirstMessagePayload = {
  opponentId: number;
  content: string;
};

/** ChatInitialSendResponse: chatRoomId, messageId, content, createdAt, mine */
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

/** 대화 기록이 없는 상대에게 방을 새로 생성하며 첫 메시지 전송 (404 OPPONENT_NOT_FOUND 등 예외 처리) */
export const sendFirstMessage = (payload: SendFirstMessagePayload) => {
  return axiosInstance.post<SendFirstMessageResponse>("/chat/rooms/first", payload);
};
