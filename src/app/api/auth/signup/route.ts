import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const SignupSchema = z.object({
  email: z.string().trim().email().max(320),
  password: z.string().min(8).max(200),
  displayName: z.string().trim().max(60).default(""),
});

export async function POST(request: Request) {
  const input = SignupSchema.safeParse(await request.json());
  if (!input.success) return NextResponse.json({ error: "注册信息格式不正确，密码至少 8 位。" }, { status: 400 });

  try {
    const origin = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/+$/, "") || new URL(request.url).origin;
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.signUp({
      email: input.data.email,
      password: input.data.password,
      options: {
        data: { display_name: input.data.displayName.trim() },
        emailRedirectTo: `${origin}/auth/confirm?next=/`,
      },
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true, needsConfirmation: !data.session });
  } catch (error) {
    console.error("auth signup failed", error instanceof Error ? error.message : "unknown");
    return NextResponse.json({ error: "注册服务暂时不可用，请检查 Supabase 配置。" }, { status: 503 });
  }
}