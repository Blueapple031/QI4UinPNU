import type {
  OptimizeSmallWorldRequest,
  OptimizeSmallWorldResponse,
} from "./types.ts";

// 개발 시 Vite 프록시 사용 (CORS 우회), 프로덕션은 직접 호출
const API_URL =
  import.meta.env.DEV
    ? "/api/optimize/small-world"
    : "https://quantum.yunseong.dev/optimize/small-world";

export async function optimizeSmallWorld(
  request: OptimizeSmallWorldRequest
): Promise<OptimizeSmallWorldResponse> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `API 요청 실패 (${response.status}): ${text || response.statusText}`
    );
  }

  const data = (await response.json()) as OptimizeSmallWorldResponse;
  return data;
}
