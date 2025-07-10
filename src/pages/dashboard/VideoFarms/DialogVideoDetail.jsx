import React from 'react'

export  const DialogVideoDetail = ({openDialogInforVideo,editData,editValue,handleSaveEdit,handleCloseDialogInforVideo}) => {
  return (
<div>
 {openDialogInforVideo && (
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
          <label className="block text-sm font-semibold text-gray-700 mb-1">LocalFilePath</label>
          <input
            name="localFilepath"
            value={editValue.localFilePath || ""}
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
            <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Trạng thái</label>
<input
            name="Trạng thái"
            value={editValue.status|| ""}
            className="border border-blue-200 px-3 py-2 rounded w-full bg-gray-50 text-gray-800 font-medium"
            disabled
          />
          </div>
           <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Người đăng</label>
          <input
            name="Người đăng"
            value={editValue.uploadedBy || ""}
            className="border border-blue-200 px-3 py-2 rounded w-full bg-gray-50 text-gray-800 font-medium"
            disabled
          />
          </div>
     
           <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Ngày đăng</label>
          <input
            name="Ngày đăng"
            value={editValue.createdAt && new Date(editValue.createdAt).toLocaleString() || ""}
            className="border border-blue-200 px-3 py-2 rounded w-full bg-gray-50 text-gray-800 font-medium"
            disabled
          />
</div>
      </div>
   
        {editValue.status==="pending" && editData.localFilePath ?
      ( 
          <div className="flex justify-end gap-2 mt-8">
            <button
          className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded shadow font-semibold transition"
          onClick={handleSaveEdit}
        >
          Duyệt
        </button>
        <button
          className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded shadow font-semibold transition"
          onClick={handleCloseDialogInforVideo}
        >
          Đóng
        </button>
               </div>

      ):(
      <div className="flex justify-end gap-2 mt-8">
          <button
          className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded shadow font-semibold transition"
          onClick={handleCloseDialogInforVideo}
        >
          Đóng
        </button>
     </div>
      )  
      }
   
    </div>
  </div>
)}
</div>

)
}

export default DialogVideoDetail