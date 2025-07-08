
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BaseUrl } from '@/ipconfig';
import { useParams } from 'react-router-dom';
import { Audio } from 'react-loader-spinner';
import VideoDetail from './VideoDetail';
import LikeButton from '@/components/LikeButton';
import CommentVideo from '../commentVideo';
import DialogVideoDetail from './DialogVideoDetail'

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

const deletevideo = async()=>{
      if (!window.confirm('Bạn có chắc muốn xóa video này?')) return;
  try {
    const res= await axios.delete(`${BaseUrl}/admin-video-farm/delete/${idVideo}`,{headers:{Authorization: `Bearer ${tokenUser}`}})
if(res.status===200){
await getDetailVideo()
alert("Xóa thành công")
}
  } catch (error) {
    console.log("Lỗi nè:",error)
  }
}

const handleCloseDialogInforVideo =(item)=>{
  setEditData(null)
  setEditValue({})
setOpenDialogInforVideo(false)
}

const handleSaveEdit = async()=>{
try {
      const updatedValue = { status: "uploaded" }; 
    const res= await axios.post(`${BaseUrl}/admin-video-farm/upload-youtube/${idVideo}`, updatedValue,{
        headers: { Authorization: `Bearer ${tokenUser}` }})
if(res.status===200){
  console.log("data nè:",res.data)
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
    // localFilePath: item.localFilePath,

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
            key={item._id}
            className="cursor-pointer bg-white rounded-lg shadow p-5 flex flex-col gap-2 border hover:shadow-lg transition"
          >

           <span className="font-bold text-lg mb-1">{item.title}</span>
            <div className="flex justify-start" onClick={(e) => e.stopPropagation()}>
              <LikeButton videoId={item._id} />
            </div>
           <div className="flex flex-row justify-end gap-3 mt-2">
   
            <button
            onClick={deletevideo}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded shadow transition"
            >
              Xóa
            </button>
          </div>
          
      {item.status === "pending" && item.localFilePath ? (
  <video
    width="100%"
    height="360"
    src={
      item.localFilePath.startsWith('http')
        ? item.localFilePath
        : `${BaseUrl}${item.localFilePath}`
    }
    controls
    className="w-full rounded shadow"
  >
    Trình duyệt của bạn không hỗ trợ video
  </video>
) : item.youtubeLink && item.status === "uploaded" ? (
  <iframe
    width="100%"
    height="360"
    src={
      "https://www.youtube.com/embed/" +
      (item.youtubeLink.match(/(?:v=|\/embed\/|\.be\/)([^\s&?]+)/)?.[1] || "")
    }
    title="YouTube video"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen
    className="rounded shadow"
  ></iframe>
) : (
  <div className="flex items-center justify-center h-56 text-red-500 font-semibold">
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
              <button
            className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded shadow transition w-full font-semibold"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenDialogInforvideo(item);
            }}
          >
            Xem chi tiết
          </button>
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
     {/* {openDialog && selectedVideo && (
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
      )} */}
      {openComment && (
        <CommentVideo
          open={openComment}
          onClose={handleCloseComment}
          videoId={selectedVideoId}
        />
      )}
    </div>
  );
};

export default VideoFarmById;


