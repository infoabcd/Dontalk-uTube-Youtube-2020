"use client";

import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Hls from "hls.js";

const Wrapper = styled.div`
  position: relative;
  padding-top: 56.25%;

  video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #000;
  }

  .quality {
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 2;
    font-size: 13px;
    padding: 4px 8px;
    border-radius: 4px;
    border: 1px solid ${(props) => props.theme.divider};
    background: rgba(0, 0, 0, 0.65);
    color: #fff;
    cursor: pointer;
  }

  .status-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #0f0f0f;
    color: ${(props) => props.theme.secondaryColor};
    font-size: 14px;
    text-align: center;
    padding: 16px;
    z-index: 3;
  }
`;

export type VideoPlayerSource = {
  url: string;
  hlsMasterUrl?: string | null;
  processingStatus?: string;
};

function VideoPlayer({
  video,
  videoId,
}: {
  video: VideoPlayerSource;
  videoId: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [levels, setLevels] = useState<{ idx: number; label: string }[]>([]);
  const [levelIndex, setLevelIndex] = useState(-1);

  const src = video.hlsMasterUrl || video.url;
  const isHls = src.includes(".m3u8");
  const isProcessing = video.processingStatus === "processing";
  const isFailed = video.processingStatus === "failed";
  const canPlay = !isProcessing && !isFailed && Boolean(src);

  useEffect(() => {
    const el = ref.current;
    if (!el || !canPlay) {
      return undefined;
    }

    setLevels([]);
    setLevelIndex(-1);

    if (isHls && Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
      });
      hls.loadSource(src);
      hls.attachMedia(el);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        const opts = hls.levels.map((lvl, idx) => ({
          idx,
          label: lvl.height ? `${lvl.height}p` : `Level ${idx + 1}`,
        }));
        setLevels(opts);
        setLevelIndex(-1);
      });
      hlsRef.current = hls;
      return () => {
        hls.destroy();
        hlsRef.current = null;
      };
    }

    if (isHls && el.canPlayType("application/vnd.apple.mpegurl")) {
      el.src = src;
      return () => {
        el.removeAttribute("src");
        el.load();
      };
    }

    el.src = src;
    return () => {
      el.removeAttribute("src");
      el.load();
    };
  }, [src, videoId, isHls, canPlay]);

  const onQualityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const v = Number(e.target.value);
    setLevelIndex(v);
    const hls = hlsRef.current;
    if (hls) {
      hls.currentLevel = v;
    }
  };

  return (
    <Wrapper>
      {isProcessing && (
        <div className="status-overlay">
          影片正在轉碼，完成後將自動可播放（亦可稍後重新整理頁面）。
        </div>
      )}
      {isFailed && (
        <div className="status-overlay">
          轉碼失敗，請刪除後重新上載或聯絡管理員。
        </div>
      )}
      <video ref={ref} controls playsInline />
      {canPlay && isHls && levels.length > 1 && Hls.isSupported() && (
        <select
          className="quality"
          aria-label="Playback quality"
          value={levelIndex}
          onChange={onQualityChange}
        >
          <option value={-1}>Auto</option>
          {levels.map((l) => (
            <option key={l.idx} value={l.idx}>
              {l.label}
            </option>
          ))}
        </select>
      )}
    </Wrapper>
  );
}

export default VideoPlayer;
