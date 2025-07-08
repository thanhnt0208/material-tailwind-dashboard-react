import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BaseUrl } from '@/ipconfig';

export default function VideoLikeBox({ videoId }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchLikes = async () => {
      if (!videoId || videoId === ':videoId') {
        console.warn('videoId không hợp lệ:', videoId);
        setLoading(false);
        setError('Video ID không hợp lệ.');
        return;
      }

      setLoading(true);
      setError('');
      try {
        const res = await axios.get(`${BaseUrl}/video-like/${videoId}/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Dữ liệu có thể là res.data.users hoặc res.data trực tiếp là mảng
        const usersList = Array.isArray(res.data)
          ? res.data
          : res.data?.users || [];

        setUsers(usersList);
      } catch (err) {
        console.error('Lỗi khi lấy danh sách like:', err);
        setError('Không thể lấy danh sách người like. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchLikes();
  }, [videoId, token]);

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded border border-blue-200">
      <h3 className="font-semibold mb-2 text-gray-700">Người đã like video:</h3>

      {loading ? (
        <span className="italic text-gray-400">Đang tải...</span>
      ) : error ? (
        <span className="text-red-500 text-sm">{error}</span>
      ) : users.length === 0 ? (
        <span className="italic text-gray-400">Chưa có ai like</span>
      ) : (
        <ul className="list-disc pl-5 text-gray-700">
          {users.map((user, idx) => (
            <li key={idx}>
              {user.fullName || user.username || 'Ẩn danh'}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
