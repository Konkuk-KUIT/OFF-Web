import axiosInstance from "./axiosInstance";
import type { BaseResponse } from "./types";

/** GET /partners/{partnerId} - 파트너 프로필 및 포트폴리오 조회 */
export type PartnerPortfolioItem = {
  description: string;
  link: string;
};

export type PartnerProfileResponse = {
  memberId: number;
  name: string;
  nickname: string;
  profileImage: string;
  role: "PM" | "DEV" | "DES" | "MAR";
  selfIntroduction: string;
  isWorking: boolean;
  projectCount: string;
  portfolios: PartnerPortfolioItem[];
};

const ROLE_LABEL: Record<string, string> = {
  PM: "기획",
  DEV: "개발자",
  DES: "디자이너",
  MAR: "마케터",
};

export function getRoleLabel(role: string): string {
  return ROLE_LABEL[role] ?? role;
}

export async function getPartnerProfile(partnerId: number): Promise<PartnerProfileResponse> {
  const res = await axiosInstance.get<BaseResponse<PartnerProfileResponse>>(
    `/partners/${partnerId}`
  );
  if (!res.data.success) throw new Error(res.data.message ?? "파트너 조회 실패");
  return res.data.data;
}
