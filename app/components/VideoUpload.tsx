/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import ReactPlayer from 'react-player';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import ModalContainer from '../pages/ModalContainer';
import { CloseIcon, UploadVideoIcon } from './Icons';
import useInput from '../hooks/useInput';
import { getFileName } from '../helper/file';
import { getFeed } from '../reducers/feedSlice';

const Wrapper = styled.div`
  width: min(880px, 92vw);
  height: min(90vh, 760px);
  background: ${(props) => props.theme.barBg};
  box-shadow: rgba(15, 23, 42, 0.2) 0px 20px 45px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid ${(props) => props.theme.divider};
    min-height: 64px;
    padding: 0 20px;

    h3 {
      font-size: 18px;
      font-weight: 600;
    }

    .close-icon {
      cursor: pointer;
      color: ${(props) => props.theme.secondaryColor};
    }
  }

  .prepare {
    width: 100%;
    height: calc(100% - 64px);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 14px;
    padding: 24px;

    .upload-label {
      display: flex;
      align-items: center;
      flex-direction: column;
      cursor: pointer;
    }

    .upload-icon {
      width: 132px;
      height: 132px;
      background: linear-gradient(145deg, #f5f8ff, #eef3ff);
      border: 1px solid #d5def2;
      border-radius: 66px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .select-button {
      margin-top: 26px;
      background-color: ${(props) => props.theme.toggle};
      color: white;
      font-size: 14px;
      font-weight: 600;
      border-radius: 999px;
      height: 42px;
      line-height: 42px;
      padding: 0 24px;
    }

    .helper-text {
      font-size: 13px;
      color: ${(props) => props.theme.secondaryColor};
    }
  }

  .content {
    // display: flex;
    padding: 0 1em;
    gap: 20px;
    flex-grow: 1;
    overflow: hidden;

    .left-panel {
      width: 52%;
      display: flex;
      padding-top: 0.7vh;
      flex-direction: column;
      margin: auto;
    }

    .detail {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-top: 0.7em;

      .error {
        color: #dc2626;
        font-size: 13px;
      }

      .detail-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 6px;
      }

      .heading {
        font-size: 24px;
        font-weight: 600;
      }

      .action-button {
        border: none;
        border-radius: 999px;
        padding: 0 20px;
        height: 38px;
        cursor: pointer;
        color: #fff;
        font-weight: 600;
      }

      .publish-button {
        background-color: ${(props) => props.theme.toggle};
      }

      .disable-button {
        background-color: #9ca3af;
        cursor: not-allowed;
      }

      .detail-section {
        border: 1px solid ${(props) => props.theme.divider};
        padding: 10px;
        border-radius: 10px;
        background: #fafafa;
      }

      .label {
        font-size: 12px;
        color: ${(props) => props.theme.secondaryColor};
        margin-bottom: 6px;
      }

      input,
      textarea {
        resize: none;
        border: none;
        outline: none;
        background: transparent;
        width: 100%;
      }

      input {
        font-size: 15px;
      }

      textarea {
        min-height: 130px;
        line-height: 1.5;
      }

      .detail-section:focus-within {
        border-color: ${(props) => props.theme.toggle};
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);
      }
    }

    .preview {
      position: relative;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid ${(props) => props.theme.divider};
      background: #000;
      padding-top: 56.25%;

      .react-player {
        position: absolute;
        top: 0;
        left: 0;
      }
    }

    .video-meta {
      margin-top: 1em;
      margin-bottom: 1em;
      color: ${(props) => props.theme.secondaryColor};
      font-size: 12px;
      word-break: break-all;
    }
  }

  .progress-card {
    width: min(460px, 86vw);
    background: ${(props) => props.theme.barBg};
    border-radius: 14px;
    padding: 24px 22px;
    box-shadow: rgba(15, 23, 42, 0.2) 0px 18px 34px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: center;
    text-align: center;
  }

  .progress-title {
    font-size: 18px;
    font-weight: 600;
  }

  .progress-subtitle {
    font-size: 13px;
    color: ${(props) => props.theme.secondaryColor};
  }

  .progress-track {
    width: 100%;
    height: 10px;
    border-radius: 999px;
    background: #e5e7eb;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #2563eb, #38bdf8);
    transition: width 0.2s ease;
  }

  .loading-spinner {
    width: 36px;
    height: 36px;
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

  @media screen and (max-width: 900px) {
    width: 96vw;
    height: min(92vh, 820px);

    .content {
      flex-direction: column;
      overflow-y: auto;

      .left-panel {
        width: 100%;
      }
    }
  }
`;

const MAX_FILE_MB = 200;

type UploadResult = {
  ok: boolean;
  status: number;
  data: { error?: string };
};

const uploadVideoWithProgress = (
  formData: FormData,
  onProgress: (value: number) => void
) =>
  new Promise<UploadResult>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/videos/upload');
    xhr.withCredentials = true;

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) return;
      const nextProgress = Math.min(99, Math.round((event.loaded / event.total) * 100));
      onProgress(nextProgress);
    };

    xhr.upload.onload = () => {
      onProgress(100);
    };

    xhr.onerror = () => reject(new Error('Upload failed'));

    xhr.onload = () => {
      let data = {};
      try {
        data = xhr.responseText ? JSON.parse(xhr.responseText) : {};
      } catch {
        data = {};
      }
      resolve({ ok: xhr.status >= 200 && xhr.status < 300, status: xhr.status, data });
    };

    xhr.send(formData);
  });

const VideoUpload = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [video, setVideo] = useState<File | null>(null);
  const [videoPath, setVideoPath] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const router = useRouter();
  const videoRef = useRef<HTMLInputElement>(null);
  const title = useInput('');
  const description = useInput('');

  if (!open) {
    return null;
  }

  const handleSelectVideo = () => {
    const file = videoRef.current?.files?.[0];
    if (!file) return;
    setVideo(file);
    setVideoPath(URL.createObjectURL(file));
    setUploadPercent(0);
    title.setValue(getFileName(file.name));
    if (file.size / (1024 * 1024) > MAX_FILE_MB) {
      setError(`檔案大小不可超過 ${MAX_FILE_MB}MB。`);
    } else {
      setError('');
    }
  };

  const handleCloseModal = () => {
    if (uploading) return;
    setVideo(null);
    setVideoPath('');
    setError('');
    setUploadPercent(0);
    description.setValue('');
    title.setValue('');
    onClose();
  };

  const handlePublish = async () => {
    if (!title.value.trim() || !video || error) {
      return;
    }

    setUploading(true);
    setUploadPercent(0);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', video);
      formData.append('title', title.value);
      formData.append('description', description.value);

      const result = await uploadVideoWithProgress(formData, (value) => setUploadPercent(value));

      if (result.ok) {
        setUploading(false);
        handleCloseModal();
        dispatch(getFeed() as any);
        router.push('/');
        router.refresh();
      } else {
        setUploading(false);
        setError(result.data?.error || '上載失敗，請稍後再試。');
      }
    } catch {
      setUploading(false);
      setError('上載失敗，請稍後再試。');
    }
  };

  return (
    <ModalContainer>
      <Wrapper>
        {uploading && (
          <ModalContainer>
            <div className="progress-card">
              <div className="loading-spinner" aria-label="上載中" />
              <div className="progress-title">正在上載影片…</div>
              <div className="progress-subtitle">已完成 {uploadPercent}%（上載完成後會前往首頁，轉碼在背景進行）</div>
            </div>
          </ModalContainer>
        )}
        <div className="header">
          <h3>{video ? '影片詳情' : '上載影片'}</h3>
          <CloseIcon className="close-icon" onClick={handleCloseModal} />
        </div>
        <input
          ref={videoRef}
          onChange={handleSelectVideo}
          type="file"
          id="video"
          accept="video/*"
          style={{ display: 'none' }}
        />
        {!video ? (
          <div className="prepare">
            <label htmlFor="video" className="upload-label">
              <div className="upload-icon">
                <UploadVideoIcon />
              </div>
              <span className="select-button">選擇影片檔案</span>
            </label>
            <p className="helper-text">支援常見影片格式，單檔上限 {MAX_FILE_MB}MB。</p>
          </div>
        ) : (
          <div className="content">
            <div className="left-panel">
              <div className="video-meta">
                {video.name} · {(video.size / (1024 * 1024)).toFixed(1)}MB
              </div>
              <div className="preview">
                <ReactPlayer className="react-player" controls src={videoPath} width="100%" />
              </div>
            </div>
            <div className="detail">
              <div className="detail-header">
                <p className="heading">影片資訊</p>
                <p className="error">{error}</p>
                <button
                  type="button"
                  onClick={handlePublish}
                  className={
                    !title.value.trim() || !video || error
                      ? 'action-button disable-button'
                      : 'action-button publish-button'
                  }
                >
                  立即發佈
                </button>
              </div>
              <div className="detail-section title">
                <div className="label">標題（必填）</div>
                <input required type="text" value={title.value} onChange={title.onChange} />
              </div>
              <div className="detail-section description">
                <div className="label">描述</div>
                <textarea value={description.value} onChange={description.onChange} />
              </div>
            </div>
          </div>
        )}
      </Wrapper>
    </ModalContainer>
  );
};

export default VideoUpload;
