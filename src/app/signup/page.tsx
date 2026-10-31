import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";
import { AuthFrame } from "@/components/auth-frame";

export const metadata: Metadata = {
  title: "注册 · English Mate",
  description: "创建 English Mate 账户，开启 AI 实时英语对话练习。",
};

export default function SignupPage() {
  return (
    <AuthFrame>
      <AuthForm initialMode="signup" />
    </AuthFrame>
  );
}