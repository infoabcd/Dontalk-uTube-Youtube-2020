import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import styled from 'styled-components';
import { getChannel } from '../reducers/channelSlice';
import type { AppDispatch, RootState } from '../store';
import Avatar from './Avatar';
import NavItem from './NavItem';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const SubscribedChannels = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, channels } = useSelector((state: RootState) => state.channel);
  const { uid } = useSelector((state: RootState) => state.userdetail.profile);

  useEffect(() => {
    dispatch(getChannel(uid));
  }, [dispatch]);

  if (loading) {
    return <span>loading</span>;
  }

  return (
    <Wrapper>
      {!loading &&
        channels.map((channel) => (
          <Link
            key={channel.uid}
            href={`/channel/${channel.uid}`}
          >
            <NavItem
              Icon={Avatar}
              mini
              src={channel.photoURL ?? undefined}
              text={channel.displayName ?? ''}
            />
          </Link>
        ))}
    </Wrapper>
  );
};

export default SubscribedChannels;
