import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const ResetSchema = z.object({
  email: z.string().trim().email().max(320),
});

export async function POST(request: Request) {
  const input = ResetSchema.safeParse(await request.json().catch(() => null));
  if (!input.success) return NextResponse.json({ error: "请输入有效的邮箱地址。" }, { status: 400 });

  try {
    const origin = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/+$/, "") || new URL(request.url).origin;
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.resetPasswordForEmail(input.data.email, {
      redirectTo: `${origin}/auth/confirm?next=/reset-password`,
    });
    if (error) {
      console.error("password reset email failed", error.message);
    }
  } catch (error) {
    console.error("password reset request failed", error instanceof Error ? error.message : "unknown");
  }

  return NextResponse.json({ ok: true });
}