
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BaseUrl } from '@/ipconfig';
import { useParams } from 'react-router-dom';
import { Audio } from 'react-loader-spinner';
import LikeButton from './LikeButton';
import CommentVideo from './commentVideo';
import DialogVideoDetail from './DialogVideoDetail'
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
export const VideoFarmById = () => {
    const [openDialogInforVideo, setOpenDialogInforVideo] = useState(false);
  const [idVideo, setIdVideo] = useState([])
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [openComment, setOpenComment] = useState(false);
   const [editData, setEditData] = useState(null);
  const [selectedVideoId, setSelectedVideoId] = useState(null)
    const [editValue, setEditValue] = useState({ options: [] });
  const [loading, setLoading] = useState(true);
    const [videoDetail,setVideoDetail]=useState([])
  const tokenUser = localStorage.getItem('token');
  const { farmId } = useParams();
  const navigate = useNavigate();

const deletevideo = async()=>{
      if (!window.confirm('Bạn có chắc muốn xóa video này?')) return;
  try {
    const res= await axios.delete(`${BaseUrl}/admin-video-farm/delete-s3/${idVideo}`,{headers:{Authorization: `Bearer ${tokenUser}`}})
    console.log(res)
if(res.status===200){
await getDetailVideo()
alert("Xóa thành công")
}
  } catch (error) {
    console.log("Lỗi nè:",error)
  }
}

const handleCloseDialogInforVideo =()=>{
  setEditData(null)
  setEditValue({})
setOpenDialogInforVideo(false)
}
console.log(idVideo)
console.log(videoDetail)
const handleSaveEdit = async()=>{
try {
      const updatedValue = { status: "uploaded" }; 
    const res= await axios.post(`${BaseUrl}/admin-video-farm/upload-s3/${idVideo}`, updatedValue,{
        headers: { Authorization: `Bearer ${tokenUser}` }})
if(res.status===200){
  alert("Cập nhật thành công")
    await  getDetailVideo();     
handleCloseDialogInforVideo()
  }else {
      alert("Có lỗi trong lúc duyệt")
    }
} catch (error) {
  console.log("Lỗi nè",error)
}
}

  const getDetailVideo = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BaseUrl}/admin-video-farm/farm/${farmId}`, {
        headers: { Authorization: `Bearer ${tokenUser}` }
      });
      if (res.status === 200) { 
        console.log("Dữ liệu từ API:", res.data)
        setVideoDetail(res.data)
        setLoading(false)
        
      }
    } catch (error) {
      console.log("Lỗi nè:", error);
    } finally {
      setLoading(false);
    }
  }

const handleOpenDialogInforvideo =(item)=>{
setEditData(item)
 setIdVideo(item._id)
  setEditValue({
    title: item.title,
    youtubeLink: item.youtubeLink,
    playlistName: item.playlistName,
    status: item.status, 
    uploadedBy: item.uploadedBy?.fullName,
    createdAt: item.createdAt,
    localFilePath: item.localFilePath,

  })

setOpenDialogInforVideo(true)
}


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

const handleOpenComment = (e, videoId) => {
  e.stopPropagation(); 
  setSelectedVideoId(videoId);
  setOpenComment(true);
};
  const handleCloseComment = () => {
    setSelectedVideoId(null); 
    setOpenComment(false);
  };

  useEffect(() => {
    getDetailVideo();
  }, []);

  return (
      <div className="p-4">
              <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 px-4 py-2 mb-4 bg-blue-500 hover:bg-blue-600 text-white rounded shadow transition"
      >
        <ArrowLeftIcon className="w-5 h-sm" />
        Quay lại
      </button>
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 
      {loading ? (
        <div className="flex justify-center items-center w-full col-span-3">
          <Audio height="80" width="80" radius="9" color="green" ariaLabel="loading" />
        </div>
      ) : videoDetail.length === 0 ? (
        <span className="text-gray-500 col-span-3">Không có video nào.</span>
      ) : (
        videoDetail.map((item) => (
          <div
            onClick={(e) => {
              handleOpenDialogInforvideo(item);
            }}
            key={item._id}
            className="cursor-pointer bg-white rounded-lg shadow p-5 flex flex-col gap-2 border hover:shadow-lg transition"
          >


           <span className="font-bold text-lg mb-1">{item.title}</span>

            <div className="flex justify-start" onClick={(e) => e.stopPropagation()}>
              <LikeButton videoId={item._id} />
            </div>
           <div className="flex flex-row justify-end gap-3 mt-2">
   
            <button
            onClick={(e)=>{
                e.stopPropagation();
              deletevideo()}}
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
            Danh sách phát: <span className="font-medium">{item.playlistName}</span>
          </span>
          <span className="text-sm text-gray-600">
            Ngày đăng: <span className="font-medium">{new Date(item.createdAt).toLocaleDateString()}</span>
          </span>
          <span className="text-sm text-gray-600">
            Người đăng: <span className="font-medium">{item.uploadedBy?.fullName}</span>
          </span>
            <span className="text-sm text-gray-600">
            Trạng thái: <span className="font-medium">{item.status}</span>
          </span>
          </div>
        ))
      )}

<DialogVideoDetail 
editData={editData} 
handleCloseDialogInforVideo={handleCloseDialogInforVideo}
 handleSaveEdit={handleSaveEdit}
 editValue={editValue}
 openDialogInforVideo={openDialogInforVideo}
 />  
      {openComment && (
        <CommentVideo
          open={openComment}
          onClose={handleCloseComment}
          videoId={selectedVideoId}
        />
      )}
    </div>
    </div>
  );
};

export default VideoFarmById;


