"use client";

import React from 'react';
import styled from "styled-components";
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import Link from 'next/link';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: calc(100vh - 56px);
`;

const MainContainer = styled.main`
  border-top: 1px solid ${(props: any) => props.theme.divider};
  margin-top: 56px;
  margin-left: 240px;
  width: calc(100vw - 240px);

  .info-wrap {
    padding: 2em;
  }

  @media screen and (max-width: 1024px) {
    margin-left: 0;
    width: 100vw;

    .info-wrap {
      padding: 2em;
    }

    .info-wrap img {
      display: block;
      margin: 0 auto;
    }
  }

  .info-wrap img {
    width: min(60vw, 280px);
    height: auto;
  }

  .info-wrap h1 {
    font-size: 24px;
    font-weight: 400;
    margin-top: 16px;
  }

  .info-wrap p {
    font-size: 14px;
  }

  .info-wrap a {
    color: ${(props) => props.theme.toggle};
    text-decoration: none;
  }

  .info-wrap a:hover {
    text-decoration: underline;
  }
`;

export default function AboutPage() {
  return (
    <div>
      <Topbar />
      <Sidebar />
      <MainContainer>
        <Wrapper>
          <div className="info-wrap">
            <img src="/assets/LOGO.png" alt="Dontalk-uTube" />
            <h1>Dontalk(.org) - uTube</h1>
            <p>
                Dontalk(.org) - uTube 是一個影片分享平台，受邀用戶可以上載與討論影片，支援 HLS 多碼率播放、頻道與留言。感謝你的訪問與觀看。
            </p>
            <br />
            <span>
              官方站點：
              <Link href="https://dontalk.org" target="_blank" rel="noreferrer">Dontalk(.org)</Link>
              <br />
              原項目倉庫：
              <Link href="https://github.com/DUO-1080/utube/" target="_blank" rel="noreferrer">
                DUO-1080/utube
              </Link>
              <br />
              本項目倉庫：
              <Link href="https://github.com/infoabcd/Dontalk-uTube-Youtube-2020" target="_blank" rel="noreferrer">
                Dontalk(.org) - uTube
              </Link>
            </span>
          </div>
        </Wrapper>
      </MainContainer>
    </div>
  );
}