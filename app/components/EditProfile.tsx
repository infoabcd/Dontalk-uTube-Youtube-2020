/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import ModalContainer from '../pages/ModalContainer';
import Avatar from './Avatar';
import useInput from '../hooks/useInput';

const Wrapper = styled.div`
  width: 800px;
  height: 600px;
  background: rgb(255, 255, 255);
  box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 10px;
  border-radius: 4px;
  display: flex;
  flex-direction: column;

  label {
    width: 100%;
    height: 100%;
    display: block;
    cursor: pointer;
  }

  .banner {
    width: 100%;
    height: 185px;
    background-color: ${(props) => props.theme.channelBg};

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .content {
    display: flex;
    margin: 18px;
    flex-grow: 1;

    input,
    textarea {
      border: none;
      outline: none;
      width: 100%;
      color: ${(props) => props.theme.primaryColor};
      resize: none;
      line-height: 1.3em;
    }

    .meta {
      flex-grow: 1;
      display: flex;
      flex-direction: column;

      .title {
        color: ${(props) => props.theme.secondaryColor};
        font-size: 13px;
      }
    }

    .meta-section {
      border: 1px solid ${(props) => props.theme.divider};
      padding: 8px;
      border-radius: 4px;
      margin: 8px;
      display: flex;
      flex-direction: column;

      textarea {
        height: 100%;
        width: 100%;
      }
    }

    .meta-section:last-child {
      flex-grow: 1;
    }

    .right {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .avatar {
      width: 180px;
      height: auto;
      margin: 18px;
      text-align: center;
    }

    .button {
      width: 100%;
      background-color: ${(props) => props.theme.disableBg};
      margin: 8px 0;
    }

    .error {
      border: 1px solid red;
    }

    .confirm-button {
      background-color: ${(props) => props.theme.toggle};
    }
  }

  .loading-spinner {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 4px solid #d9d9d9;
    border-top-color: ${(props) => props.theme.toggle};
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const EditProfile = ({
  open,
  onClose,
  profile,
}: {
  open: boolean;
  onClose: (profile?: {
    displayName: string;
    photoURL?: string;
    banner?: string;
    description?: string;
  }) => void;
  profile: {
    displayName: string | null;
    photoURL?: string | null;
    banner?: string | null;
    description?: string | null;
  };
}) => {
  const [banner, setBanner] = useState(profile.banner);
  const [avatar, setAvatar] = useState(profile.photoURL);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);
  const bannerRef = useRef<HTMLInputElement>(null);
  const avatarRef = useRef<HTMLInputElement>(null);
  const name = useInput(profile.displayName ?? '');
  const description = useInput(profile.description ?? '');

  if (!open) {
    return null;
  }

  const handleBannerChange = () => {
    const file = bannerRef.current?.files?.[0];
    if (!file) return;
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      const r = fileReader.result;
      setBanner(typeof r === 'string' ? r : null);
    };
  };

  const handleAvatarChange = () => {
    const file = avatarRef.current?.files?.[0];
    if (!file) return;
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      const r = fileReader.result;
      setAvatar(typeof r === 'string' ? r : null);
    };
  };

  const handleSubmit = async () => {
    setUpdating(true);
    const newName = name.value.trim();
    if (!newName) {
      setError('Channel name cannot be empty');
      setUpdating(false);
      return;
    }

    const newProfile = {
      displayName: newName,
      description: description.value,
      photoURL: avatar,
      banner,
    };

    try {
      const res = await fetch(`/api/auth/me`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProfile),
      });
      setUpdating(false);
      if (res.ok) {
        onClose({
          displayName: newName,
          description: description.value,
          photoURL: avatar ?? undefined,
          banner: banner ?? undefined,
        });
      } else {
        setError('Update failed');
      }
    } catch {
      setUpdating(false);
      setError('Update failed');
    }
  };

  return (
    <ModalContainer>
      <Wrapper>
        {updating && (
          <ModalContainer>
            <div className="loading-spinner" aria-label="更新中" />
          </ModalContainer>
        )}
        <div className="banner">
          <label htmlFor="banner">{banner && <img src={banner} alt="banner" />}</label>
          <input
            type="file"
            id="banner"
            accept="image/*"
            ref={bannerRef}
            onChange={handleBannerChange}
            style={{ display: 'none' }}
          />
        </div>
        <div className="content">
          <div className="meta">
            <div className={error ? 'meta-section error' : 'meta-section'}>
              <div className="title">
                Name {error && <span style={{ color: 'red' }}>{error}</span>}
              </div>
              <input
                type="text"
                required
                value={name.value}
                onChange={name.onChange}
                placeholder="Enter channel name"
              />
            </div>
            <div className="meta-section">
              <div className="title">Channel description</div>
              <textarea
                value={description.value}
                onChange={description.onChange}
                placeholder="Tell viewers about your channel. Your description will appear in the About section of your channel and search results, among other places."
              />
            </div>
          </div>
          <div className="right">
            <div>
              <label htmlFor="avatar" className="avatar">
                <Avatar huge src={avatar ?? undefined} />
              </label>
              <input
                type="file"
                id="avatar"
                ref={avatarRef}
                accept="image/*"
                onChange={handleAvatarChange}
                style={{ display: 'none' }}
              />
            </div>
            <div>
              <button
                className="button cancel-button"
                onClick={() => onClose()}
                type="button"
              >
                CANCEL
              </button>
              <button className="button confirm-button" onClick={handleSubmit} type="button">
                CONFIRM
              </button>
            </div>
          </div>
        </div>
      </Wrapper>
    </ModalContainer>
  );
};
export default EditProfile;
