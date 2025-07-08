import React, { useEffect, useState } from 'react'
import { BaseUrl } from '@/ipconfig'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Audio } from 'react-loader-spinner'

export const VideoFarms = () => {
      const [loading, setLoading] = useState(true)
  
  const navigate=useNavigate()
  const tokenUser = localStorage.getItem('token');
  const [video, setVideo] = useState([]);

  const CallVideoApi = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${BaseUrl}/admin-video-farm`, {
        headers: { Authorization: `Bearer ${tokenUser}` }
      });
      if (res.status === 200) {
        setVideo(res.data)
        setLoading(false)
      }
    } catch (error) {
      console.log("Lỗi nè:", error)
      setLoading(false)
    }
  }
  useEffect(() => {
    CallVideoApi()
  }, [])
 const farmMap = {};
  video.forEach(item => {
    if (item.farmId && item.farmId.id) {
      farmMap[item.farmId.id] = item;
    }
  });
  const farmList = Object.values(farmMap);

const gotoVideoById=(farmId)=>{
  navigate(`/dashboard/VideoFarmById/${farmId}`);
}

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {
      
     loading ? (
        <div className="flex justify-center items-center w-full col-span-3">
          <Audio
            height="80"
            width="80"
            radius="9"
            color="green"
            ariaLabel="loading"
          />
        </div>
      ) :
      
      farmList.length === 0 ? (
        <span>Đang Tải</span>
      ) : (
        farmList.map((item) =>
          (
          <div
          onClick={()=>gotoVideoById(item.farmId.id)}
            key={item.farmId.id}
            className=" cursor-pointer bg-white rounded-lg shadow p-5 flex flex-col gap-2 border hover:shadow-lg transition"
          >
            <span className="font-bold text-lg mb-1">{item.title}</span>
         
            <span   className="text-sm text-orange-600 ">Danh sách phát: <span className="font-medium">{item.playlistName}</span></span>
            <span className="text-sm text-gray-600">Ngày đăng: <span className="font-medium">{new Date(item.createdAt).toLocaleDateString()}</span></span>
            <span className="text-sm text-gray-600">Người đăng: <span className="font-medium">{item.uploadedBy?.fullName}</span></span>
          </div>
        ))
      )}
    </div>
  )
}

export default VideoFarms