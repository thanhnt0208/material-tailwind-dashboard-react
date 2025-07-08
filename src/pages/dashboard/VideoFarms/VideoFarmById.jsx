import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { BaseUrl } from '@/ipconfig'
import { useParams } from 'react-router-dom'
import { Audio } from 'react-loader-spinner'

import CommentVideo from "./commentVideo";



export const VideoFarmById = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editData, setEditData] = useState(null);
  const [editValue, setEditValue] = useState({ options: [] });
  const [loading, setLoading] = useState(true)
  const [idVideo, setIdVideo] = useState([])
  const [videoDetail,setVideoDetail]=useState([])
  const tokenUser = localStorage.getItem('token');
  const { farmId } = useParams();

  const getDetailVideo = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BaseUrl}/admin-video-farm/farm/${farmId}`, {
        headers: { Authorization: `Bearer ${tokenUser}` }
      });
      if (res.status === 200) {
        setVideoList(res.data);
      }
    } catch (error) {
      console.log("Lỗi nè:", error);
    } finally {
      setLoading(false);
    }
  }
const handleOpenDialog =(item)=>{
setEditData(item)
 setIdVideo(item._id)
  setEditValue({
  title:item.title,
  youtubeLink:item.youtubeLink,
  playlistName:item.playlistName,
  status:item.status,
  uploadedBy:item.uploadedBy.fullName,
  createdAt:item.createdAt,

  })

setOpenDialog(true)
}

const handleCloseDialog =(item)=>{
  setEditData(null)
  setEditValue({})
setOpenDialog(false)
}
// const handleSaveEdit = async()=>{
// try {
  
// const res= await axios.post(`${BaseUrl}/admin-video-farm/upload-youtube/${idVideo}`, editValue,{
//         headers: { Authorization: `Bearer ${tokenUser}` }})
// if(res.status===200){
//   alert("Cập nhật thành công")
//     setTimeout(() => {
//         getDetailVideo();
//       }, 500);
//       console.log(res)
//   handleCloseDialog()
// }
// } catch (error) {
//   console.log("Lỗi nè",error)
// }
// }

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
                      onClick={() => handleOpenDialog(item)}

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
          )
          }
          <span className="text-sm text-gray-600 cursor-pointer">
            Danh sách phát: <span className="font-medium">{item.playlistName}</span>
          </span>
          <span className="text-sm text-gray-600">
            Ngày đăng: <span className="font-medium">{new Date(item.createdAt).toLocaleDateString()}</span>
          </span>
          <span className="text-sm text-gray-600">
            Người đăng: <span className="font-medium">{item.uploadedBy?.fullName}</span>
          </span>
        </div>
      ))
    )}

 
 {openDialog && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md border border-blue-200 animate-fadeIn">
      <div className="flex items-center mb-6">
        <div className="w-2 h-8 bg-blue-500 rounded-r mr-3"></div>
        <h2 className="text-2xl font-bold text-blue-700">Thông tin video</h2>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Tiêu đề</label>
          <input
            name="title"
            value={editValue.title || ""}
            className="border border-blue-200 px-3 py-2 rounded w-full bg-gray-50 text-gray-800 font-medium"
            disabled
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">YouTube Link</label>
          <input
            name="youtubeLink"
            value={editValue.youtubeLink || ""}
            className="border border-blue-200 px-3 py-2 rounded w-full bg-gray-50 text-blue-700 font-medium"
            disabled
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Playlist Name</label>
          <input
            name="playlistName"
            value={editValue.playlistName || ""}
            className="border border-blue-200 px-3 py-2 rounded w-full bg-gray-50 text-gray-800 font-medium"
            disabled
          />
        </div>
        <div className="flex flex-col gap-1 mt-2 text-gray-600 text-sm">
          <span><span className="font-semibold">Trạng thái:</span> {editValue.status}</span>
          <span><span className="font-semibold">Người đăng:</span> {editValue.uploadedBy}</span>
          <span><span className="font-semibold">Ngày tạo:</span> {editValue.createdAt && new Date(editValue.createdAt).toLocaleString()}</span>
        </div>
      </div>
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
)
}

export default VideoFarmById;
