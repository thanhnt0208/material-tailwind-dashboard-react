import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BaseUrl } from '@/ipconfig';
import { useNavigate } from 'react-router-dom';

export default function LikeButton({ videoId }) {
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const userId = JSON.parse(localStorage.getItem('user'))?.id;

  const checkLikedStatus = async () => {
    if (!videoId || !token) return;
    try {
      const res = await axios.get(`${BaseUrl}/video-like/${videoId}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("API trả về:", res.data);

      // Nếu API trả về { users: [...] } hoặc trực tiếp là mảng
      const likedUsers = res.data.users || res.data || [];

      const isLiked = likedUsers.some((u) => u._id === userId || u.id === userId);
      setLiked(isLiked);
    } catch (error) {
      console.error('Lỗi khi check trạng thái Like:', error.response?.data || error);
    }
  };

  useEffect(() => {
    checkLikedStatus();
  }, [videoId]);

  const handleLikeToggle = async () => {
    if (!videoId || !token) return;

    // Tạm thời đảo trạng thái để UI phản hồi nhanh
    const previousLiked = liked;
    setLiked(!liked);
    setLoading(true);

    try {
      const url = previousLiked
        ? `${BaseUrl}/video-like/${videoId}/unlike`
        : `${BaseUrl}/video-like/${videoId}/like`;

      console.log("Gọi API:", url);

      await axios.post(url, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error('Lỗi khi Like/Unlike video:', error.response?.data || error);
      alert('Không thể Like/Unlike video.');

      // Nếu lỗi thì đảo lại trạng thái
      setLiked(previousLiked);
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
