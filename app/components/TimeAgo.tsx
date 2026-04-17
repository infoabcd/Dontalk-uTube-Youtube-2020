import React from 'react';
import ReactTimeAgo from 'react-time-ago';

const TimeAgo = ({ seconds, date }: { seconds?: number; date?: string }) => {
  const d = date ? new Date(date) : seconds ? new Date(seconds * 1000) : new Date();
  return <ReactTimeAgo date={d} />;
};

export default TimeAgo;
