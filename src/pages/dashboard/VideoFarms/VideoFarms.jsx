import React, { useEffect, useState } from 'react'
import { BaseUrl } from '@/ipconfig'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Audio } from 'react-loader-spinner'

export const VideoFarms = () => {
  const [loading, setLoading] = useState(true)
  const [videos, setVideos] = useState([])
  const navigate = useNavigate()
  const tokenUser = localStorage.getItem('token')

const fetchAllVideos = async () => {
  try {
    setLoading(true)
    const res = await axios.get(`${BaseUrl}/admin-video-farm`, {
      headers: { Authorization: `Bearer ${tokenUser}` }
    })
    if (res.status === 200) {

            setVideos(res.data)

    }
  } catch (error) {
    console.error("Lỗi khi lấy video:", error.response?.data || error.message)
  } finally {
    setLoading(false)
  }
}

  useEffect(() => {
    fetchAllVideos()
  }, [])



  const handleClickPlaylist = (farmId) => {
    console.log(farmId)
    if (farmId) {
      navigate(`/dashboard/VideoFarmById/${farmId}`)
    }
  }
const playlistMap = {};
videos.forEach((video) => {
  const key = video.playlistName || "Khác";
  if (!playlistMap[key]) {
    playlistMap[key] = video; 
  }
});
const playlistItems = Object.entries(playlistMap); 
 return (
  <div className="p-4">
    {loading ? (
      <div className="flex justify-center items-center w-full col-span-3">
        <Audio height="80" width="80" radius="9" color="green" ariaLabel="loading" />
      </div>
    ) : playlistItems.length === 0 ? (
      <span className="col-span-3 text-center">Không có video nào.</span>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {playlistItems.map(([playlist, item]) => {
  return (
    <div
      key={playlist}
      onClick={() => handleClickPlaylist(item.farmId?.id)}
      className="cursor-pointer bg-white rounded-lg shadow p-5 flex flex-col gap-2 border hover:shadow-lg transition"
    >
      <h2 className=" truncate text-xl font-bold mb-2 text-blue-600">Danh sách phát: {playlist}</h2>
      {/* <span className="font-bold text-lg mb-1">{item.title}</span> */}
         <span  className=" truncate font-medium "> Code: {item.farmId?.code}</span>
         <span className="truncate font-medium">Ngày đăng: {new Date(item.createdAt).toLocaleDateString()}</span>
        <span className="truncate  font-medium ">  Người đăng:{item.uploadedBy?.fullName}</span>
         <span  className=" truncate font-medium "> Email: {item.uploadedBy?.email}</span>
    </div>
  );
})}
      </div>
    )}
  </div>
);
}

export default VideoFarms
