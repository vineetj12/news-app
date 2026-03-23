import { NextFunction, Request, Response } from "express";

const SHOULD_LOG_HTTP = (process.env.LOG_HTTP ?? "true").toLowerCase() !== "false";
const MAX_BODY_CHARS = Number(process.env.LOG_BODY_LIMIT ?? "1200");

const SENSITIVE_KEYS = new Set([
  "password",
  "token",
  "authorization",
  "apiKey",
  "apikey",
  "secret",
  "jwt",
  "accessToken",
  "refreshToken"
]);

const truncate = (value: string, max = MAX_BODY_CHARS) => {
  if (value.length <= max) {
    return value;
  }
  return `${value.slice(0, max)}... [truncated ${value.length - max} chars]`;
};

const redactDeep = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map(redactDeep);
  }

  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, innerValue] of Object.entries(value as Record<string, unknown>)) {
      if (SENSITIVE_KEYS.has(key)) {
        out[key] = "[REDACTED]";
      } else {
        out[key] = redactDeep(innerValue);
      }
    }
    return out;
  }

  return value;
};

const safeSerialize = (value: unknown) => {
  if (value === undefined) {
    return undefined;
  }

  try {
    return truncate(JSON.stringify(redactDeep(value)));
  } catch {
    return truncate(String(value));
  }
};

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  if (!SHOULD_LOG_HTTP) {
    return next();
  }

  const startedAt = Date.now();
  const requestId = Math.random().toString(36).slice(2, 10);
  let responseBody: unknown;

  const originalJson = res.json.bind(res);
  const originalSend = res.send.bind(res);

  res.json = ((body: unknown) => {
    responseBody = body;
    return originalJson(body);
  }) as Response["json"];

  res.send = ((body: unknown) => {
    responseBody = body;
    return originalSend(body);
  }) as Response["send"];

  const requestMeta = {
    id: requestId,
    method: req.method,
    path: req.originalUrl,
    ip: req.ip,
    query: req.query,
    params: req.params,
    body: req.body,
    contentType: req.headers["content-type"],
    authorization: req.headers.authorization ? "[REDACTED]" : undefined
  };

  console.log(`[HTTP IN] ${safeSerialize(requestMeta)}`);

  res.on("finish", () => {
    const durationMs = Date.now() - startedAt;
    const responseMeta = {
      id: requestId,
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs,
      response: responseBody
    };

    console.log(`[HTTP OUT] ${safeSerialize(responseMeta)}`);
  });

  next();
};
