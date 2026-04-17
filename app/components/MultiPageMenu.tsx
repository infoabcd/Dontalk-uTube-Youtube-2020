/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import Avatar from './Avatar';
import { SignOutIcon, ThemeIcon } from './Icons';
import NavItem from './NavItem';

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
  const handleSignOut = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
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
        <div className="menu-item">
          <NavItem Icon={ThemeIcon} text="Theme" className="icon" />
        </div>
        <div className="sign-out menu-item" onClick={handleSignOut}>
          <NavItem Icon={SignOutIcon} text="Sign out" className="icon" />
        </div>
      </div>
    </Wrapper>
  );
};

export default MultiPageMenu;
