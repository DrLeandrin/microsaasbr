import type { Instrumentation } from "next";

export async function register() {}

export const onRequestError: Instrumentation.onRequestError = async (error, request) => {
  if (process.env.NEXT_RUNTIME && process.env.NEXT_RUNTIME !== "nodejs") return;
  const { ignoredErrorDigest, logError } = await import("@/lib/errors");
  if (ignoredErrorDigest(error)) return;
  await logError(error, request.path);
};
