import React from 'react';
import styled from 'styled-components';
import PlaylistItem from './PlaylistItem';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
`;

const PlaylistContainer = ({
  videos,
}: {
  videos: {
    id: string;
    title: string;
    thumb?: string;
    processingStatus?: string;
    info?: { displayName?: string };
  }[];
}) => (
  <Wrapper>
    {videos.map((video) => (
      <PlaylistItem key={video.id} video={video} />
    ))}
  </Wrapper>
);

export default PlaylistContainer;
