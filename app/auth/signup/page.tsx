"use client";

import { ChangeEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

import {
  Page,
  Card,
  Heading,
  Subtitle,
  Form,
  Label,
  Input,
  SubmitButton,
  FooterText,
  AccentLink,
  ErrorBanner,
  SuccessBanner,
  BackLink,
} from "../signin/page";
import { signIn } from "../../reducers/userdetailSlice";
import type { AppDispatch } from "../../store";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handleDisplayNameChange = (event: ChangeEvent<HTMLInputElement>) =>
    setDisplayName(event.target.value);
  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => setEmail(event.target.value);
  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => setPassword(event.target.value);
  const handleInviteChange = (event: ChangeEvent<HTMLInputElement>) =>
    setInviteCode(event.target.value);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password, displayName, inviteCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          const sec = parseInt(response.headers.get("Retry-After") || "60", 10);
          throw new Error(`請求過於頻繁，請約 ${sec} 秒後再試`);
        }
        throw new Error(data.error || "Registration failed");
      }

      if (!data.user) {
        throw new Error("伺服器未回傳使用者資料");
      }

      dispatch(signIn({ profile: data.user }));
      setSuccess(true);
      setLoading(false);

      window.setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 650);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setLoading(false);
    }
  };

  return (
    <Page>
      <Card>
        <BackLink href="/">← 返回首頁</BackLink>
        <Heading>創建帳號</Heading>
        <Subtitle>開始上載影片、訂閱頻道並建立個人化體驗。</Subtitle>

        {error && <ErrorBanner>{error}</ErrorBanner>}
        {success && (
          <SuccessBanner>註冊成功，已自動登入，正在前往首頁…</SuccessBanner>
        )}

        <Form onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              type="text"
              value={displayName}
              onChange={handleDisplayNameChange}
              placeholder="Display Name"
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Email"
              required
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Password"
              required
            />
          </div>

          <div>
            <Label htmlFor="inviteCode">Invite Code</Label>
            <Input
              id="inviteCode"
              type="text"
              value={inviteCode}
              onChange={handleInviteChange}
              placeholder="聯繫Dontalk(.org)獲取"
              autoComplete="off"
            />
          </div>

          <SubmitButton type="submit" disabled={loading || success}>
            {loading ? "建立中…" : success ? "請稍候…" : "建立帳號"}
          </SubmitButton>
        </Form>

        <FooterText>
          已經有帳號了？
          <AccentLink href="/auth/signin">前往登入</AccentLink>
        </FooterText>
      </Card>
    </Page>
  );
}
