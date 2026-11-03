import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { enforceRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const VoiceUsageSchema = z.object({
  conversationId: z.string().uuid().optional(),
  promptTokens: z.number().int().min(0).max(10_000_000),
  completionTokens: z.number().int().min(0).max(10_000_000),
  totalTokens: z.number().int().min(0).max(20_000_000),
  audioSeconds: z.number().int().min(0).max(86_400).default(0),
});

export async function POST(request: Request) {
  const input = VoiceUsageSchema.safeParse(await request.json().catch(() => null));
  if (!input.success) return NextResponse.json({ error: "语音用量参数不正确。" }, { status: 400 });

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "请先登录。" }, { status: 401 });

  const rate = await enforceRateLimit(user.id, "voice-usage", 60);
  if (!rate.allowed) return NextResponse.json({ error: "请求太频繁。" }, { status: rate.configurationError ? 503 : 429 });

  if (input.data.conversationId) {
    const { data: conversation } = await supabase
      .from("conversations")
      .select("id")
      .eq("id", input.data.conversationId)
      .eq("user_id", user.id)
      .maybeSingle();
    if (!conversation) return NextResponse.json({ error: "会话不存在或无权访问。" }, { status: 404 });
  }

  const { error } = await supabase.rpc("record_usage_breakdown", {
    p_feature: "voice",
    p_model: process.env.DASHSCOPE_REALTIME_MODEL?.trim() || "qwen-audio-3.1-realtime-plus",
    p_prompt_tokens: input.data.promptTokens,
    p_completion_tokens: input.data.completionTokens,
    p_total_tokens: input.data.totalTokens,
    p_audio_seconds: input.data.audioSeconds,
  });
  if (error) {
    console.error("voice usage tracking failed", error.message);
    return NextResponse.json({ error: "语音用量记录失败。" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}