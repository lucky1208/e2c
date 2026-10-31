import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const PasswordSchema = z.object({
  password: z.string().min(8).max(200),
});

export async function POST(request: Request) {
  const input = PasswordSchema.safeParse(await request.json().catch(() => null));
  if (!input.success) return NextResponse.json({ error: "密码至少需要 8 位。" }, { status: 400 });

  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "重置链接已失效，请重新申请。" }, { status: 401 });

    const { error } = await supabase.auth.updateUser({ password: input.data.password });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("password update failed", error instanceof Error ? error.message : "unknown");
    return NextResponse.json({ error: "密码更新服务暂时不可用。" }, { status: 503 });
  }
}