"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Sprout } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/account/me", { cache: "no-store" })
      .then((response) => {
        if (response.ok) router.replace("/");
      })
      .catch(() => {
        // The form will show any configuration error.
      });
  }, [router]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    setError("");
    try {
      const endpoint = mode === "signup" ? "/api/auth/signup" : "/api/auth/login";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mode === "signup" ? { email, password, displayName } : { email, password }),
      });
      const data = (await response.json().catch(() => ({}))) as { error?: string; needsConfirmation?: boolean };
      if (!response.ok) throw new Error(data.error || "操作失败，请稍后重试。");
      if (data.needsConfirmation) {
        setMessage("注册成功。请前往邮箱点击确认链接，确认后会自动返回登录。");
        setMode("signin");
      } else {
        router.replace("/");
        router.refresh();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "操作失败，请检查邮箱、密码和 Supabase 配置。");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-wrap">
      <section className="auth-card">
        <div className="brand" style={{ padding: 0 }}>
          <span className="brand-mark"><Sprout size={18} /></span>
          <span>English Mate</span>
        </div>

        <div className="auth-tabs">
          <button className={mode === "signin" ? "active" : ""} type="button" onClick={() => { setMode("signin"); setError(""); setMessage(""); }}>登录</button>
          <button className={mode === "signup" ? "active" : ""} type="button" onClick={() => { setMode("signup"); setError(""); setMessage(""); }}>注册</button>
        </div>

        <h1 className="page-heading" style={{ fontSize: 27, marginTop: 22 }}>
          {mode === "signin" ? "欢迎回来" : "创建你的账户"}
        </h1>
        <p className="page-lede" style={{ marginBottom: 20 }}>
          {mode === "signin" ? "登录后继续你的英语练习和历史记录。" : "每个账户都有独立的学习记录、错题和词汇。"}
        </p>

        <form onSubmit={submit}>
          {mode === "signup" && (
            <>
              <label className="field-label" htmlFor="displayName">你的名字</label>
              <input id="displayName" className="field" autoComplete="nickname" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="怎么称呼你？" maxLength={60} />
            </>
          )}
          <label className="field-label" htmlFor="email">邮箱</label>
          <input id="email" className="field" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          <label className="field-label" htmlFor="password">密码</label>
          <input id="password" className="field" type="password" autoComplete={mode === "signin" ? "current-password" : "new-password"} minLength={8} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="至少 8 位" />
          <button className="btn btn-primary" style={{ width: "100%", marginTop: 4 }} disabled={busy}>
            {busy ? "请稍候…" : mode === "signin" ? "登录" : "创建账户"}
            <ArrowRight size={15} />
          </button>
        </form>

        {error && <p className="error-text">{error}</p>}
        {message && <p className="success-text">{message}</p>}

        <p className="inline-muted" style={{ marginTop: 18 }}>
          {mode === "signin" ? "还没有账户？" : "已经有账户？"}
          <button className="auth-link" type="button" onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(""); setMessage(""); }}>
            {mode === "signin" ? "免费注册" : "返回登录"}
          </button>
        </p>
        <p className="inline-muted" style={{ marginTop: 10 }}>
          继续使用代表你同意 <Link href="/terms" className="auth-link">服务条款</Link> 和 <Link href="/privacy" className="auth-link">隐私政策</Link>。
        </p>
      </section>
    </main>
  );
}