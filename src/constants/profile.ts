export const ROLES = ["기획자", "개발자", "디자이너", "마케터"] as const;

export const EXPERIENCES = ["없음", "1회", "2회", "3회", "4회", "5회 이상"] as const;

export type Role = (typeof ROLES)[number];
export type Experience = (typeof EXPERIENCES)[number];
