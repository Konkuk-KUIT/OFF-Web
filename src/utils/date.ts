/**
 * API에서 받은 날짜 문자열(ISO 또는 "yyyy-MM-ddTHH:mm:ss")을
 * 로컬 시간으로 해석해 포맷합니다.
 * - 서버가 UTC로 보낼 때는 문자열에 'Z'가 있으면 브라우저가 로컬 시간으로 변환합니다.
 * - 타임존 없이 오면 브라우저 기본 동작(로컬로 해석)으로 표시됩니다.
 */
function parseDate(value: string): Date | null {
  if (!value?.trim()) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** "YYYY.MM.DD HH:mm" (알림·채팅 목록 등) */
export function formatDateTime(isoString: string): string {
  const d = parseDate(isoString);
  if (!d) return isoString;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${y}.${m}.${day} ${h}:${min}`;
}

/** "HH:mm" (채팅 말풍선 시간 등) */
export function formatTime(isoString: string): string {
  const d = parseDate(isoString);
  if (!d) return "";
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}
