"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { signIn } from "../../reducers/userdetailSlice";
import type { AppDispatch } from "../../store";

export const Page = styled.div`
  min-height: 100vh;
  background: #f6f6f6;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 16px;
`;

export const Content = styled.div`
  width: min(420px, 100%);
  text-align: center;
  font-family: 'Roboto', 'Helvetica Neue', Arial, sans-serif;
  color: #5f6368;
`;

export const Logo = styled.div`
  font-size: 34px;
  letter-spacing: -1px;
  margin-bottom: 8px;

  span {
    font-weight: 500;
  }

  .blue {
    color: #4285f4;
  }
  .red {
    color: #ea4335;
  }
  .yellow {
    color: #fbbc05;
  }
  .green {
    color: #34a853;
  }
`;

export const HeroTitle = styled.h1`
  font-size: 28px;
  font-weight: 300;
  margin: 0;
`;

export const HeroSubtitle = styled.p`
  margin: 8px 0 4px;
  color: #5f6368;

  a {
    color: #4285f4;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
`;

export const SubtleText = styled.p`
  margin-bottom: 20px;
  color: #777;
  font-size: 15px;
`;

export const Card = styled.div`
  background: #fff;
  border: 1px solid #dcdcdc;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
  padding: 32px;
  margin-top: 24px;
  text-align: left;
`;

export const Heading = styled.h2`
  margin: 0 0 8px;
  font-size: 20px;
  font-weight: 400;
  color: #5f6368;
  text-align: center;
`;

export const Subtitle = styled.p`
  text-align: center;
  color: #777;
  font-size: 14px;
  margin-bottom: 24px;
`;

export const AvatarCircle = styled.div`
  width: 78px;
  height: 78px;
  border-radius: 50%;
  border: 1px solid #dcdcdc;
  margin: 0 auto 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #fafafa, #f0f0f0);

  span {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    border: 1px solid #d9d9d9;
    background: white;
    position: relative;
  }

  span::after {
    content: '';
    position: absolute;
    bottom: -18px;
    left: 50%;
    transform: translateX(-50%);
    width: 56px;
    height: 32px;
    border: 1px solid #d9d9d9;
    border-radius: 50% / 70% 70% 30% 30%;
    background: white;
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const Label = styled.label`
  font-size: 13px;
  color: #5f6368;
  margin-bottom: 4px;
  display: block;
`;

export const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #c0c0c0;
  border-radius: 2px;
  font-size: 14px;
  color: #202124;
  &:focus {
    outline: none;
    border-color: #4285f4;
    box-shadow: 0 0 0 1px #4285f4 inset;
  }
`;

export const SubmitButton = styled.button`
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 2px;
  background: #4285f4;
  color: white;
  font-size: 15px;
  font-weight: 600;
  margin-top: 8px;
  cursor: pointer;
  transition: background 0.2s ease;
  &:hover {
    background: #3a74d4;
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const FooterText = styled.p`
  margin-top: 24px;
  color: #777;
  font-size: 14px;

  a {
    color: #4285f4;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
`;

export const AccentLink = styled(Link)`
  color: #4285f4;
  font-weight: 500;
  margin-left: 4px;
`;

export const ErrorBanner = styled.div`
  border-radius: 3px;
  background: rgba(234, 67, 53, 0.12);
  color: #c5221f;
  padding: 10px 12px;
  font-size: 13px;
  margin-bottom: 16px;
`;

export const SuccessBanner = styled.div`
  border-radius: 3px;
  background: rgba(52, 168, 83, 0.14);
  color: #137333;
  padding: 10px 12px;
  font-size: 13px;
  margin-bottom: 16px;
`;

export const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  font-size: 13px;
  color: #5f6368;
  margin-bottom: 16px;
`;

const CheckboxRow = styled.div`
  margin-top: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  color: #5f6368;

  label {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  input[type='checkbox'] {
    width: 14px;
    height: 14px;
  }
`;

const NeedHelpLink = styled(Link)`
  color: #4285f4;
  font-size: 13px;
`;

const CreateAccountLink = styled(Link)`
  display: inline-block;
  margin-top: 24px;
  color: #4285f4;
  font-size: 15px;
`;

const IconRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 12px;
`;

const IconBadge = styled.span<{ $color: string }>`
  width: 26px;
  height: 26px;
  border-radius: 4px;
  background: ${({ $color }) => $color};
  color: white;
  font-size: 13px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
`;

const BackControl = styled.button`
  border: none;
  background: transparent;
  color: #4285f4;
  font-size: 14px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;

  &:hover {
    text-decoration: underline;
  }
`;

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [staySignedIn, setStaySignedIn] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => setEmail(event.target.value);
  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => setPassword(event.target.value);
  const handleStaySignedIn = (event: ChangeEvent<HTMLInputElement>) => setStaySignedIn(event.target.checked);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          const sec = parseInt(response.headers.get("Retry-After") || "60", 10);
          throw new Error(`請求過於頻繁，請約 ${sec} 秒後再試`);
        }
        throw new Error(data.error || "Login failed");
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
      <Content>
        <BackControl type="button" onClick={() => router.back()}>
          ← 返回上一頁
        </BackControl>
        <Logo>
          <span className="blue">D</span>
          <span className="red">o</span>
          <span className="yellow">n</span>
          <span className="blue">T</span>
          <span className="green">a</span>
          <span className="red">l</span>
          <span className="orchid">k</span>
        </Logo>
        <HeroTitle>One account. All of Dontalk.</HeroTitle>
        <HeroSubtitle>Sign in with your <a href="https://dontalk.org" target="_blank" rel="noopener noreferrer">Dontalk(.org)</a> Account</HeroSubtitle>

        <Card>
          <AvatarCircle>
            <span />
          </AvatarCircle>

          {error && <ErrorBanner>{error}</ErrorBanner>}
          {success && (
            <SuccessBanner>登入成功，正在前往首頁…</SuccessBanner>
          )}

          <Form onSubmit={handleSubmit}>
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

            <SubmitButton type="submit" disabled={loading || success}>
              {loading ? "登入中…" : success ? "請稍候…" : "登入"}
            </SubmitButton>
          </Form>

          <CheckboxRow>
            <label htmlFor="staySignedIn">
              <input
                id="staySignedIn"
                type="checkbox"
                checked={staySignedIn}
                onChange={handleStaySignedIn}
              />
              保持登入
            </label>
            <NeedHelpLink href="#">需要幫助嗎？</NeedHelpLink>
          </CheckboxRow>
        </Card>

        <CreateAccountLink href="/auth/signup">Create an account</CreateAccountLink>
        <FooterText>Power by <a href="https://dontalk.org" target="_blank" rel="noopener noreferrer">Dontalk(.org)</a> - <a href="https://github.com/infoabcd/Dontalk-uTube-Youtube-2020" target="_blank" rel="noopener noreferrer">uTube</a></FooterText>
      </Content>
    </Page>
  );
}
