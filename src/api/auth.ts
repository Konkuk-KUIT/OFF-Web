import axiosInstance from "./axiosInstance";

type LoginPayload = {
  email: string;
  password: string;
};

export const login = (data: LoginPayload) => {
  return axiosInstance.post("/login", data);
};