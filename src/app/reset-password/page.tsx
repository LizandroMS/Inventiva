"use client";
import ResetPasswordForm from "./ResetPasswordForm";

export default function ResetPasswordPage({ searchParams }: { searchParams: { token?: string } }) {
  const token = searchParams?.token || "";

  return <ResetPasswordForm token={token} />;
}
