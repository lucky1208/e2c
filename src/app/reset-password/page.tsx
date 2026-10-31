"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { ArrowRight, KeyRound, LockKeyhole, ShieldCheck } from "lucide-react";
import { AuthFrame } from "@/components/auth-frame";

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
    <AuthFrame>
      <section className="auth-card auth-card-glass">
        <div className="auth-card-top">
          <span className="auth-card-eyebrow"><span className="auth-card-pulse" /> ACCOUNT RECOVERY</span>
          <span className="auth-card-secure"><ShieldCheck size={13} /> 安全连接</span>
        </div>

        <h1 className="auth-card-title" style={{ marginTop: 24 }}>
          {message ? "密码已更新" : !checking && !valid ? "重置链接已失效" : "设置新密码"}
        </h1>

        {checking && <p className="auth-card-lede">正在验证重置链接…</p>}

        {!checking && !valid && (
          <>
            <p className="auth-card-lede">重置链接无效或已过期，请重新申请。</p>
            <Link className="auth-submit" href="/login">
              返回登录
              <ArrowRight size={16} />
            </Link>
          </>
        )}

        {!checking && valid && !message && (
          <form onSubmit={submit} className="auth-form">
            <p className="auth-card-lede">请输入一个新的登录密码。</p>
            <div className="auth-field">
              <label className="auth-field-label" htmlFor="newPassword">新密码</label>
              <div className="auth-input-wrap">
                <LockKeyhole size={16} className="auth-input-icon" />
                <input
                  id="newPassword"
                  className="auth-input auth-input-solo"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="至少 8 位"
                />
              </div>
            </div>
            <div className="auth-field">
              <label className="auth-field-label" htmlFor="confirmPassword">确认新密码</label>
              <div className="auth-input-wrap">
                <LockKeyhole size={16} className="auth-input-icon" />
                <input
                  id="confirmPassword"
                  className="auth-input auth-input-solo"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="再输入一次"
                />
              </div>
            </div>
            <button className="auth-submit" type="submit" disabled={busy} aria-busy={busy}>
              <KeyRound size={16} />
              {busy ? "正在更新…" : "更新密码"}
            </button>
          </form>
        )}

        {error && <p className="auth-message auth-message-error" role="alert">{error}</p>}

        {message && (
          <>
            <p className="auth-message auth-message-success" role="status">{message}现在可以继续使用你的账户。</p>
            <Link className="auth-submit" href="/">
              进入应用
              <ArrowRight size={16} />
            </Link>
          </>
        )}

        {!checking && valid && !message && (
          <p className="auth-switch">
            <Link href="/login" className="auth-link">返回登录</Link>
          </p>
        )}
      </section>
    </AuthFrame>
  );
}