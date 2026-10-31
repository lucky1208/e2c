"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { ArrowRight, KeyRound, Sprout } from "lucide-react";

export default function ResetPasswordPage() {
  const [checking, setChecking] = useState(true);
  const [valid, setValid] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/account/me", { cache: "no-store" })
      .then((response) => setValid(response.ok))
      .catch(() => setValid(false))
      .finally(() => setChecking(false));
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");
    if (password.length < 8) {
      setError("密码至少需要 8 位。");
      return;
    }
    if (password !== confirmPassword) {
      setError("两次输入的密码不一致。");
      return;
    }
    setBusy(true);
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) throw new Error(data.error || "密码更新失败，请重新申请重置邮件。");
      setMessage("密码已更新。");
      setPassword("");
      setConfirmPassword("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "密码更新失败，请重新申请重置邮件。");
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

        <h1 className="page-heading" style={{ fontSize: 27, marginTop: 22 }}>
          {message ? "密码已更新" : "设置新密码"}
        </h1>

        {checking && <p className="page-lede">正在验证重置链接…</p>}

        {!checking && !valid && (
          <>
            <p className="page-lede">重置链接无效或已过期，请重新申请。</p>
            <Link className="btn btn-primary" href="/login" style={{ width: "100%", marginTop: 8 }}>
              返回登录
              <ArrowRight size={15} />
            </Link>
          </>
        )}

        {!checking && valid && !message && (
          <form onSubmit={submit}>
            <p className="page-lede" style={{ marginBottom: 18 }}>请输入一个新的登录密码。</p>
            <label className="field-label" htmlFor="newPassword">新密码</label>
            <input id="newPassword" className="field" type="password" autoComplete="new-password" minLength={8} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="至少 8 位" />
            <label className="field-label" htmlFor="confirmPassword">确认新密码</label>
            <input id="confirmPassword" className="field" type="password" autoComplete="new-password" minLength={8} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="再输入一次" />
            <button className="btn btn-primary" style={{ width: "100%", marginTop: 8 }} disabled={busy}>
              <KeyRound size={15} />
              {busy ? "正在更新…" : "更新密码"}
            </button>
          </form>
        )}

        {error && <p className="error-text">{error}</p>}
        {message && (
          <>
            <p className="success-text">{message}现在可以继续使用你的账户。</p>
            <Link className="btn btn-primary" href="/" style={{ width: "100%", marginTop: 8 }}>
              进入应用
              <ArrowRight size={15} />
            </Link>
          </>
        )}

        <p className="inline-muted" style={{ marginTop: 18 }}>
          <Link href="/login" className="auth-link">返回登录</Link>
        </p>
      </section>
    </main>
  );
}