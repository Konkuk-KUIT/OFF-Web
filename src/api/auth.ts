import axiosInstance from "./axiosInstance";

/** 회원가입 요청 Body (API 명세) */
export type SignupPayload = {
  name: string;
  birth: string;
  email: string;
  password: string;
  profileImage?: string;
  nickname: string;
  role: string;
  projectCount: string;
  selfIntroduction: string;
  portfolioList: { description: string; link: string }[];
};

/** 회원가입 성공 응답 */
export type SignupResponse = {
  success: boolean;
  code: number;
  message: string;
  data: {
    memberId: number;
    email: string;
    createdAt: string;
  };
};

export const signup = (data: SignupPayload) => {
  return axiosInstance.post<SignupResponse>("/auth/signup", data);
};

/** 로그인 요청 (POST /auth/login) - 백엔드 연동 시 사용 */
export type LoginPayload = {
  email: string;
  password: string;
};

/** 로그인 응답 (백엔드 명세) - 마이페이지 mock 데이터 형식과 맞춤 */
export type LoginResponse = {
  accessToken: string;
  user?: {
    id: number;
    email: string;
    name: string;
    nickname: string;
    project: string;
    role: string;
  };
};

/** Mock 로그인 응답 - 프론트에서 백엔드 대기 중 사용, 마이페이지에서 그대로 사용 가능 */
const MOCK_LOGIN_RESPONSE: LoginResponse = {
  accessToken: "mock-token-123",
  user: {
    id: 1,
    email: "test@test.com",
    name: "김쿠잇",
    nickname: "1111",
    project: "어플 개발 프로젝트",
    role: "기획자",
  },
};

const MOCK_EMAIL = "test@test.com";
const MOCK_PASSWORD = "1234";
const MOCK_DELAY_MS = 500;

/**
 * Mock 로그인 (백엔드 미구현 시 사용)
 * - test@test.com / 1234 → 200 OK, accessToken + user 반환
 * - 그 외 → 실패
 */
export function loginWithMock(
  email: string,
  password: string
): Promise<LoginResponse> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === MOCK_EMAIL && password === MOCK_PASSWORD) {
        resolve(MOCK_LOGIN_RESPONSE);
      } else {
        reject(new Error("이메일 또는 비밀번호가 올바르지 않습니다."));
      }
    }, MOCK_DELAY_MS);
  });
}

/** 백엔드 연동 시 사용할 실제 로그인 API */
export const login = (data: LoginPayload) => {
  return axiosInstance.post<LoginResponse>("/auth/login", data);
};

/** 앱에서 사용할 액세스 토큰 저장 */
const ACCESS_TOKEN_KEY = "accessToken";

export const setAccessToken = (token: string) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const clearAccessToken = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
};

export const isLoggedIn = () => !!getAccessToken();
