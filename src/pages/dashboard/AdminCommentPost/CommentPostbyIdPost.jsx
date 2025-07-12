import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { BaseUrl } from '@/ipconfig'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { Audio } from 'react-loader-spinner'
export const CommentPostbyIdPost = () => {

  const [CommentByIdPost,setCommentByIdPost]=useState([])
     const [loading, setLoading] = useState(true)
    const tokenUser = localStorage.getItem('token');
    const {postId}=useParams()
   const getCommentById=async()=>{
try {
    const res= await axios.get(`${BaseUrl}/admin-comment-post/post/${postId}`,
        {headers:{Authorization:`Bearer ${tokenUser}` }})
  if(res.status===200){
setCommentByIdPost(res.data)
  }

} catch (error) {
    console.log("Lỗi nè",error)
    setLoading(false)
}
    }
console.log("data nè",CommentByIdPost)

    useEffect(()=>{
getCommentById()
    setLoading(false)

    },[])

  return (
  <div className="max-w-2xl mx-auto p-4">
    {loading ? (
      <div className="flex justify-center items-center h-40">
        <Audio
          height="80"
          width="80"
          radius="9"
          color="green"
          ariaLabel="loading"
        />
      </div>
    ) : (
      <div>
        <div className="border bg-white rounded-lg shadow p-4 mb-6">
          <div className="mb-2 text-gray-700 font-semibold">
            ID bài viết: <span className="font-normal">{CommentByIdPost.postId}</span>
          </div>
          <div className="mb-2 text-gray-700">
            Ngày đăng: <span className="font-medium">{CommentByIdPost.createdAt ? new Date(CommentByIdPost.createdAt).toLocaleDateString() : ""}</span>
          </div>
          <div className="mb-2 text-gray-700">
            Chỉnh sửa: <span className="font-medium">{CommentByIdPost.updatedAt ? new Date(CommentByIdPost.updatedAt).toLocaleDateString() : ""}</span>
          </div>
          {CommentByIdPost.content && (
            <div className="mt-2 text-base text-gray-800 border-t pt-2">
              {CommentByIdPost.content}
            </div>
          )}
        </div>

        {CommentByIdPost && Array.isArray(CommentByIdPost.comments) && CommentByIdPost.comments.length > 0 ? (
          CommentByIdPost.comments.map((item) => (
            <div
              key={item._id}
              className="border rounded-lg bg-gray-50 p-4 mb-4 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-2">
                <img
                  src={
                    item.userId.avatar?.startsWith('http')
                      ? item.userId.avatar
                      : `${BaseUrl}${item.userId.avatar}`
                  }
                  alt=""
                  className="w-8 h-8 rounded-full border"
                />
                <span className="font-semibold text-gray-800">{item.userId?.fullName}</span>
                <span className="text-xs text-gray-500 ml-2">
                  {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ""}
                </span>
              </div>
              <div className="ml-11 text-gray-700 mb-2">{item.comment}</div>
              {item.replies && item.replies.length > 0 && (
                <div className="ml-11 mt-2 border-l-2 border-blue-200 pl-4">
                  {item.replies.map((rep) => (
                    <div
                      key={rep._id}
                      className="flex items-start gap-2 text-sm text-gray-700 mb-2"
                    >
                      <img
                        src={
                          rep.userId?.avatar?.startsWith('http')
                            ? rep.userId.avatar
                            : `${BaseUrl}${rep.userId?.avatar || ''}`
                        }
                        alt=""
                        className="w-6 h-6 rounded-full border"
                      />
                      <div>
                        <span className="font-semibold text-gray-700">{rep.userId?.fullName}:</span>
                        <span className="ml-1">{rep.comment}</span>
                        <span className="ml-2 text-xs text-gray-400">
                          {rep.createdAt ? new Date(rep.createdAt).toLocaleDateString() : ""}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">Không có dữ liệu</div>
        )}
      </div>
    )}
  </div>
)
  
}

export default CommentPostbyIdPost

 