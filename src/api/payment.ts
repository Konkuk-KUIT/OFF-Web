import axiosInstance from "./axiosInstance";
import type { BaseResponse } from "./types";

function extractMessageFromUnknownResponseData(data: unknown): string | null {
  if (!data) return null;
  if (typeof data === "string") return data;
  if (typeof data === "object") {
    const maybe = data as { message?: unknown; error?: unknown };
    if (typeof maybe.message === "string" && maybe.message.trim()) return maybe.message;
    if (typeof maybe.error === "string" && maybe.error.trim()) return maybe.error;
  }
  return null;
}

async function postWith404Fallback<T>(
  paths: string[],
  payload: unknown,
  defaultErrorMessage: string
): Promise<T> {
  let lastError: Error | null = null;
  for (const path of paths) {
    try {
      const res = await axiosInstance.post<BaseResponse<T>>(path, payload);
      if (!res.data.success) throw new Error(res.data.message ?? defaultErrorMessage);
      return res.data.data;
    } catch (e: unknown) {
      const ax = e as { response?: { status?: number; data?: unknown }; message?: string };
      const status = ax?.response?.status;
      const serverMsg = extractMessageFromUnknownResponseData(ax?.response?.data);
      if (status === 404 && serverMsg) throw new Error(serverMsg);
      if (status === 404) {
        lastError = new Error(`결제 API 경로를 찾을 수 없습니다. (${path})`);
        continue;
      }
      // 400 등 4xx: 서버 메시지가 있으면 그대로 표시 (유효하지 않은 지원 상태 등)
      throw new Error(serverMsg || defaultErrorMessage);
    }
  }
  throw lastError ?? new Error(`결제 API 경로를 찾을 수 없습니다. (${paths.join(" 또는 ")})`);
}

/**
 * 결제 준비 요청 (파트너 매칭 완료 후 호출)
 * POST /members/payments/prepare
 * - applicationId: 이전에 파트너 매칭 단계에서 확보한 ID (지원/제안 건 식별)
 * - 서버가 amount를 계산해서 내려주므로 프론트에서 금액 수정 금지
 */
export type PreparePaymentRequest = {
  applicationId: number;
};

export type PreparePaymentResponse = {
  orderId: string;
  amount: number;
  orderName?: string;
};

export async function preparePayment(
  payload: PreparePaymentRequest
): Promise<PreparePaymentResponse> {
  return await postWith404Fallback<PreparePaymentResponse>(
    ["/members/payments/prepare", "/payments/prepare"],
    payload,
    "결제 준비에 실패했습니다."
  );
}

/** 결제용 클라이언트 키 조회 (GET /members/payments/client-key 만 사용) */
export async function getPaymentClientKey(): Promise<string> {
  const res = await axiosInstance.get<BaseResponse<string>>("/members/payments/client-key");
  if (!res.data.success) throw new Error(res.data.message ?? "클라이언트 키 조회 실패");
  return res.data.data;
}

/** 결제 확정 요청 (우리 결제창에서 결제 완료 후 /account/success에서 호출) */
export type ConfirmPaymentRequest = {
  orderId: string;
  paymentKey: string;
  amount: number;
};

export type ConfirmPaymentResponse = {
  payLogId: number;
  status: string;
};

export async function confirmPayment(
  payload: ConfirmPaymentRequest
): Promise<ConfirmPaymentResponse> {
  return await postWith404Fallback<ConfirmPaymentResponse>(
    ["/members/payments/confirm", "/payments/confirm"],
    payload,
    "결제 확정에 실패했습니다."
  );
}
