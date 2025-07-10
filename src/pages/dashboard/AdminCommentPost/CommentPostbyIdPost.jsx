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
  <div>
    {loading ? (
      <div>
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
        <span>Id bài viết: {CommentByIdPost.postId}</span>
        <span> Ngày đăng: {CommentByIdPost.createdAt ? new Date(CommentByIdPost.createdAt).toLocaleDateString() : ""}</span>
        <span> Chỉnh sửa: {CommentByIdPost.updatedAt ? new Date(CommentByIdPost.updatedAt).toLocaleDateString() : ""}</span>
        {CommentByIdPost && Array.isArray(CommentByIdPost.comments) && CommentByIdPost.comments.length > 0 ? (
          CommentByIdPost.comments.map((item) => (
            <div key={item._id} className="border-b py-2">
              <div className="flex items-center gap-2">
             <img src={
       item.userId.avatar?.startsWith('http')
         ? item.userId.avatar
         : `${BaseUrl}${item.userId.avatar}`
     } alt='' className="w-6 h-6 rounded-full"/>
                <span className="font-medium">{item.userId?.fullName}</span>
                <span className="text-xs text-gray-500 ml-2">
                  {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ""}
                </span>
              </div>
              <div className="ml-8">{item.comment}</div>
              {item.replies && item.replies.length > 0 && (
                <div className="ml-12 mt-1">
                  {item.replies.map((rep) => (
                    <div key={rep._id} className="flex items-center gap-2 text-sm text-gray-700">
                      <img
                        src={
                          rep.userId?.avatar?.startsWith('http')
                            ? rep.userId.avatar
                            : `${BaseUrl}${rep.userId?.avatar || ''}`
                        }
                        alt=""
                        className="w-5 h-5 rounded-full"
                      />
                      <span className="font-medium">{rep.userId?.fullName}:</span>
                      <span>{rep.comment}</span>
                      <span>{rep.createdAt ? new Date(rep.createdAt).toLocaleDateString() : ""}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <div>Không có dữ liệu</div>
        )}
      </div>
    )}
  </div>
)

  
}

export default CommentPostbyIdPost

 