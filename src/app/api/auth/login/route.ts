import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const LoginSchema = z.object({
  email: z.string().trim().email().max(320),
  password: z.string().min(8).max(200),
});

export async function POST(request: Request) {
  const input = LoginSchema.safeParse(await request.json());
  if (!input.success) return NextResponse.json({ error: "邮箱或密码格式不正确。" }, { status: 400 });

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: input.data.email,
      password: input.data.password,
    });
    if (error) return NextResponse.json({ error: "邮箱或密码不正确，或邮箱尚未确认。" }, { status: 401 });
    if (!data.user) return NextResponse.json({ error: "登录失败，请稍后重试。" }, { status: 401 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("auth login failed", error instanceof Error ? error.message : "unknown");
    return NextResponse.json({ error: "登录服务暂时不可用，请检查 Supabase 配置。" }, { status: 503 });
  }
}