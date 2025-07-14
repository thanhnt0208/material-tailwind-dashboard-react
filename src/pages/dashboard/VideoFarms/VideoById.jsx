import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { BaseUrl } from '@/ipconfig'
import { Audio } from 'react-loader-spinner'
import { ArrowLeftIcon  } from '@heroicons/react/24/solid'
import LikeButton from './LikeButton'
import CommentVideo from './commentVideo';
import { useNavigate } from 'react-router-dom'
 export const VideoById = () => {
    const {id}= useParams()
  const [selectedVideoId, setSelectedVideoId] = useState(null)
    const [openComment, setOpenComment] = useState(false);
    const [videoDetail,setVideoDetail]=useState([])
     const [loading, setLoading] = useState(true)
      console.log(videoDetail)
      const navigate=useNavigate()

     const tokenUser = localStorage.getItem('token');
const getVideoDetail = async()=>{
  try {
    const res= await axios.get(`${BaseUrl}/admin-video-farm/${id}`,{headers:{Authorization: `Bearer ${tokenUser}`}})
if(res.status===200){
setVideoDetail(res.data)
setLoading(false)
}
  } catch (error) {
    console.log("Lỗi nè:",error)
        setLoading(false)

  }
}
    const handleOpenComment = (e, videoId) => {
  e.stopPropagation(); 
  setSelectedVideoId(videoId);
  setOpenComment(true);
};
  const handleCloseComment = () => {
    setSelectedVideoId(null); 
    setOpenComment(false);
  };

  const handleSaveEdit = async()=>{
try {
      const updatedValue = { status: "uploaded" }; 
    const res= await axios.post(`${BaseUrl}/admin-video-farm/upload-s3/${id}`, updatedValue,{
        headers: { Authorization: `Bearer ${tokenUser}` }})
if(res.status===200){
  alert("Cập nhật thành công")
    await  getVideoDetail();     
  }else {
      alert("Có lỗi trong lúc duyệt")
    }
} catch (error) {
  console.log("Lỗi nè",error)
}
}
const deletevideo = async(videoId)=>{
      if (!window.confirm('Bạn có chắc muốn xóa video này?')) return;
  try {
    const res= await axios.delete(`${BaseUrl}/admin-video-farm/delete-s3/${videoId}`,{headers:{Authorization: `Bearer ${tokenUser}`}})
if(res.status===200){
await getVideoDetail()
alert("Xóa thành công")
}
  } catch (error) {
    console.log("Lỗi nè:",error)
  }
}


useEffect(()=>{
getVideoDetail()
},[])
  return (
     
  <div className="p-4">
    <div className="p-4  ">
 
      {loading ? (
        <div className="flex h-full w-full ">
          <Audio height="80" width="80" radius="9" color="green" ariaLabel="loading" />
        </div>
      ) : videoDetail === 0 ? (
        <span className="text-gray-500 col-span-3">Không có video nào.</span>
      ) : (
  (Array.isArray(videoDetail) ? videoDetail : [videoDetail]).map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-lg shadow p-5 flex flex-col gap-3 border hover:shadow-lg transition mb-6 "
          >
           <span className="font-bold text-lg mb-1">{item.title}</span>

            <div className="flex justify-start" onClick={(e) => e.stopPropagation()}>
              <LikeButton videoId={item._id} />
            </div>
           <div className="flex flex-row justify-end gap-3 mt-2">
   
 {item.status === "pending" ? (
        <button
          onClick={async (e) => {
            e.stopPropagation();
            await handleSaveEdit();
          }}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded shadow transition"
        >
          Duyệt
        </button>
      ):(
         <button
        
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded shadow transition"
        >
        Đã Duyệt
        </button>
      )}

            <button
            onClick={(e)=>{
                e.stopPropagation();
              deletevideo(item._id)}}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded shadow transition"
            >
              Xóa
            </button>
          </div>
          
      {item.status === "pending" && item.localFilePath ?
      (
  <video
 src={
    item.localFilePath.startsWith('http')
      ? item.localFilePath
      : `${BaseUrl}${item.localFilePath}`
  }
    controls
    className=" h-[360px]  w-full rounded shadow"
  >
    Trình duyệt của bạn không hỗ trợ video
  </video>
) 
  : item.youtubeLink && item.status === "uploaded" ? (
  item.youtubeLink.endsWith('.mp4') ? (
    <video src={item.youtubeLink} controls   
    className=" h-[360px]  w-full rounded shadow"
 />
  ): (
  <iframe 
    src={
      "https://www.youtube.com/embed/" +
      (item.youtubeLink.match(/(?:v=|\/embed\/|\.be\/)([^\s&?]+)/)?.[1] || "")
    }
    title="YouTube video"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen
    className="h-[360px] rounded shadow w-full"
  ></iframe>
) ): 
(
  <div className="flex items-center justify-center h-56 text-red-500 font-semibold w-full h-[360px] rounded shadow bg-gray-100"  >
    Video không tồn tại
  </div>

)} 
            <div className="flex justify-end gap-3 mt-2">
 
              <button
                onClick={(e) =>{ handleOpenComment(e, item._id)}} 
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded shadow"
              >
                Bình luận
              </button>
            </div>

   
   <span className="text-sm text-gray-600 cursor-pointer">
            Danh sách phát: <span className=" truncate font-medium">{item.playlistName}</span>
          </span>
             <span className=" truncate text-sm text-gray-600">
            Farm: <span className=" truncate font-medium">{item.farmId.name}</span>
          </span>
          <span className="truncate text-sm text-gray-600">
            Ngày đăng: <span className="truncate font-medium">{new Date(item.createdAt).toLocaleDateString()}</span>
          </span>
          <span className="truncate text-sm text-gray-600">
            Người đăng: <span className="truncate font-medium">{item.uploadedBy?.fullName}</span>
          </span>
           <span className=" truncate text-sm text-gray-600">
            Link Local File Path: <span className=" truncate font-medium">{item.localFilePath}</span>
          </span>
           <span className=" truncate text-sm text-gray-600">
            Link Youtube: <span className=" truncate font-medium">{item.youtubeLink||""}</span>
          </span>
             <span className="truncate text-sm text-gray-600">
            Email: <span className=" truncate font-medium">{item.uploadedBy.email}</span>
          </span>
            <span className=" truncate text-sm text-gray-600">
            Trạng thái: <span className=" truncate font-medium">{item.status}</span>
          </span>
          
          </div>
        ))
      )}

{/* <DialogVideoDetail 
editData={editData} 
handleCloseDialogInforVideo={handleCloseDialogInforVideo}
 handleSaveEdit={handleSaveEdit}
 editValue={editValue}
 openDialogInforVideo={openDialogInforVideo}
 />   */}
      {openComment && (
        <CommentVideo
          open={openComment}
          onClose={handleCloseComment}
          videoId={selectedVideoId}
        />
      )}
    </div>
    </div>

  )
}

export default VideoById