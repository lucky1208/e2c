import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";
import { AuthFrame } from "@/components/auth-frame";

export const metadata: Metadata = {
  title: "登录 · English Mate",
  description: "登录 English Mate，继续你的英语实时对话练习。",
};

export default function LoginPage() {
  return (
    <AuthFrame>
      <AuthForm initialMode="signin" />
    </AuthFrame>
  );
}