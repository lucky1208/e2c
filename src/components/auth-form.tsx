"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { ArrowRight, BookOpen, Eye, EyeOff, LoaderCircle, LockKeyhole, Mail, MessageCircle, ShieldCheck, Sparkles, UserRound } from "lucide-react";

type Mode = "signin" | "signup" | "reset";

export function AuthForm({ initialMode = "signin" }: { initialMode?: Mode }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>(initialMode);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    fetch("/api/account/me", { cache: "no-store" })
      .then((response) => {
        if (response.ok) router.replace("/");
      })
      .catch(() => {
        // The form will show any configuration error.
      });
  }, [router]);

  function switchMode(next: Mode) {
    setMode(next);
    setError("");
    setMessage("");
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    setError("");
    try {
      if (mode === "reset") {
        const response = await fetch("/api/auth/reset", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = (await response.json().catch(() => ({}))) as { error?: string };
        if (!response.ok) throw new Error(data.error || "重置邮件发送失败，请稍后重试。");
        setMessage("如果这个邮箱已经注册，重置密码邮件会尽快送达。若长时间收不到，说明邮件服务尚未配置；登录后可在“设置”中直接修改密码。");
        return;
      }
      const endpoint = mode === "signup" ? "/api/auth/signup" : "/api/auth/login";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mode === "signup" ? { email, password, displayName } : { email, password }),
      });
      const data = (await response.json().catch(() => ({}))) as { error?: string; needsConfirmation?: boolean };
      if (!response.ok) throw new Error(data.error || "操作失败，请稍后重试。");
      if (data.needsConfirmation) {
        setMode("signin");
        setMessage("注册成功。请前往邮箱点击确认链接，确认后会自动返回登录。");
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

  const isSignin = mode === "signin";
  const isSignup = mode === "signup";
  const isReset = mode === "reset";

  const heading = isSignin ? "欢迎回来" : isSignup ? "创建你的学习账户" : "重置密码";
  const lede = isSignin
    ? "登录后继续你的英语练习，历史记录、错题与词汇都会在这里等你。"
    : isSignup
      ? "注册后即可开启实时语音对话，每一次练习都会沉淀为你的专属学习档案。"
      : "输入注册邮箱，我们会发送一封重置密码的邮件。";

  return (
    <section className="auth-card auth-card-glass">
      <div className="auth-card-top">
        <span className="auth-card-eyebrow">
          <span className="auth-card-pulse" />
          {isReset ? "ACCOUNT RECOVERY" : "ACCOUNT ACCESS"}
        </span>
        <span className="auth-card-secure"><ShieldCheck size={13} /> 安全连接</span>
      </div>

      <nav className="auth-tabs" aria-label="账户操作">
        <Link
          href="/login"
          className={!isSignup ? "active" : ""}
          aria-current={!isSignup ? "page" : undefined}
          onClick={() => switchMode("signin")}
        >
          登录
        </Link>
        <Link
          href="/signup"
          className={isSignup ? "active" : ""}
          aria-current={isSignup ? "page" : undefined}
          onClick={() => switchMode("signup")}
        >
          注册
        </Link>
      </nav>

      <h1 className="auth-card-title">{heading}</h1>
      <p className="auth-card-lede">{lede}</p>

      <form onSubmit={submit} className="auth-form">
        {isSignup && (
          <div className="auth-field">
            <label className="auth-field-label" htmlFor="displayName">你的名字</label>
            <div className="auth-input-wrap">
              <UserRound size={16} className="auth-input-icon" />
              <input
                id="displayName"
                className="auth-input"
                autoComplete="nickname"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="怎么称呼你？"
                maxLength={60}
              />
            </div>
          </div>
        )}

        <div className="auth-field">
          <label className="auth-field-label" htmlFor="email">邮箱</label>
          <div className="auth-input-wrap">
            <Mail size={16} className="auth-input-icon" />
            <input
              id="email"
              className="auth-input"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
        </div>

        {!isReset && (
          <div className="auth-field">
            <label className="auth-field-label" htmlFor="password">密码</label>
            <div className="auth-input-wrap">
              <LockKeyhole size={16} className="auth-input-icon" />
              <input
                id="password"
                className="auth-input"
                type={showPassword ? "text" : "password"}
                autoComplete={isSignin ? "current-password" : "new-password"}
                minLength={8}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="至少 8 位"
                aria-describedby={isSignup ? "passwordHint" : undefined}
              />
              <button
                type="button"
                className="auth-input-action"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? "隐藏密码" : "显示密码"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        )}

        {isSignup && <p className="auth-hint" id="passwordHint">密码至少 8 位，建议包含字母与数字。</p>}

        {isSignin && (
          <div className="auth-row-end">
            <button className="auth-link" type="button" onClick={() => switchMode("reset")}>
              忘记密码？
            </button>
          </div>
        )}

        <button className="auth-submit" type="submit" disabled={busy} aria-busy={busy}>
          {busy ? (
            <>
              <LoaderCircle size={16} className="auth-spin" />
              请稍候…
            </>
          ) : (
            <>
              {isSignin ? "登录" : isSignup ? "创建账户" : "发送重置邮件"}
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      {error && <p className="auth-message auth-message-error" role="alert">{error}</p>}
      {message && <p className="auth-message auth-message-success" role="status">{message}</p>}

      <p className="auth-switch">
        {isReset ? "想起密码了？" : isSignin ? "还没有账户？" : "已经有账户？"}
        {isReset ? (
          <button className="auth-link" type="button" onClick={() => switchMode("signin")}>返回登录</button>
        ) : isSignin ? (
          <Link href="/signup" className="auth-link">免费注册</Link>
        ) : (
          <Link href="/login" className="auth-link">返回登录</Link>
        )}
      </p>

      <p className="auth-legal">
        继续使用代表你同意 <Link href="/terms">服务条款</Link> 和 <Link href="/privacy">隐私政策</Link>。
      </p>

      <div className="auth-trust" aria-hidden="true">
        <span><MessageCircle size={13} /> 实时语音</span>
        <span><Sparkles size={13} /> 智能纠错</span>
        <span><BookOpen size={13} /> 学习档案</span>
      </div>
    </section>
  );
}