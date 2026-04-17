import React from 'react';
import styled from 'styled-components';
import Avatar from './Avatar';
import TimeAgo from './TimeAgo';

const Wrapper = styled.div`
  display: flex;
  margin-bottom: 20px;
  color: ${(props) => props.theme.primaryColor};

  time {
    color: ${(props) => props.theme.secondaryColor};
    font-weight: normal;
  }

  .avatar {
    width: 40px;
    height: 40px;
    margin-right: 16px;
  }
  .username {
    font-size: 13px;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .text {
    font-size: 14px;
  }
`;

const CommentItem = ({
  comment,
}: {
  comment: {
    text?: string;
    comment?: string;
    createdAt: string;
    info: { displayName?: string; photoURL?: string | null };
  };
}) => (
  <Wrapper>
    <div className="avatar">
      <Avatar medium src={comment.info.photoURL ?? undefined} />
    </div>
    <div className="info">
      <div className="username">
        {comment.info.displayName} <TimeAgo date={comment.createdAt} />
      </div>
      <div className="text">{comment.text || comment.comment}</div>
    </div>
  </Wrapper>
);

export default CommentItem;
