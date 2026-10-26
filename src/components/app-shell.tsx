"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, BookMarked, BookOpen, LogOut, MessageCircle, RefreshCcw, Settings, Sprout } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const nav = [
  { href: "/", label: "练习对话", icon: MessageCircle },
  { href: "/review", label: "今日复习", icon: RefreshCcw },
  { href: "/mistakes", label: "错题本", icon: BookMarked },
  { href: "/vocabulary", label: "词汇本", icon: BookOpen },
  { href: "/progress", label: "学习进度", icon: BarChart3 },
  { href: "/settings", label: "设置与数据", icon: Settings },
];

type Account = {
  id: string;
  email: string | null;
  displayName: string;
  avatarUrl: string | null;
  usedTokens: number;
  usedAudioSeconds: number;
  balanceCents: number;
};

function accountInitial(account: Account | null) {
  const source = account?.displayName || account?.email || "U";
  return source.trim().charAt(0).toUpperCase() || "U";
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const [authReady, setAuthReady] = useState(false);
  const [account, setAccount] = useState<Account | null>(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const [accountError, setAccountError] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  const loadAccount = useCallback(async () => {
    try {
      const response = await fetch("/api/account/me", { cache: "no-store" });
      if (response.status === 401) {
        router.replace("/login");
        return false;
      }
      if (!response.ok) {
        setAccountError("无法读取账户信息，请检查 Supabase 配置。");
        return false;
      }
      const data = (await response.json()) as {
        user: { id: string; email: string | null };
        profile?: { display_name?: string; avatar_url?: string | null } | null;
        billing?: { used_tokens?: number; used_audio_seconds?: number; balance_cents?: number } | null;
      };
      setAccount({
        id: data.user.id,
        email: data.user.email,
        displayName: data.profile?.display_name ?? "",
        avatarUrl: data.profile?.avatar_url ?? null,
        usedTokens: Number(data.billing?.used_tokens ?? 0),
        usedAudioSeconds: Number(data.billing?.used_audio_seconds ?? 0),
        balanceCents: Number(data.billing?.balance_cents ?? 0),
      });
      setAccountError("");
      setAuthReady(true);
      return true;
    } catch (error) {
      setAccountError(error instanceof Error ? error.message : "无法读取账户信息");
      return false;
    }
  }, [router]);

  useEffect(() => { void loadAccount(); }, [loadAccount]);

  useEffect(() => {
    const refresh = () => { void loadAccount(); };
    window.addEventListener("english-mate:account-updated", refresh);
    return () => window.removeEventListener("english-mate:account-updated", refresh);
  }, [loadAccount]);

  useEffect(() => {
    function close(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) setAccountOpen(false);
    }
    if (!accountOpen) return;
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [accountOpen]);

  async function signOut() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // The login page can explain configuration problems.
    }
    router.replace("/login");
    router.refresh();
  }

  const title = nav.find((item) => item.href === path || (item.href !== "/" && path.startsWith(`${item.href}/`)))?.label ?? "English Mate";

  if (!authReady) {
    return (
      <div className="auth-wrap">
        <div className="auth-card">
          <div className="brand"><span className="brand-mark"><Sprout size={18} /></span><span>English Mate</span></div>
          <p className="page-lede" style={{ marginTop: 20 }}>{accountError || "正在加载账户…"}</p>
          <Link className="btn btn-primary" style={{ marginTop: 16 }} href="/login">前往登录</Link>
        </div>
      </div>
    );
  }

  return <div className="app-shell">
    <aside className="sidebar">
      <Link href="/" className="brand"><span className="brand-mark"><Sprout size={18} /></span><span className="brand-text">English Mate</span></Link>
      <div className="nav-group">{nav.map((item) => { const Icon = item.icon; const active = path === item.href; return <Link className={`nav-link ${active ? "active" : ""}`} key={item.href} href={item.href} title={item.label}><Icon size={18}/><span className="nav-text">{item.label}</span></Link>; })}</div>
    </aside>
    <div className="main-column">
      <header className="topbar">
        <div className="topbar-title">{title}</div>
        <div className="account-wrap" ref={menuRef}>
          <button className="account-avatar" type="button" aria-label="账户信息" onClick={() => { setAccountOpen((open) => !open); void loadAccount(); }}>
            {account?.avatarUrl
              ? <span className="account-avatar-image" style={{ backgroundImage: `url("${account.avatarUrl}")` }} />
              : <span>{accountInitial(account)}</span>}
          </button>
          {accountOpen && (
            <div className="account-menu">
              <div className="account-email">{account?.email || "已登录"}</div>
              <div className="account-row"><span>已用流量</span><strong>{account ? account.usedTokens.toLocaleString() : "—"} tokens</strong></div>
              <div className="account-row"><span>充值余额</span><strong>{account ? `¥${(account.balanceCents / 100).toFixed(2)}` : "—"}</strong></div>
              {account?.usedAudioSeconds ? <div className="account-row"><span>语音时长</span><strong>{Math.round(account.usedAudioSeconds / 60)} 分钟</strong></div> : null}
              <div className="account-actions">
                <button className="btn btn-small" type="button" disabled title="在线充值即将开放">充值</button>
                <Link className="btn btn-small" href="/settings" onClick={() => setAccountOpen(false)}>数据与设置</Link>
                <button className="btn btn-small" type="button" onClick={() => void signOut()}><LogOut size={13} />退出</button>
              </div>
            </div>
          )}
        </div>
      </header>
      {children}
    </div>
  </div>;
}