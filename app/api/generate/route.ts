import { revalidatePath } from "next/cache";

const { generateUserComparison, InvalidComparisonInputError } = require("../../../scripts/generate-comparisons.js") as {
  generateUserComparison: (
    toolA: string,
    toolB: string,
    locale: string,
  ) => Promise<string>;
  InvalidComparisonInputError: new (...args: never[]) => Error;
};

export const runtime = "nodejs";

const MAX_BODY_BYTES = 4096;
const REQUESTS_PER_HOUR = 3;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const requestsByClient = new Map<string, number[]>();

function getClientKey(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function isRateLimited(clientKey: string): boolean {
  const now = Date.now();
  const recentRequests = (requestsByClient.get(clientKey) ?? []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS,
  );

  if (recentRequests.length >= REQUESTS_PER_HOUR) {
    requestsByClient.set(clientKey, recentRequests);
    return true;
  }

  if (!requestsByClient.has(clientKey) && requestsByClient.size >= 5000) {
    for (const [key, timestamps] of requestsByClient) {
      const activeTimestamps = timestamps.filter(
        (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS,
      );
      if (activeTimestamps.length === 0) {
        requestsByClient.delete(key);
      } else {
        requestsByClient.set(key, activeTimestamps);
      }
    }

    if (requestsByClient.size >= 5000) {
      return true;
    }
  }

  recentRequests.push(now);
  requestsByClient.set(clientKey, recentRequests);
  return false;
}

function jsonResponse(body: Record<string, string>, status: number): Response {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(request: Request): Promise<Response> {
  if (isRateLimited(getClientKey(request))) {
    return jsonResponse(
      { error: "Too many generation requests. Please try again later." },
      429,
    );
  }

  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return jsonResponse({ error: "Request body is too large." }, 413);
  }

  const reader = request.body?.getReader();
  if (!reader) {
    return jsonResponse({ error: "Request body is required." }, 400);
  }

  const decoder = new TextDecoder();
  let rawBody = "";
  let bodyBytes = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      rawBody += decoder.decode();
      break;
    }

    bodyBytes += value.byteLength;
    if (bodyBytes > MAX_BODY_BYTES) {
      await reader.cancel();
      return jsonResponse({ error: "Request body is too large." }, 413);
    }

    rawBody += decoder.decode(value, { stream: true });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return jsonResponse({ error: "Request body must be valid JSON." }, 400);
  }

  if (typeof payload !== "object" || payload === null || Array.isArray(payload)) {
    return jsonResponse({ error: "Request body must be a JSON object." }, 400);
  }

  const body = payload as Record<string, unknown>;
  if (
    typeof body.tech1 !== "string" ||
    typeof body.tech2 !== "string" ||
    typeof body.locale !== "string"
  ) {
    return jsonResponse(
      { error: "Provide tech1, tech2, and locale as strings." },
      400,
    );
  }

  try {
    const slug = await generateUserComparison(body.tech1, body.tech2, body.locale);
    const url = `/${body.locale}/compare/${slug}`;
    revalidatePath(url);
    revalidatePath("/sitemap.xml");
    return jsonResponse({ url, slug }, 200);
  } catch (error) {
    if (error instanceof InvalidComparisonInputError) {
      return jsonResponse({ error: error.message }, 400);
    }

    console.error("User comparison generation failed:", error);
    return jsonResponse(
      { error: "Comparison generation failed. Please try again later." },
      502,
    );
  }
}
