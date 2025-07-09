import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { BaseUrl } from '@/ipconfig';

export default function VideoLikeList() {
  const { videoId } = useParams();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchLikes = async () => {
      if (!videoId || !token) return;

      try {
        const res = await axios.get(`${BaseUrl}/video-like/${videoId}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log('Danh sách người đã like:', res.data.users);
        setUsers(res.data.users || []);
      } catch (err) {
        console.error('Lỗi khi lấy danh sách người đã Like:', err.response?.data || err);
      } finally {
        setLoading(false);
      }
    };

    fetchLikes();
  }, [videoId, token]);

  if (loading) {
    return (
      <div className="p-4 text-center text-gray-500">Đang tải danh sách...</div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4 text-blue-700">
        👥 Danh sách người đã Like video
      </h1>

      {users.length === 0 ? (
        <p className="text-gray-600">Chưa có ai Like video này.</p>
      ) : (
        <div className="space-y-3">
          {users.map((user) => (
            <div
              key={user._id}
              className="flex items-center gap-3 p-2 bg-gray-100 rounded hover:bg-gray-200"
            >
              <img
                src={user.avatar ? `${BaseUrl}${user.avatar}` : '/default-avatar.png'}
                alt={user.fullName}
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="font-medium">{user.fullName}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
