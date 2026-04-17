import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import TextareaAutosize from 'react-textarea-autosize';
import useInput from '../hooks/useInput';
import Avatar from './Avatar';
import CommentItem from './CommentItem';
import useUser from '../hooks/useUser';

const Wrapper = styled.div`
  width: 100%;
  margin-top: 10px;
  border-top: 1px solid ${(props) => props.theme.divider};
  .comment-stat {
    margin: 17px 0;
  }

  .comment-box {
    display: flex;
    img {
      margin-right: 16px;
    }

    .main {
      flex-grow: 1;
      text-align: right;
      textarea {
        background: inherit;
        border: none;
        border-bottom: 1px solid ${(props) => props.theme.divider};
        color: ${(props) => props.theme.primaryColor};
        width: 100%;
        resize: none;
        padding: 4px;
        line-height: 1.4rem;
        transition: border 0.5s;

        &:focus {
          border-bottom: 1px solid ${(props) => props.theme.secondaryColor};
        }
      }

      .disable-button {
        background-color: ${(props) => props.theme.disableBg};
        cursor: inherit;
      }

      .active-button {
        background-color: ${(props) => props.theme.toggle};
        cursor: pointer;
      }
    }
  }

  .avatar {
    width: 40px;
    height: 40px;
    margin-right: 16px;
  }
`;

const Comments = ({ videoId }: { videoId: string }) => {
  const comment = useInput('');
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<any[]>([]);
  const { userprofile } = useUser();

  useEffect(() => {
    fetch(`/api/videos/${videoId}`)
      .then((res) => res.json())
      .then((data) => {
        setComments(data.comments || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [videoId]);

  const submitComment = async () => {
    if (!comment.value.trim()) return;
    const res = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ videoId, text: comment.value }),
    });
    if (res.ok) {
      const newComment = await res.json();
      setComments([newComment, ...comments]);
    }
    comment.setValue('');
  };

  return (
    <Wrapper>
      <div className="comment-stat"> {comments.length} Comments </div>
      {userprofile && (
        <div className="comment-box">
          <div className="avatar">
            <Avatar src={userprofile.photoURL} medium alt="avatar" />
          </div>
          <div className="main">
            <TextareaAutosize
              placeholder="Add a public comment"
              value={comment.value}
              onChange={comment.onChange}
            />
            <button
              className={!comment.value.trim() ? 'button disable-button' : 'button active-button'}
              type="button"
              onClick={submitComment}
            >
              COMMENT
            </button>
          </div>
        </div>
      )}
      <div className="comment-list">
        {loading ? (
          <p>loading</p>
        ) : (
          comments.map((comment) => <CommentItem key={comment.id} comment={comment} />)
        )}
      </div>
    </Wrapper>
  );
};

export default Comments;
