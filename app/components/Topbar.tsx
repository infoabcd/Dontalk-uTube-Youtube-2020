/* eslint-disable no-unused-expressions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import Link from 'next/link';
import { useEffect, useState, MouseEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import styled from 'styled-components';
import { closeSidebar, openSidebar } from '../reducers/sidebarSlice';
import { Hamburger, NotificationIcon, UploadIcon } from './Icons';
import Search from './Search';
import Avatar from './Avatar';
import VideoUpload from './VideoUpload';
import MultiPageMenu from './MultiPageMenu';
import { closeMenu, openMenu } from '../reducers/menuSlice';
import SignInButton from './SignInButton';
import useUser from '../hooks/useUser';

const Wrapper = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 56px;
  z-index: 2020;
  background-color: ${(props) => props.theme.barBg};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  gap: 16px;

  .start {
    display: flex;
    align-items: center;
    min-width: 0;

    svg {
      margin-right: 6px;
    }

    .Logo_ico {
      height: 5vh;
      width: auto;
    }

    p {
      font-size: 20px;
      font-weight: 400;
      white-space: nowrap;
    }
  }

  .search-area {
    flex: 1;
    display: flex;
    justify-content: center;
    min-width: 0;
  }

  .end {
    height: 40px;
    display: flex;
    align-items: center;
    flex-shrink: 0;

    .menu-icon {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    .menu-icon::nth-child(3) {
      position: relative;
      width: 60px;
    }
  }

  @media screen and (max-width: 768px) {
    padding: 0 10px;
    gap: 8px;

    .start svg {
      margin-right: 12px;
    }

    .start p {
      display: none;
    }

    .end .menu-icon {
      width: 34px;
      height: 34px;
    }
  }

  @media screen and (max-width: 560px) {
    .end .menu-icon:nth-child(2) {
      display: none;
    }
  }
`;

const Topbar = () => {
  // const user = useSelector((state) => state.userdetail);

  const { userprofile } = useUser();
  const sidebar = useAppSelector((state) => state.sidebar.sidebar);
  const [openModal, setOpenModal] = useState(false);
  const dispatch = useAppDispatch();
  const open = useAppSelector((state) => state.menu.open);

  const handleSidebar = () => (sidebar ? dispatch(closeSidebar()) : dispatch(openSidebar()));
  const handleOpenMenu = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    open ? dispatch(closeMenu()) : dispatch(openMenu());
  };

  const closeModal = () => setOpenModal(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth <= 1024) {
      dispatch(closeSidebar());
    }
  }, [dispatch]);

  return (
    <Wrapper>
      <div className="start">
        <Hamburger onClick={handleSidebar} />
        <img className='Logo_ico' src="/favicon.ico" alt="Dontalk-uTube"/>
        <p>
          <Link href="/">Dontalk-uTube</Link>
        </p>
      </div>
      <div className="search-area">
        <Search />
      </div>

      <div className="end">
        {userprofile ? (
          <>
            <div className="menu-icon" onClick={() => setOpenModal(true)}>
              <UploadIcon />
            </div>
            <div className="menu-icon">
              <NotificationIcon />
            </div>
            <div className="menu-icon" onClick={handleOpenMenu}>
              <Avatar src={userprofile.photoURL} />
            </div>
            {open && userprofile && <MultiPageMenu profile={userprofile} />}
            <VideoUpload open={openModal} onClose={closeModal} />
          </>
        ) : (
          <div className="">
            <Link href="/auth/signin">
              <SignInButton fill="100%" />
            </Link>
          </div>
        )}
      </div>
    </Wrapper>
  );
};

export default Topbar;
