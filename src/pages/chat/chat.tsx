import { Routes, Route } from "react-router-dom";
import ChatList from "./ChatList";
import ChatRoom from "./ChatRoom";

/**
 * 채팅 진입점.
 * /chat → ChatList (회색 박스 목록)
 * /chat/:id → ChatRoom (채팅방)
 */
export default function Chat() {
  return (
    <Routes>
      <Route index element={<ChatList />} />
      <Route path=":id" element={<ChatRoom />} />
    </Routes>
  );
}
