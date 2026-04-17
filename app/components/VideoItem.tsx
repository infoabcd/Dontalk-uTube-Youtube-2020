import React, { useState } from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import styled, { css } from 'styled-components';
import Avatar from './Avatar';
import ViewsAndAgo from './ViewsAndAgo';

const ThumbWrap = styled.div`
  position: relative;
  width: 100%;

  .delete-thumb-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 2;
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.55);
    color: #fff;
    font-size: 18px;
    line-height: 1;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .delete-thumb-btn:hover:not(:disabled) {
    background: #c62828;
  }

  .delete-thumb-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

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

  .thumb-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #1a1a1a;
    color: #a3a3a3;
    font-size: 13px;
    text-align: center;
    padding: 8px;
    box-sizing: border-box;
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
      min-width: 0;

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

type VideoRow = {
  id: string;
  title: string;
  thumb?: string;
  processingStatus?: string;
  uid: string;
  info?: { displayName?: string; photoURL?: string | null };
  createdAt?: string;
  views?: number;
};

const VideoItem = ({
  video,
  mini,
  canManage,
  onDeleted,
}: {
  video: VideoRow;
  mini?: boolean;
  canManage?: boolean;
  onDeleted?: () => void;
}) => {
  const width = useSelector((state: RootState) => state.grid.width);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!canManage || deleting) return;
    if (!window.confirm('確定要刪除此影片？此操作無法還原。')) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/videos/${video.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        onDeleted?.();
      } else {
        const data = await res.json().catch(() => ({}));
        window.alert((data as { error?: string }).error || '刪除失敗');
      }
    } catch {
      window.alert('刪除失敗');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Wrapper $width={width} $mini={mini}>
      <ThumbWrap>
        {canManage && (
          <button
            type="button"
            className="delete-thumb-btn"
            aria-label="刪除影片"
            disabled={deleting}
            onClick={handleDelete}
            title="刪除影片"
          >
            ×
          </button>
        )}
        <Link href={`/watch/${video.id}`}>
          {!video.thumb || video.processingStatus === 'processing' ? (
            <div className="thumb thumb-placeholder">轉碼中…</div>
          ) : (
            <img className="thumb" src={video.thumb} alt={video.title} />
          )}
        </Link>
      </ThumbWrap>
      <div className="info">
        <object>
          <Link href={`/channel/${video.uid}`}>
            <div className="avatar">
              <Avatar src={video.info?.photoURL ?? undefined} />
            </div>
          </Link>
        </object>
        <div className="detail">
          <Link href={`/watch/${video.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <h3 className="title"> {video.title} </h3>
          </Link>
          <Link href={`/channel/${video.uid}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="up">{video.info?.displayName}</div>
          </Link>
          <ViewsAndAgo video={video} />
        </div>
      </div>
    </Wrapper>
  );
};

export default VideoItem;
