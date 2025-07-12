
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BaseUrl } from '@/ipconfig';
import { useParams } from 'react-router-dom';
import { Audio } from 'react-loader-spinner';
import LikeButton from './LikeButton';
import CommentVideo from './commentVideo';
import { useNavigate } from "react-router-dom";
export const ListVideo = () => {
    const [videos, setVideos] = useState([])
  const [filterStatus, setFilterStatus] = useState(""); 
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
const videosPerPage = 10;
const [searchText, setSearchText] = useState("");
  const tokenUser = localStorage.getItem('token');
  const navigate = useNavigate()
const indexOfLastVideo = currentPage * videosPerPage;
const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
const filteredVideos = filterStatus
  ? videos.filter(v => v.status === filterStatus)
  : videos;

const searchedVideos = filteredVideos.filter(
  v =>
    v.title?.toLowerCase().includes(searchText.toLowerCase()) ||
    v.playlistName?.toLowerCase().includes(searchText.toLowerCase())
);
  const totalPages = Math.ceil(searchedVideos.length / videosPerPage);

const paginatedVideos = searchedVideos.slice(indexOfFirstVideo, indexOfLastVideo);

  const getAllVideos = async () => {
    try {
        setLoading(true)
    const res = await axios.get(`${BaseUrl}/admin-video-farm`, {
      headers: { Authorization: `Bearer ${tokenUser}` }
    })
      if (res.status === 200) { 
        setVideos(res.data.data)
        setLoading(false)
      }
    } catch (error) {
      console.log("Lỗi nè:", error);
    } finally {
      setLoading(false);
    }
  }
const gotoVideoById =(id)=>{
  navigate(`/dashboard/VideoFarms/VideoById/${id}`)
}

const statusList = Array.from(new Set(videos.map(v => v.status))).filter(Boolean);


  useEffect(() => {
getAllVideos()
  }, []);
  return (
  <div className="p-4">
    <div className="flex justify-end mb-4">
      <input
    type="text"
    className="border rounded px-3 py-1 w-64"
    placeholder="Tìm kiếm video..."
    value={searchText}
    onChange={e => {
      setSearchText(e.target.value);
      setCurrentPage(1); 
    }}
  />
      <select
        className="border rounded px-3 py-1"
        value={filterStatus}
        onChange={e => setFilterStatus(e.target.value)}
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
    ) : videos.length === 0 ? (
      <span className="text-gray-500">Không có video nào.</span>
    ) : (
      
      <div className="overflow-x-auto " >
        
        <table className="w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-blue-50 text-gray-900 ">
              <th className="px-4 py-2 text-left">Tiêu đề</th>
              <th className="px-4 py-2 text-left">Danh sách phát</th>
              <th className="px-4 py-2 text-left">Farm</th>
              <th className="px-4 py-2 text-left">Ngày đăng</th>
              <th className="px-4 py-2 text-left">Người đăng</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Trạng thái</th>  
               <th className="px-4 py-2 text-left"></th>         
       
            </tr>
          </thead>
          <tbody>
          {paginatedVideos.map((item) => (
              <tr key={item._id} className="border-b hover:bg-gray-50 cursor-pointer" onClick={(e) => {
                e.stopPropagation();
                gotoVideoById(item._id);
              }}>
                <td className="px-4 py-2 font-bold">{item.title}</td>
                <td className="px-4 py-2 truncate max-w-[120px]">{item.playlistName}</td>
                <td className="px-4 py-2 truncate max-w-[120px]">{item.farmId?.name}</td>
                <td className="px-4 py-2">{new Date(item.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-2 truncate max-w-[120px]">{item.uploadedBy?.fullName}</td>
                <td className="px-4 py-2 truncate max-w-[120px]">{item.uploadedBy?.email}</td>
                <td className="px-4 py-2">{item.status}</td>
                <td className="px-4 py-2 flex gap-2 justify-center"></td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    )}
    <div className="flex justify-center items-center gap-2 mt-4">
  <button
    className="px-3 py-1 rounded bg-blue-500 text-white disabled:bg-gray-300"
    disabled={currentPage === 1}
    onClick={() => setCurrentPage(currentPage - 1)}
  >
    Trang trước
  </button>
  <span>
    {currentPage} / {totalPages}
  </span>
  <button
    className="px-3 py-1 rounded bg-blue-500 text-white disabled:bg-gray-300"
    disabled={currentPage === totalPages || totalPages === 0}
    onClick={() => setCurrentPage(currentPage + 1)}
  >
    Trang sau
  </button>
</div>
  </div>
);
};

export default ListVideo;


