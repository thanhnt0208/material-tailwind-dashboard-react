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
    console.log("Dữ liệu video:", videos)
    if (res.status === 200) {
     console.log(res.data)
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

  const handleClickFarm = (farmId) => {
    if (farmId) {
      navigate(`/dashboard/VideoFarmById/${farmId}`)
    }
  }

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {loading ? (
        <div className="flex justify-center items-center w-full col-span-3">
          <Audio
            height="80"
            width="80"
            radius="9"
            color="green"
            ariaLabel="loading"
          />
        </div>
      ) : Array.isArray(videos) && videos.length === 0 ? (
        <span className="col-span-3 text-center">Không có video nào.</span>
      ) : (
        videos.map((item) => (
          
          <div
            key={item._id}
            onClick={() => handleClickFarm(item.farmId?.id)}
            className="cursor-pointer bg-white rounded-lg shadow p-5 flex flex-col gap-2 border hover:shadow-lg transition"
          >
            <span className="font-bold text-lg mb-1">{item.title}</span>
            <span className="text-sm text-orange-600">
              Danh sách phát:{" "}
              <span className="font-medium">{item.playlistName}</span>
            </span>
            <span className="text-sm text-gray-600">
              Ngày đăng:{" "}
              <span className="font-medium">
                {new Date(item.createdAt).toLocaleDateString()}
              </span>
            </span>
            <span className="text-sm text-gray-600">
              Người đăng:{" "}
              <span className="font-medium">{item.uploadedBy?.fullName}</span>
            </span>
          </div>
        ))
      )}
    </div>
  )
}

export default VideoFarms
