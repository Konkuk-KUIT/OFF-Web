import axiosInstance from "./axiosInstance";
import type { BaseResponse } from "./types";


/** Swagger: components/schemas/ProfileResponse */
export type ProfileResponse = {
  name: string;
  nickname: string;
  profileImage: string | null;
  isWorking: boolean;
  projectName: string;
  role: "PM" | "DEV" | "DES" | "MAR";
  projectCount:
  | "ZERO"
  | "ONCE"
  | "TWICE"
  | "THREE_TIMES"
  | "FOUR_TIMES"
  | "PLUS_FIVE";
  portfolioList: { description: string; link: string }[];
  selfIntroduction: string;
};

export async function getMyProfile(): Promise<ProfileResponse> {
  const res = await axiosInstance.get<BaseResponse<ProfileResponse>>("/members/me");
  if (!res.data.success) throw new Error(res.data.message || "내 프로필 조회 실패");
  return res.data.data;
}

/** ===== 내 프로필 수정 (PATCH /members/me) ===== */

export type UpdateProfileRequest = {
  nickname?: string;
  profileImage?: string;
  projectCount?: ProfileResponse["projectCount"];
  portfolioList?: { description: string; link: string }[];
  selfIntroduction?: string;
};

export type UpdateProfileResponse = {
  memberId: number;
  updatedAt: string; // date-time
};

export async function updateMyProfile(
  payload: UpdateProfileRequest
): Promise<UpdateProfileResponse> {
  const res = await axiosInstance.patch<BaseResponse<UpdateProfileResponse>>(
    "/members/me",
    payload
  );
  if (!res.data.success) throw new Error(res.data.message || "내 프로필 수정 실패");
  return res.data.data;
}
/** ===== 프론트(My 페이지)에서 쓰는 형태로 매핑 ===== */

export type Portfolio = { desc: string; url: string };

export type MyPageProfile = {
  name: string;
  nickname: string;
  desiredJob: "기획자" | "개발자";
  projectExpCount: number | "";
  portfolios: Portfolio[];
  bio: string;
  project: string;
};

const roleToDesiredJob = (role: ProfileResponse["role"]): MyPageProfile["desiredJob"] =>
  role === "PM" ? "기획자" : "개발자";

const projectCountToNumber = (v: ProfileResponse["projectCount"]): number | "" => {
  switch (v) {
    case "ZERO":
      return 0;
    case "ONCE":
      return 1;
    case "TWICE":
      return 2;
    case "THREE_TIMES":
      return 3;
    case "FOUR_TIMES":
      return 4;
    case "PLUS_FIVE":
      return 5;
    default:
      return "";
  }
};

export function mapToMyPageProfile(api: ProfileResponse): MyPageProfile {
  const portfolios: Portfolio[] = (api.portfolioList ?? []).map((p) => ({
    desc: p.description ?? "",
    url: p.link ?? "",
  }));

  return {
    name: api.name ?? "",
    nickname: api.nickname ?? "",
    desiredJob: roleToDesiredJob(api.role),
    projectExpCount: projectCountToNumber(api.projectCount),
    portfolios,
    bio: api.selfIntroduction ?? "",
    project: api.projectName ?? "",
  };
}

/** ===== 참여한 프로젝트 조회 (GET /members/me/projects) ===== */

export type ProjectItem = {
  id: number;
  name: string;
  amount: number;
  paidAt: string; // date-time
  createdAt: string; // date-time
};

export type MyProjectsResponse = {
  projectList: ProjectItem[];
};

export async function getMyProjects(): Promise<MyProjectsResponse> {
  const res = await axiosInstance.get<BaseResponse<MyProjectsResponse>>(
    "/members/me/projects"
  );
  if (!res.data.success) throw new Error(res.data.message || "참여한 프로젝트 조회 실패");
  return res.data.data;
}
