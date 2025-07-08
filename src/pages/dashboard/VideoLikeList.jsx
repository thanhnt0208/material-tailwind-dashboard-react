import React from 'react';
import { useParams } from 'react-router-dom';
import VideoLikeBox from '@/components/VideoLikeBox';

export default function VideoLikeList() {
  const { videoId } = useParams();

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4 text-blue-700">Danh sách người đã like video</h1>
      <VideoLikeBox videoId={videoId} />
    </div>
  );
}
