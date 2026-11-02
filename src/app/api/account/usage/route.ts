import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { enforceRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

type UsageEvent = {
  feature: string;
  model: string | null;
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  audio_seconds: number;
  created_at: string;
};

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "请先登录。" }, { status: 401 });

  const rate = await enforceRateLimit(user.id, "account-usage", 60);
  if (!rate.allowed) return NextResponse.json({ error: "请求太频繁。" }, { status: rate.configurationError ? 503 : 429 });

  const [billingResult, eventsResult] = await Promise.all([
    supabase
      .from("billing_accounts")
      .select("used_tokens,used_prompt_tokens,used_completion_tokens,used_audio_seconds")
      .eq("user_id", user.id)
      .maybeSingle(),
    supabase
      .from("usage_events")
      .select("feature,model,prompt_tokens,completion_tokens,total_tokens,audio_seconds,created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(100),
  ]);

  if (eventsResult.error) {
    console.error("usage events read failed", eventsResult.error.message);
    return NextResponse.json({ error: "读取 Token 用量失败。" }, { status: 500 });
  }

  const events = (eventsResult.data ?? []) as UsageEvent[];
  const byFeature = new Map<string, { feature: string; requests: number; totalTokens: number; promptTokens: number; completionTokens: number }>();
  for (const event of events) {
    const item = byFeature.get(event.feature) ?? {
      feature: event.feature,
      requests: 0,
      totalTokens: 0,
      promptTokens: 0,
      completionTokens: 0,
    };
    item.requests += 1;
    item.totalTokens += Number(event.total_tokens ?? 0);
    item.promptTokens += Number(event.prompt_tokens ?? 0);
    item.completionTokens += Number(event.completion_tokens ?? 0);
    byFeature.set(event.feature, item);
  }

  return NextResponse.json({
    totals: {
      totalTokens: Number(billingResult.data?.used_tokens ?? 0),
      promptTokens: Number(billingResult.data?.used_prompt_tokens ?? 0),
      completionTokens: Number(billingResult.data?.used_completion_tokens ?? 0),
      audioSeconds: Number(billingResult.data?.used_audio_seconds ?? 0),
    },
    byFeature: [...byFeature.values()].sort((a, b) => b.totalTokens - a.totalTokens),
    recent: events.slice(0, 20),
  });
}