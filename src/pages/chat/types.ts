export type TabType = "project" | "partner";

export type ChatItem = {
  id: string;
  nickname: string;
  projectName?: string;
  lastMessage: string;
  timestamp: string;
  unreadCount?: number;
};
