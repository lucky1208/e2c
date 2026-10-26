import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { enforceRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "请先登录。" }, { status: 401 });
  const rate = await enforceRateLimit(user.id, "account-upload", 10);
  if (!rate.allowed) return NextResponse.json({ error: "上传太频繁，请稍后再试。" }, { status: rate.configurationError ? 503 : 429 });

  try {
    const form = await request.formData();
    const kind = String(form.get("kind") || "");
    const file = form.get("file");
    if (kind !== "avatar" && kind !== "background") {
      return NextResponse.json({ error: "图片类型不正确。" }, { status: 400 });
    }
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "请选择图片文件。" }, { status: 400 });
    }
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "只支持图片文件。" }, { status: 400 });
    }
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "图片不能超过 5MB。" }, { status: 400 });
    }

    const extension = (file.name.split(".").pop() || file.type.split("/").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 8) || "jpg";
    const path = `${user.id}/${kind}-${Date.now()}.${extension}`;
    const bytes = await file.arrayBuffer();
    const upload = await supabase.storage.from("user-assets").upload(path, bytes, {
      contentType: file.type,
      upsert: true,
    });
    if (upload.error) {
      console.error("asset upload failed", upload.error.message);
      return NextResponse.json({ error: "图片上传失败，请确认已创建 user-assets bucket。" }, { status: 502 });
    }

    const proxyUrl = `/api/assets/${path.split("/").map(encodeURIComponent).join("/")}`;
    return NextResponse.json({ url: proxyUrl });
  } catch (error) {
    console.error("asset upload error", error instanceof Error ? error.message : "unknown");
    return NextResponse.json({ error: "图片上传失败，请稍后重试。" }, { status: 500 });
  }
}