import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BaseUrl } from '@/ipconfig';
import { useNavigate } from 'react-router-dom';

export default function LikeButton({ videoId, onLikeChange }) {
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');
  const userId = JSON.parse(localStorage.getItem('user'))?.id;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLikedStatus = async () => {
      if (!videoId || !token || !userId) return;

      try {
        const res = await axios.get(`${BaseUrl}/video-like/${videoId}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const likedUsers = res.data.users || [];
        const isLiked = likedUsers.some(
          (u) => String(u._id ?? u.id) === String(userId)
        );
        setLiked(isLiked);
      } catch (err) {
        console.error('Lỗi khi check trạng thái Like:', err.response?.data || err);
      }
    };

    fetchLikedStatus();
  }, [videoId, token, userId]);

  const handleLikeToggle = async () => {
    if (!videoId || !token) return;
    setLoading(true);

    try {
      const url = liked
        ? `${BaseUrl}/video-like/${videoId}/unlike`
        : `${BaseUrl}/video-like/${videoId}/like`;

      await axios.post(url, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setLiked(!liked);

      onLikeChange?.(); // gọi callback nếu có

      if (liked) {
        // Unlike
        await axios.post(`${BaseUrl}/video-like/${videoId}/unlike`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        // Like
        await axios.post(`${BaseUrl}/video-like/${videoId}`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setLiked(!liked);
      onLikeChange?.(); // gọi callback reload danh sách user

    } catch (err) {
      console.error('Lỗi khi Like/Unlike video:', err.response?.data || err);
      alert('Không thể Like/Unlike video.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewLikes = () => {
    navigate(`/dashboard/video-like/${videoId}`);
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleLikeToggle}
        disabled={loading}
        className={`px-3 py-1 rounded text-white text-sm font-semibold shadow ${
          liked ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-600 hover:bg-gray-700'
        }`}
      >
        {loading ? '...' : liked ? 'Bỏ Like' : 'Like'}
      </button>

      <button
        onClick={handleViewLikes}
        className="px-3 py-1 rounded text-blue-700 bg-blue-100 hover:bg-blue-200 text-sm font-semibold shadow"
      >
        👥 Xem Like
      </button>
    </div>
  );
}
