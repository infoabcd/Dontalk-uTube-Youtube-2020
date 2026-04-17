import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import useUser from '../hooks/useUser';
import { DislikeIcon, LikeIcon } from './Icons';

const Wrapper = styled.div`
  display: flex;
  color: ${(props) => props.theme.secondaryColor};

  button {
    vertical-align: middle;
    color: inherit;
    outline: none;
    background-color: transparent;
    margin: 0;
    border: none;
    padding: 0;
    cursor: pointer;
  }

  svg {
    fill: #909090;
  }

  .count {
    line-height: 24px;
    margin: 0 8px;
  }

  .liked-box {
    display: flex;
    justify-content: center;
    margin-right: 8px;
  }

  .liked-box:last-child {
    .count {
      margin-right: 0;
    }
  }

  .liked {
    svg {
      fill: ${(props) => props.theme.toggle};
    }
  }
`;

const Liked = ({ targetId }: { targetId: string }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likedCount, setLikedCount] = useState(0);
  const { userprofile } = useUser();

  const handleLike = async () => {
    if (!userprofile) return;
    const res = await fetch('/api/liked', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ videoId: targetId }),
    });
    if (res.ok) {
      const data = await res.json();
      setIsLiked(data.liked);
      setLikedCount((prev) => (data.liked ? prev + 1 : prev - 1));
    }
  };

  return (
    <Wrapper>
      <button
        type="button"
        className={`liked-box ${isLiked ? 'liked' : ''}`}
        disabled={!userprofile}
        onClick={handleLike}
      >
        <LikeIcon />
        <span className="count">{likedCount}</span>
      </button>

      <button
        type="button"
        className="liked-box"
        disabled={!userprofile}
      >
        <DislikeIcon />
        <span className="count">0</span>
      </button>
    </Wrapper>
  );
};

export default Liked;
