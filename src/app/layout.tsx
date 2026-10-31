import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "English Mate · 英语实时传译",
  description: "AI 实时英语口语教练：实时语音对话、智能纠错、词汇复习与专属学习档案。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}