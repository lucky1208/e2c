import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { enforceRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "请先登录。" }, { status: 401 });
  const rate = await enforceRateLimit(user.id, "account-me", 60);
  if (!rate.allowed) return NextResponse.json({ error: "请求太频繁。" }, { status: rate.configurationError ? 503 : 429 });

  const [profileResult, billingResult] = await Promise.all([
    supabase
      .from("profiles")
      .select("display_name,avatar_url,chat_background_url")
      .eq("user_id", user.id)
      .maybeSingle(),
    supabase
      .from("billing_accounts")
      .select("balance_cents,used_tokens,used_audio_seconds")
      .eq("user_id", user.id)
      .maybeSingle(),
  ]);

  return NextResponse.json({
    user: { id: user.id, email: user.email ?? null },
    profile: profileResult.data ?? { display_name: "", avatar_url: null, chat_background_url: null },
    billing: billingResult.data ?? { balance_cents: 0, used_tokens: 0, used_audio_seconds: 0 },
  });
}