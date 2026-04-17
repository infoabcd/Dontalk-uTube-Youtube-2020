/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { MouseEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import Avatar from './Avatar';
import { SignOutIcon, ThemeIcon } from './Icons';
import NavItem from './NavItem';
import { useAppDispatch, useAppSelector } from '../hooks';
import { toggleTheme } from '../reducers/uiThemeSlice';
import { signOut } from '../reducers/userdetailSlice';
import type { RootState } from '../store';

const Wrapper = styled.div`
  width: 280px;
  position: absolute;
  top: 50px;
  right: 10px;
  border: 1px solid ${(props) => props.theme.divider};
  background-color: ${(props) => props.theme.barBg};

  .account {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: column;
    padding: 12px;
    border-bottom: 1px solid ${(props) => props.theme.divider};
    cursor: pointer;

    .display-name {
      margin-top: 12px;
    }
  }

  .menu-container {
    width: 100%;
    padding-top: 12px;
  }
  .menu-item {
    cursor: pointer;
  }
  .menu-item:hover {
    background-color: ${(props) => props.theme.itemHover};
  }
`;

const MultiPageMenu = ({
  profile,
}: {
  profile: {
    photoURL?: string | null;
    displayName?: string | null;
    uid: string;
  };
}) => {
  const { photoURL, displayName, uid } = profile;
  const router = useRouter();
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector((s: RootState) => s.uiTheme.mode);

  const handleThemeClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleTheme());
  };

  const handleSignOut = async (e: MouseEvent) => {
    // 沒有清空 Redux 的登入狀態，所以 cookie 可能已經被清理，但是還是拿著舊的 profile 資料。 所以需要使用 API 清空 cookie。
    // await fetch('/api/auth/logout', { method: 'POST' });
    // router.push('/');
    // router.refresh();

    e.preventDefault();
    e.stopPropagation();
    
    const res = await fetch('/api/auth/logout', { method: 'POST' });
    if (!res.ok) return;

    dispatch(signOut());
    router.push('/');
    router.refresh();
  };

  return (
    <Wrapper>
      <Link href={`/channel/${uid}`}>
        <div className="account">
          <Avatar src={photoURL ?? undefined} large />
          <h4 className="display-name"> {displayName} </h4>
        </div>
      </Link>
      <div className="menu-container">
        <div className="menu-item" onClick={handleThemeClick}>
          <NavItem
            Icon={ThemeIcon}
            text={themeMode === 'dark' ? 'Light Theme' : 'Dark Theme'}
            className="icon"
          />
        </div>
        <div className="sign-out menu-item" onClick={handleSignOut}>
          <NavItem Icon={SignOutIcon} text="Sign Out" className="icon" />
        </div>
      </div>
    </Wrapper>
  );
};

export default MultiPageMenu;
