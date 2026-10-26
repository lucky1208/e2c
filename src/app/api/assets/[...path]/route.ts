import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET(_request: Request, context: { params: Promise<{ path: string[] }> }) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "请先登录。" }, { status: 401 });

  const { path } = await context.params;
  const objectPath = path.map((part) => decodeURIComponent(part)).join("/");
  if (!objectPath || objectPath.includes("..")) {
    return NextResponse.json({ error: "图片路径不正确。" }, { status: 400 });
  }

  const { data, error } = await supabase.storage.from("user-assets").download(objectPath);
  if (error || !data) {
    return NextResponse.json({ error: "图片不存在。" }, { status: 404 });
  }

  return new Response(data, {
    status: 200,
    headers: {
      "Content-Type": data.type || "image/jpeg",
      "Cache-Control": "private, max-age=86400",
    },
  });
}