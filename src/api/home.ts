import axiosInstance from "./axiosInstance";

export type HomeRecruitItem = {
  role: string;
  count: number;
};

export type HomeProjectItem = {
  projectId: number;
  name: string;
  creatorNickname: string;
  endDate: string;
  progressPercent: number;
  recruitList: HomeRecruitItem[];
  recruiting: boolean;
  dday: number;
};

export type HomePartnerItem = {
  memberId: number;
  nickname: string;
  profileImage: string;
  role: string;
  selfIntroduction: string;
  projectCount: string;
  portfolioCount: number;
};

export type HomeResponse = {
  success: boolean;
  code: number;
  message: string;
  data: {
    showCreateButton: boolean;
    projects: HomeProjectItem[];
    partners: HomePartnerItem[];
  };
};

export type HomeQuery = {
  page?: number;
  size?: number;
};

export const getHome = (params: HomeQuery = {}) => {
  const { page = 1, size = 10 } = params;
  return axiosInstance.get<HomeResponse>("/home", { params: { page, size } });
};
