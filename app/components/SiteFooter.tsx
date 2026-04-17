"use client";

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
`;

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <Footer>
      <FooterInner>
        <span>版權：Copyright © {year} Dontalk-uTube. All Rights Reserved.</span>
      </FooterInner>
    </Footer>
  );
}
