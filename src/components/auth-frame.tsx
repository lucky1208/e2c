"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Headphones, Languages, Mic, Sparkles, Sprout } from "lucide-react";

const WAVE = [34, 58, 42, 76, 52, 88, 63, 45, 72, 55, 84, 40, 66, 80, 49, 69, 44, 86, 57, 74, 47, 68, 43, 82, 53, 71, 46, 78];

export function AuthFrame({ children, variant = "login" }: { children: ReactNode; variant?: "login" | "loading" }) {
  return (
    <main className={`auth-stage auth-stage-${variant}`}>
      <div className="auth-sky" aria-hidden="true">
        <span className="auth-blob b1" />
        <span className="auth-blob b2" />
        <span className="auth-blob b3" />
        <span className="auth-grid" />
        <span className="auth-spark s1" />
        <span className="auth-spark s2" />
        <span className="auth-spark s3" />
        <span className="auth-spark s4" />
        <span className="auth-spark s5" />
        <span className="auth-spark s6" />
      </div>

      <div className="auth-shell">
        <section className="auth-showcase">
          <span className="auth-halo" aria-hidden="true" />
          <span className="auth-watermark" aria-hidden="true">译</span>

          <div className="auth-showcase-top">
            <Link href="/" className="auth-brand" aria-label="English Mate 首页">
              <span className="auth-brand-mark"><Sprout size={20} /></span>
              <span className="auth-brand-text">
                <strong>English Mate</strong>
                <span>英语实时传译 · AI 口语教练</span>
              </span>
            </Link>
            <span className="auth-live-pill"><i /> LIVE · 实时语音在线</span>
          </div>

          <div className="auth-copy">
            <span className="auth-overline"><Sparkles size={13} /> WELCOME TO ENGLISH MATE</span>
            <h1 className="auth-title">
              欢迎加入
              <span className="auth-title-art">“英语实时传译”</span>
            </h1>
            <p className="auth-title-en">Speak with confidence. Be understood.</p>
            <p className="auth-sub">让每一次开口都被听见，让每一句表达都更接近你想成为的自己。AI 实时陪练、即时纠错与专属学习档案，陪你从“敢说”到“说得好”。</p>
            <div className="auth-features">
              <span><Mic size={14} /> 实时语音对话</span>
              <span><Sparkles size={14} /> 智能纠错反馈</span>
              <span><Headphones size={14} /> 沉浸式练习</span>
            </div>
          </div>

          <div className="auth-voice-card" aria-hidden="true">
            <div className="auth-voice-top">
              <span className="auth-voice-live"><i /> LIVE</span>
              <span>Real-time conversation</span>
              <span className="auth-voice-time">00:24</span>
            </div>
            <div className="auth-wave">
              {WAVE.map((height, index) => (
                <i key={`${index}-${height}`} style={{ height: `${height}%`, animationDelay: `${index * 0.055}s` }} />
              ))}
            </div>
            <div className="auth-chat">
              <div className="auth-chat-row">
                <span className="auth-chat-avatar">M</span>
                <p>Hey! Ready to practice your English today?</p>
              </div>
              <div className="auth-chat-row me">
                <p>I want to sound more natural when I speak.</p>
                <span className="auth-chat-avatar me">你</span>
              </div>
            </div>
            <div className="auth-voice-foot"><Languages size={13} /> English · 中文实时提示</div>
          </div>
        </section>

        <section className="auth-panel">
          <div className="auth-panel-inner">{children}</div>
        </section>
      </div>
    </main>
  );
}