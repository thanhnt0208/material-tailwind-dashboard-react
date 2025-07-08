import React, { useState } from 'react';
import axios from 'axios';
import { BaseUrl } from '@/ipconfig';

export default function LikeButton({ videoId, onLikeChange }) {
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  const handleLikeToggle = async () => {
    if (!videoId || !token) return;
    setLoading(true);

    try {
      if (liked) {
        await axios.post(`${BaseUrl}/video-like/${videoId}/unlike`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`${BaseUrl}/video-like/${videoId}`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setLiked(!liked);
      onLikeChange?.();
    } catch (error) {
      console.error('Lỗi Like/Unlike:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLikeToggle}
      disabled={loading}
      className={`px-3 py-1 rounded text-white text-sm font-semibold shadow ${
        liked ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-600 hover:bg-gray-700'
      }`}
    >
      {loading ? '...' : liked ? 'Bỏ Like' : 'Like'}
    </button>
  );
}
