import React from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import styled, { css } from 'styled-components';
import Avatar from './Avatar';
import ViewsAndAgo from './ViewsAndAgo';

const Wrapper = styled.div<{ $width: number; $mini?: boolean }>`
  width: ${(props) => `${props.$width}px`};
  display: flex;
  flex-direction: column;
  padding: ${(props) => (props.$mini ? '0 5px 24px' : '0 8px 40px')};

  .thumb {
    width: 100%;
    height: ${(props) => `${props.$width * 0.562}px`};
    object-fit: cover;
  }

  .info {
    ${(props) =>
      props.$mini &&
      css`
        img {
          display: none;
        }
      `}

    display: flex;
    padding-top: 12px;

    .avatar {
      width: 40px;
      height: 40px;
      display: ${(props) => (props.$mini ? 'none' : 'flex')};
      align-items: center;
      justify-content: center;
      margin-right: 12px;
    }

    .detail {
      flex-grow: 1;

      .title {
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: normal;
        font-weight: 500;
        line-height: 20px;
        max-height: 40px;
        font-size: 16px;
        display: -webkit-box;
        /* 設定子元素排列方式 */
        -webkit-box-orient: vertical;
        /* 設定顯示行數，超出部分以…顯示 */
        -webkit-line-clamp: 2;
      }
      .up {
        font-size: 14px;
        color: ${(props) => props.theme.secondaryColor};
        padding: 0;
        height: 18px;
      }
    }
  }
`;

const VideoItem = ({ video, ...restProps }) => {
  const width = useSelector((state: RootState) => state.grid.width);
  return (
    <Wrapper $width={width} $mini={restProps.mini}>
      <Link href={`/watch/${video.id}`}>
        <img className="thumb" src={video.thumb} alt={video.title} />
        <div className="info">
          <object>
            <Link href={`/channel/${video.uid}`}>
              <div className="avatar">
                <Avatar src={video.info?.photoURL ?? undefined} />
              </div>
            </Link>
          </object>
          <div className="detail">
            <h3 className="title"> {video.title} </h3>
            <div className="up">{video.info?.displayName}</div>
            <ViewsAndAgo video={video} />
          </div>
        </div>
      </Link>
    </Wrapper>
  );
};

export default VideoItem;
