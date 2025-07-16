import { BaseUrl } from '@/ipconfig'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Audio } from 'react-loader-spinner'
import { Navigate, useNavigate } from 'react-router-dom'
import { Button } from '@material-tailwind/react'
export const CommentPost = () => {
  const tokenUser = localStorage.getItem('token')
  const [loading, setLoading] = useState(true)
  const navigate=useNavigate()
   const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1);
    const limit = 10;
const [comment,setComment]=useState([])
const [post,setPost]=useState([])
const allPostIds = comment.map(item => item.postId);
const gotoCommentId=(id)=>{
navigate(`/dashboard/CommentPostbyId/${id}`)
}
// console.log(post)



const gotoCommentByIdPost=(postId)=>{
navigate(`/dashboard/CommentPostbyIdPost/${postId}`)
}

const callApiCommentPost=async()=>{
try {

const res= await axios.get(`${BaseUrl}/admin-comment-post/?page=${page}&limit=${limit}`,{
    headers:{Authorization:`Bearer ${tokenUser}`}
})

if(res.status===200){
setComment(res.data.data)
setTotalPages(res.data.totalPages)
 setLoading(false) 
}
} catch (error) {
    console.log("Lỗi nè",error)
    setLoading(false)
}

}
// console.log(comment)

useEffect(()=>{
  setLoading(true)
callApiCommentPost()
},[page])

useEffect(() => {
 getPost()
}, [comment]);

const getPost = async (ids) => {
  try {
   const ids = comment.map(item => item.postId).join(',');
const res = await axios.get(`${BaseUrl}/admin-post-feed?ids=${ids}`, {
  headers: { Authorization: `Bearer ${tokenUser}` }
});
    if (res.status === 200) {
      setPost(res.data.data);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
};

  return (
    <div>
{loading?
(<div>
     <Audio
             height="80"
                width="80"
                radius="9"
                color="green"
                ariaLabel="loading"
              />
    </div>
    ):(
comment.map((item) => {
const postInfo = post.find(p => String(p.id) === String(item.postId));
  return (
    <div onClick={() => gotoCommentByIdPost(item.postId)} key={item.postId} className="mb-4 p-4 border rounded bg-white">
      <div className="cursor-pointer font-bold mb-2 w-full flex flex-col">
        Tiêu đề bài viết: {postInfo ? postInfo.title : "Không tìm thấy tiêu đề"}
        <span>
          Ngày đăng: {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "Chưa cập nhật"}
        </span>
        {item.comments.map((cmt, index) => (
          <div key={index} className="mb-2 pl-2 border-l">
            <div className="flex items-center gap-2">
              <img
                src={
                  cmt.userId.avatar?.startsWith('http')
                    ? cmt.userId.avatar
                    : `${BaseUrl}${cmt.userId.avatar}`
                }
                alt=""
                className="w-6 h-6 rounded-full"
              />
              <span className="font-medium">{cmt.userId.fullName}</span>
              <span className="text-xs text-gray-500 ml-2">{new Date(cmt.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="ml-8">{cmt.comment}</div>
            {cmt.replies && cmt.replies.length > 0 && (
              <div className="ml-12 mt-1">
                {cmt.replies.map((rep, ridx) => (
                  <div key={ridx} className="flex items-center gap-2 text-sm text-gray-700">
                    <img alt="" className="w-5 h-5 rounded-full" />
                    <span className="font-medium">{rep.userId.fullName}:</span>
                    <span>{rep.comment}</span>
                    <span>{new Date(rep.createdAt).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
})
        )
        
        }
          <div className="flex justify-center items-center gap-2 mt-4">
            <Button
              size="sm"
              variant="outlined"
              disabled={page <= 1}
              onClick={() => setPage(prev => prev - 1)}
            >
              Trang trước
            </Button>
            <span>Trang {page} / {totalPages}</span>
            <Button
              size="sm"
              variant="outlined"
              disabled={page >= totalPages}
              onClick={() => setPage(prev => prev + 1)}
            >
              Trang sau
            </Button>
          </div>
    </div>
  )
}

export default CommentPost