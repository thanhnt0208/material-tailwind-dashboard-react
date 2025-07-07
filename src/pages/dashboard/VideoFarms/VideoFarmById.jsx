import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { BaseUrl } from '@/ipconfig'
import { useParams } from 'react-router-dom'
import { Audio } from 'react-loader-spinner'

export const VideoFarmById = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editData, setEditData] = useState(null);
  const [editValue, setEditValue] = useState({ options: [] });
  const [loading, setLoading] = useState(true)
  const [videoDetail,setVideoDetail]=useState([])
  const tokenUser = localStorage.getItem('token');
  const {farmId}=useParams()
 const getDetailVideo = async () => {
    try {
          setLoading(true)
      const res = await axios.get(`${BaseUrl}/admin-video-farm/farm/${farmId}`, {
        headers: { Authorization: `Bearer ${tokenUser}` }
      });
      if (res.status === 200) {
        setVideoDetail(res.data)
        setLoading(false)
      }
    } catch (error) {
      console.log("Lỗi nè:", error)
        setLoading(false)

    }
  }
const handleOpenDialog =(item)=>{
setEditData(item)
  setEditValue({
  title:item.title,
  youtubeLink:item.youtubeLink,
  playlistName:item.playlistName
  })

setOpenDialog(true)
}

const handleCloseDialog =(item)=>{
  setEditData(null)
  setEditValue({})
setOpenDialog(false)
}
const handleSave = async()=>{
try {
  
} catch (error) {
  console.log("Lỗi nè",error)
}
}

  useEffect(()=>{
getDetailVideo()
  },[])
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
      ) : videoDetail.length === 0 ? (
        <span className="text-gray-500 col-span-3">Không có video nào.</span>
      ) : (
        videoDetail.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow p-5 flex flex-col gap-2 border hover:shadow-lg transition"
          >
           <span className="font-bold text-lg mb-1">{item.title}</span>

        <div className="flex flex-row justify-end gap-3 mt-2">
  <button
  onClick={()=>handleOpenDialog(item)}
    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded shadow transition"
  >
    Cập nhật
  </button>
  <button
    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded shadow transition"
  >
    Xóa
  </button>
  {/* <button
    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded shadow transition"
  >
    Thêm video
  </button> */}

  {openDialog && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
    <div className="bg-white rounded-lg shadow-lg p-6 min-w-[350px] max-w-[90vw]">
      <div className="font-bold text-lg mb-4">Chỉnh sửa video</div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Tiêu đề</label>
        <input
          name="title"
          value={editValue.title || ""}
          onChange={e => setEditValue({ ...editValue, title: e.target.value })}
          className="border px-3 py-2 rounded w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">YouTube Link</label>
        <input
          name="youtubeLink"
          value={editValue.youtubeLink || ""}
          onChange={e => setEditValue({ ...editValue, youtubeLink: e.target.value })}
          className="border px-3 py-2 rounded w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Playlist Name</label>
        <input
          name="playlistName"
          value={editValue.playlistName || ""}
          onChange={e => setEditValue({ ...editValue, playlistName: e.target.value })}
          className="border px-3 py-2 rounded w-full"
        />
      </div>
      <div className="flex justify-end gap-2 mt-6">
        <button
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          onClick={handleCloseDialog}
        >
          Hủy
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          // onClick={handleSaveEdit} // Thêm hàm này để gọi API cập nhật
        >
          Lưu
        </button>
      </div>
    </div>
  </div>
)}
</div>
            {item.youtubeLink ? (
              <a
                href={item.youtubeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline break-all mb-1"
              >
                ▶ Xem video
              </a>
            ) : (
              <span className="italic text-gray-400 mb-1">Chưa có video</span>
            )}
            <span className="text-sm text-gray-600 cursor-pointer">Danh sách phát: <span className="font-medium">{item.playlistName}</span></span>
            <span className="text-sm text-gray-600">Ngày đăng: <span className="font-medium">{new Date(item.createdAt).toLocaleDateString()}</span></span>
            <span className="text-sm text-gray-600">Người đăng: <span className="font-medium">{item.uploadedBy?.fullName}</span></span>
          </div>
        ))
      )}


    </div>
  )
}

export default VideoFarmById