<<<<<<< HEAD

=======
<<<<<<< Updated upstream
import React from 'react';
import { useParams } from 'react-router-dom';
import VideoLikeBox from '@/components/VideoLikeBox';
=======
>>>>>>> test
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BaseUrl } from '@/ipconfig';
import { useParams, useNavigate } from 'react-router-dom';
import { Audio } from 'react-loader-spinner';
<<<<<<< HEAD
=======
>>>>>>> Stashed changes
>>>>>>> test

export default function VideoLikeList() {
  const { videoId } = useParams();
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
<<<<<<< HEAD

  const getLikes = async () => {
    try {
      setLoading(true);
      const res = await axios.post(`${BaseUrl}/video-like/${videoId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLikes(res.data?.data || []);
    } catch (error) {
      console.error('Lỗi lấy danh sách Like:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLikes();
  }, []);
=======
>>>>>>> test

<<<<<<< Updated upstream
  return (
<<<<<<< HEAD
=======
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4 text-blue-700">Danh sách người đã like video</h1>
      <VideoLikeBox videoId={videoId} />
=======
  const getLikes = async () => {
    try {
      setLoading(true);
      const res = await axios.post(`${BaseUrl}/video-like/${videoId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLikes(res.data?.data || []);
    } catch (error) {
      console.error('Lỗi lấy danh sách Like:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLikes();
  }, []);

  return (
>>>>>>> test
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">Danh sách người đã Like</h1>

      {loading ? (
        <div className="flex justify-center">
          <Audio height="60" width="60" radius="9" color="green" ariaLabel="loading" />
        </div>
      ) : likes.length === 0 ? (
        <p className="text-gray-500">Chưa có ai Like video này.</p>
      ) : (
        <ul className="list-disc pl-6">
          {likes.map((user, index) => (
            <li key={index} className="mb-1">
              {user.fullName}
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={() => navigate(-1)}
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
      >
        Quay lại
      </button>
<<<<<<< HEAD
=======
>>>>>>> Stashed changes
>>>>>>> test
    </div>
  );
}
