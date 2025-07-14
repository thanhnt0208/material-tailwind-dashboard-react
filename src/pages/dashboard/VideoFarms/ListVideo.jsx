
import React, { useEffect, useState,useMemo } from 'react';
import axios from 'axios';
import { BaseUrl } from '@/ipconfig';
import { useParams } from 'react-router-dom';
import { Audio } from 'react-loader-spinner';
import { useNavigate } from "react-router-dom";
import { Typography,Button,Input } from '@material-tailwind/react';

export const ListVideo = () => {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [videos, setVideos] = useState([]);
  const [videosWithLikes, setVideosWithLikes] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const tokenUser = localStorage.getItem('token');
  const limit = 10;
  const navigate = useNavigate();

  const getAllVideos = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BaseUrl}/admin-video-farm?limit=${limit}&page=${page}`, {
        headers: { Authorization: `Bearer ${tokenUser}` }
      });
      if (res.status === 200) {
        const sortedVideo = [...res.data.data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setVideos(sortedVideo);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (error) {
      console.log("Lỗi nè:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllVideos();
  }, [page]);

  useEffect(() => {
    const fetchLikes = async () => {
      const updatedVideos = await Promise.all(
        videos.map(async (video) => {
          try {
            const res = await axios.get(
              `${BaseUrl}/video-like/${video._id}/users`,
              { headers: { Authorization: `Bearer ${tokenUser}` } }
            );
 const commentRes = await axios.get(
            `${BaseUrl}/video-comment/${video._id}/comments`,
            { headers: { Authorization: `Bearer ${tokenUser}` } }
          );
const commentCount = Array.isArray(commentRes.data) ? commentRes.data.length: Array.isArray(commentRes.data.comments) ? commentRes.data.comments.length
  : commentRes.data.total ?? 0;

            return { ...video, likeCount: res.data.total,
                commentCount: commentCount,
             };
          } catch (err) {
            return { ...video, likeCount: 0,commentCount: 0 };
          }
        })
      );
      setVideosWithLikes(updatedVideos);
    };
    if (videos.length > 0) fetchLikes();
    else setVideosWithLikes([]);
  }, [videos]);

  const searchedVideos = useMemo(() => {
    const filteredVideos = filterStatus
      ? videosWithLikes.filter(v => v.status === filterStatus)
      : videosWithLikes;
    return filteredVideos.filter(
      v =>
        v.title?.toLowerCase().includes(searchText.toLowerCase()) ||
        v.playlistName?.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [videosWithLikes, filterStatus, searchText]);

  const statusList = Array.from(new Set(videosWithLikes.map(v => v.status))).filter(Boolean);

  const gotoVideoById = (id) => {
    navigate(`/dashboard/VideoFarms/VideoById/${id}`);
  };

  return (
    <div className="p-4">
      <Typography variant="h5" color="blue-gray" className="font-semibold mb-4">
        Quản lý Video
      </Typography>
      <div className="flex justify-end mb-4">
        <Input
          type="text"
          className="border rounded px-3 py-1 w-64"
          placeholder="Tìm kiếm video..."
          value={searchText}
          onChange={e => {
            setSearchText(e.target.value);
            setPage(1);
          }}
        />
        <select
          className="border rounded px-3 py-1"
          value={filterStatus}
          onChange={e => {
            setFilterStatus(e.target.value);
            setPage(1);
          }}
        >
          <option value="">Tất cả</option>
          {statusList.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>
      {loading ? (
        <div className="flex justify-center items-center w-full h-40">
          <Audio height="80" width="80" radius="9" color="green" ariaLabel="loading" />
        </div>
      ) : searchedVideos.length === 0 ? (
        <span className="text-gray-500">Không có video nào.</span>
      ) : (
        <div className="overflow-x-auto ">
          <table className="min-w-full border">
            <thead>
              <tr className="border-t ">
                <th className="p-2 text-left text-xs font-semibold">Tiêu đề</th>
                <th className="p-2 text-left text-xs font-semibold">Danh sách phát</th>
                <th className="p-2 text-left text-xs font-semibold">Farm</th>
                <th className="p-2 text-left text-xs font-semibold">Ngày đăng</th>
                <th className="p-2 text-left text-xs font-semibold">Người đăng</th>
                <th className="p-2 text-left text-xs font-semibold">Email</th>
                <th className="p-2 text-left text-xs font-semibold">Like</th>
                <th className="p-2 text-left text-xs font-semibold">Bình luận</th>
                <th className="p-2 text-left text-xs font-semibold">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {searchedVideos.map((item) => (
                <tr key={item._id} className="border-b hover:bg-gray-50 cursor-pointer" onClick={(e) => {
                  e.stopPropagation();
                  gotoVideoById(item._id)
                }}>
                  <td className="p-2">{item.title}</td>
                  <td className="p-2">{item.playlistName}</td>
                  <td className="p-2">{item.farmId?.name}</td>
                  <td className="p-2">{new Date(item.createdAt).toLocaleDateString()}</td>
                  <td className="p-2">{item.uploadedBy?.fullName}</td>
                  <td className="p-2">{item.uploadedBy?.email}</td>
                  <td className="p-2">{item.likeCount || 0}</td>
                 <td className="p-2">{item.commentCount || 0}</td>
                  <td className="p-2">{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="flex justify-center items-center gap-2 mt-4">
        <Button size="sm" variant="outlined" disabled={page <= 1} onClick={() => setPage(prev => prev - 1)}>Trang trước</Button>
        <span>Trang {page} / {totalPages}</span>
        <Button size="sm" variant="outlined" disabled={page >= totalPages} onClick={() => setPage(prev => prev + 1)}>Trang sau</Button>
      </div>
    </div>
  );
};

export default ListVideo;

