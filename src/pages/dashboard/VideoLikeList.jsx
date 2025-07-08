// src/pages/VideoLikeList.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import VideoLikeBox from '@/components/VideoLikeBox';

export default function VideoLikeList() {
  const { videoId } = useParams();

  console.log('Video ID:', videoId);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Danh sách người đã Like video</h2>
      <VideoLikeBox videoId={videoId} />
    </div>
  );
}
