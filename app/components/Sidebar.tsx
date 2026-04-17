'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styled from 'styled-components';
import useUser from '../hooks/useUser';
import { useAppDispatch, useAppSelector } from '../hooks';
import { closeSidebar } from '../reducers/sidebarSlice';
import {
  HistoryIcon,
  HomeIcon,
  LibraryIcon,
  NavLikeIcon,
  SubscriptionIcon,
  TrendingIcon,
  VideoIcon,
  InfoIcon
} from './Icons';
import NavItem from './NavItem';
import SignInButton from './SignInButton';
import SubscribedChannels from './SubscribedChannels';

const Wrapper = styled.aside<{ $open: boolean }>`
  position: fixed;
  top: 56px;
  bottom: 0;
  left: 0;
  background-color: ${(props) => props.theme.barBg};
  width: 240px;
  display: flex;
  flex-direction: column;
  overflow: auto;

  .items {
    display: flex;
    flex-direction: column;
    padding: 12px 0;

    .items-section {
      height: 0;
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid ${(props) => props.theme.divider};
    }
  }

  a:hover {
    background-color: ${(props) => props.theme.itemHover};
  }

  .subscriptions {
    padding: 8px 24px;
    font-weight: normal;
    font-size: 14px;
    color: ${(props) => props.theme.secondaryColor};
  }

  .sign-in-msg {
    padding: 0 24px;

    .msg {
      color: #030303;
      font-size: 14px;
      margin: 10px 0;
    }
  }

  @media screen and (max-width: 1024px) {
    width: min(82vw, 320px);
    z-index: 2200;
    box-shadow: rgba(15, 23, 42, 0.28) 0 10px 28px;
    transform: translateX(${(props) => (props.$open ? '0' : '-105%')});
    transition: transform 0.2s ease;
  }
`;

const Backdrop = styled.div<{ $open: boolean }>`
  display: none;

  @media screen and (max-width: 1024px) {
    display: ${(props) => (props.$open ? 'block' : 'none')};
    position: fixed;
    inset: 56px 0 0 0;
    z-index: 2100;
    background: rgba(15, 23, 42, 0.46);
  }
`;

const Sidebar = () => {
  const { userprofile } = useUser();
  const uid = userprofile?.uid;
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.sidebar.sidebar);

  const closeMobileSidebar = () => {
    if (typeof window !== 'undefined' && window.innerWidth <= 1024) {
      dispatch(closeSidebar());
    }
  };

  return (
    <>
      <Backdrop $open={isOpen} onClick={() => dispatch(closeSidebar())} />
      <Wrapper $open={isOpen}>
        <div className="items">
          <Link href="/" className={pathname === '/' ? 'nav-active' : ''} onClick={closeMobileSidebar}>
          <NavItem text="Home" Icon={HomeIcon} classes="icon" />
        </Link>
          <Link
            href="/feed/trending"
            className={pathname === '/feed/trending' ? 'nav-active' : ''}
            onClick={closeMobileSidebar}
          >
          <NavItem text="Trending" Icon={TrendingIcon} classes="icon" />
        </Link>
          <Link
            href="/feed/subscriptions"
            className={pathname === '/feed/subscriptions' ? 'nav-active' : ''}
            onClick={closeMobileSidebar}
          >
          <NavItem text="Subscriptions" Icon={SubscriptionIcon} classes="icon" />
        </Link>

          <div className="items-section" />
          <Link href="/feed/library" className={pathname === '/feed/library' ? 'nav-active' : ''} onClick={closeMobileSidebar}>
          <NavItem text="Library" Icon={LibraryIcon} classes="icon" />
        </Link>
          <Link href="/feed/history" className={pathname === '/feed/history' ? 'nav-active' : ''} onClick={closeMobileSidebar}>
          <NavItem text="History" Icon={HistoryIcon} classes="icon" />
        </Link>

          {userprofile ? (
            <>
              <Link
                href={`/channel/${uid}`}
                className={pathname === `/channel/${uid}` ? 'nav-active' : ''}
                onClick={closeMobileSidebar}
              >
              <NavItem text="Your videos" Icon={VideoIcon} classes="icon" />
            </Link>
              <Link href="/feed/liked" className={pathname === '/feed/liked' ? 'nav-active' : ''} onClick={closeMobileSidebar}>
              <NavItem text="Liked videos" Icon={NavLikeIcon} classes="icon" />
            </Link>

              <div className="items-section" />
              <h3 className="subscriptions">SUBSCRIPTIONS</h3>

              <SubscribedChannels />
            </>
          ) : (
            <>
              <div className="items-section" />

              <div className="sign-in-msg">
                <Link href="/auth/signin" onClick={closeMobileSidebar}>
                  <SignInButton />
                </Link>
                <p className="msg">Sign in to like videos, comment, and subscribe.</p>
              </div>
              <div className="items-section" />
            </>
          )}

        <Link href="/about" className={pathname === '/about' ? 'nav-active' : ''} onClick={closeMobileSidebar}>
          <NavItem text="About" Icon={InfoIcon} classes="icon" />
        </Link>

        </div>
      </Wrapper>
    </>
  );
};

export default Sidebar;
