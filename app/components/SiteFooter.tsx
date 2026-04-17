"use client";

import Link from "next/link";
import styled from "styled-components";

const Footer = styled.footer`
  margin-top: 32px;
  border-top: 1px solid ${(props) => props.theme.divider};
  background: ${(props) => props.theme.barBg};
  color: ${(props) => props.theme.secondaryColor};
`;

const FooterInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px 18px;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  line-height: 1.6;

  a {
    color: ${(props) => props.theme.toggle};
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
`;

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <Footer>
      <FooterInner>
        <span>
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
        <span>版權：Copyright © {year} Dontalk-uTube. All Rights Reserved.</span>
        <span>
          官方站點：
          <Link href="https://dontalk.org" target="_blank" rel="noreferrer">
            Dontalk(.org)
          </Link>
        </span>
      </FooterInner>
    </Footer>
  );
}
