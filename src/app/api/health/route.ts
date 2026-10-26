import { NextResponse } from "next/server";
import { isBailianMemoryConfigured } from "@/lib/memory/bailian";

export const runtime = "nodejs";

function hostOf(value: string | undefined) {
  if (!value) return null;
  try {
    return new URL(value).host;
  } catch {
    return "invalid-url";
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "english-mate",
    time: new Date().toISOString(),
    deploymentRegion: process.env.VERCEL_REGION || null,
    config: {
      supabase: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)),
      bailianText: Boolean(process.env.DASHSCOPE_API_KEY && process.env.DASHSCOPE_BASE_URL && process.env.DASHSCOPE_TEXT_MODEL),
      bailianTextHost: hostOf(process.env.DASHSCOPE_BASE_URL),
      bailianMemory: isBailianMemoryConfigured(),
      rateLimit: Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN),
      rateLimitMode: process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
        ? "upstash"
        : process.env.SINGLE_USER_MODE === "true" || process.env.FIXED_ACCOUNT_EMAIL
          ? "memory-fallback"
          : "none",
      authAccountDeletion: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
      singleUserMode: process.env.SINGLE_USER_MODE === "true",
    },
  });
}