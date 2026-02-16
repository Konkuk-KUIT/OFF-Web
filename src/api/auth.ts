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

/** 로그인 요청 Body (POST /auth/login) */
export type LoginPayload = {
  email: string;
  password: string;
};

/** 로그인 성공 응답 (API 명세) */
export type LoginResponse = {
  success: boolean;
  code: number;
  message: string;
  data: {
    accessToken: string;
    tokenType: string;
  };
};

/** 로그인 API */
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
