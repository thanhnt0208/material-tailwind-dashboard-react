<<<<<<< HEAD
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { BaseUrl } from '@/ipconfig'
import { useParams } from 'react-router-dom'
import { Audio } from 'react-loader-spinner'
import CommentVideo from '../commentVideo'
=======
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BaseUrl } from '@/ipconfig';
import { useParams } from 'react-router-dom';
import { Audio } from 'react-loader-spinner';
import VideoDetail from './VideoDetail';
import LikeButton from '@/components/LikeButton';

>>>>>>> tien
export const VideoFarmById = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoList, setVideoList] = useState([]);
  const [loading, setLoading] = useState(true);
  const tokenUser = localStorage.getItem('token');
  const { farmId } = useParams();

  const getDetailVideo = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BaseUrl}/admin-video-farm/farm/${farmId}`, {
        headers: { Authorization: `Bearer ${tokenUser}` }
      });
      if (res.status === 200) {
        setVideoDetail(res.data);
      }
    } catch (error) {
      console.log("Lỗi nè:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (item) => {
    setSelectedVideo({
      title: item.title,
      youtubeLink: item.youtubeLink,
      playlistName: item.playlistName,
      status: item.status,
      uploadedBy: item.uploadedBy?.fullName,
      createdAt: item.createdAt
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedVideo(null);
    setOpenDialog(false);
  };

  useEffect(() => {
    getDetailVideo();
  }, []);

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {loading ? (
        <div className="flex justify-center items-center w-full col-span-3">
          <Audio height="80" width="80" radius="9" color="green" ariaLabel="loading" />
        </div>
      ) : videoList.length === 0 ? (
        <span className="text-gray-500 col-span-3">Không có video nào.</span>
      ) : (
        videoList.map((item) => (
          <div
            key={item._id}
            onClick={() => handleOpenDialog(item)}
            className="cursor-pointer bg-white rounded-lg shadow p-5 flex flex-col gap-2 border hover:shadow-lg transition"
          >
            <span className="font-bold text-lg mb-1">{item.title}</span>

            {/* ✅ Thêm LikeButton với danh sách like*/}
            <div className="flex justify-start">
              <LikeButton videoId={item._id} />
            </div>

<<<<<<< HEAD
          key={item.id}
          className="cursor-ponter bg-white rounded-lg shadow p-5 flex flex-col gap-2 border hover:shadow-lg transition"
        >
          <span className="font-bold text-lg mb-1">{item.title}</span>
          <div className="flex flex-row justify-end gap-3 mt-2">
            <button
              onClick={() => handleOpenDialog(item)}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded shadow transition"
            >
Chi tiết            </button>
            <button
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded shadow transition"
            >
              Xóa
            </button>
            <button
                onClick={() => handleOpenComment(item._id)} 
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded shadow transition"
              >
                Bình luận
              </button>
=======
            <div className="flex justify-end gap-3 mt-2">
              <button
                onClick={(e) => { e.stopPropagation(); handleOpenDialog(item); }}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded shadow"
              >
                Chi tiết
              </button>
              <button
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded shadow"
              >
                Xóa
              </button>
            </div>

            {item.youtubeLink ? (
              <a
                href={item.youtubeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline break-all mb-1"
                onClick={(e) => e.stopPropagation()}
              >
                ▶ Xem video
              </a>
            ) : (
              <span className="italic text-gray-400 mb-1">Chưa có video</span>
            )}
            <span className="text-sm text-gray-600">Danh sách phát: <span className="font-medium">{item.playlistName}</span></span>
            <span className="text-sm text-gray-600">Ngày đăng: <span className="font-medium">{new Date(item.createdAt).toLocaleDateString()}</span></span>
            <span className="text-sm text-gray-600">Người đăng: <span className="font-medium">{item.uploadedBy?.fullName}</span></span>
>>>>>>> tien
          </div>
        ))
      )}

      {/* Dialog chi tiết video */}
      {openDialog && selectedVideo && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md border border-blue-200 animate-fadeIn">
            <div className="flex items-center mb-6">
              <div className="w-2 h-8 bg-blue-500 rounded-r mr-3"></div>
              <h2 className="text-2xl font-bold text-blue-700">Thông tin video</h2>
            </div>

            <VideoDetail getDetailVideoInformation={selectedVideo} />

            <div className="flex justify-end gap-2 mt-8">
              <button
                className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded shadow font-semibold transition"
                onClick={handleCloseDialog}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoFarmById;
