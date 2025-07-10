import { BaseUrl } from '@/ipconfig'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Audio } from 'react-loader-spinner'
import { Navigate, useNavigate } from 'react-router-dom'
export const CommentPost = () => {
  const tokenUser = localStorage.getItem('token')
    const [loading, setLoading] = useState(true)
  const navigate=useNavigate()
const [comment,setComment]=useState([])

const gotoCommentId=(id)=>{
navigate(`/dashboard/CommentPostbyId/${id}`)
}

const gotoCommentByIdPost=(postId)=>{
navigate(`/dashboard/CommentPostbyIdPost/${postId}`)
}

const callApiCommentPost=async()=>{
try {

const res= await axios.get(`${BaseUrl}/admin-comment-post?limit=10`,{
    headers:{Authorization:`Bearer ${tokenUser}`}
})

if(res.status===200){
setComment(res.data.data)
}
} catch (error) {
    console.log("Lỗi nè",error)
    setLoading(false)
}

}
console.log(comment)

useEffect(()=>{
callApiCommentPost()
setLoading(false)
},[])
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
        comment.map((item)=>(
<div onClick={()=>gotoCommentByIdPost( item.postId)} key={item.postId} className="mb-4 p-4 border rounded bg-white  " >
      <div
      //  onClick={()=>gotoCommentId( item._id)} 
      className=" cursor-pointer font-bold mb-2 w-full flex flex-col">Post ID: {item.postId}
          <span > Ngày đăng: {item.createdAt? new Date(item.createdAt).toLocaleDateString(): "Chưa cập nhật"}
        </span>
{item.comments.map((cmt,index)=>(
    <div key={index} className="mb-2 pl-2 border-l" >
        <div className="flex items-center gap-2">
            <img src={
    cmt.userId.avatar?.startsWith('http')
      ? cmt.userId.avatar
      : `${BaseUrl}${cmt.userId.avatar}`
  } alt='' className="w-6 h-6 rounded-full"/>
            <span className="font-medium">{cmt.userId.fullName}</span>
            <span className="text-xs text-gray-500 ml-2">{new Date(cmt.createdAt).toLocaleDateString()}</span>

            </div>
            <div className="ml-8">{cmt.comment}</div>
 {cmt.replies && cmt.replies.length > 0 && (
              <div className="ml-12 mt-1">
                {cmt.replies.map((rep, ridx) => (
                  <div key={ridx} className="flex items-center gap-2 text-sm text-gray-700">
                    <img  alt="" className="w-5 h-5 rounded-full" />
                    <span className="font-medium">{rep.userId.fullName}:</span>
                    <span>{rep.comment}</span>
                    <span>{ new Date(rep.createdAt).toLocaleDateString() }</span>

                  </div>
                ))}
              </div>
            )}
             {/* <div className='bg-orange-600 items-start' >
              <button>Cập nhật</button>
             <button>Xóa</button>
                </div> */}
  </div>
 
))}
        </div>
  
        </div>

        ))
        )}
    </div>
  )
}

export default CommentPost