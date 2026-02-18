import axiosInstance from "./axiosInstance";

export type HomeRecruitItem = {
  role: string;
  count: number;
};

export type HomeProjectItem = {
  projectId: number;
  id?: number; // API에 따라 id로 올 수 있음
  name: string;
  creatorNickname: string;
  endDate: string;
  progressPercent: number;
  recruitList: HomeRecruitItem[];
  recruiting: boolean;
  dday?: number;
  dDay?: number; // 백엔드 MyProjectSummary는 dDay
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

/** 백엔드가 Spring Data 페이지네이션으로 줄 때 (projects: { content: [...] }) */
export type PaginatedResponse<T> = {
  content: T[];
  totalPages?: number;
  totalElements?: number;
  size?: number;
  number?: number;
};

export type HomeResponse = {
  success: boolean;
  code: number;
  message: string;
  data: {
    showCreateButton: boolean;
    projects: HomeProjectItem[] | PaginatedResponse<HomeProjectItem>;
    partners: HomePartnerItem[];
  };
};

export type HomeQuery = {
  page?: number;
  size?: number;
};

/**
 * GET /home — 진행 중인 프로젝트·파트너 추천 조회.
 * 프론트에서 size=20 등을 보내도 응답이 3개로 고정되면,
 * 백엔드에서 Pageable 기본값(size=3) 또는 size 파라미터 미반영 여부 확인 필요.
 */
export const getHome = (params: HomeQuery = {}) => {
  const { page = 0, size = 10 } = params;
  return axiosInstance.get<HomeResponse>("/home", { params: { page, size } });
};
