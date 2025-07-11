import React, {useEffect, useState} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Typography, Button, Chip, Avatar } from "@material-tailwind/react";
import CommentPostbyIdPost from "../AdminCommentPost/CommentPostbyIdPost";
import { BaseUrl } from "@/ipconfig";
import axios from "axios";
const BASE_URL = 'https://api-ndolv2.nongdanonline.cc';
export function PostDetail() {

    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true)
      const [CommentByIdPost,setCommentByIdPost]=useState([])
        const tokenUser = localStorage.getItem('token');
console.log("comment nè :",CommentByIdPost)
   const getCommentById=async()=>{
try {
    const res= await axios.get(`${BaseUrl}/admin-comment-post/post/${id}`,
        {headers:{Authorization:`Bearer ${tokenUser}` }})
  if(res.status===200){
setCommentByIdPost(res.data)
  }

} catch (error) {
    console.log("Lỗi nè",error)
    setLoading(false)
}
    }

useEffect(()=>{
getCommentById()
},[])

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${BASE_URL}/admin-post-feed/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                const json = await res.json();
                if(res.ok) {
                    setPost(json);
                }else{
                    alert(json.message || "không thể lấy bài viết");
                }
            } catch (error) {
                console.error("fetch post lỗi: ", error);
                alert("Lỗi khi lấy dữ liệu bài post");
            } finally {
                setLoading(false)
            }
        };
        fetchPost();
    },[id])
    if (loading) return <Typography>Đang tải dữ liệu...</Typography>;
    if (!post) return <Typography>Không tìm thấy bài viết</Typography>;

    return (
        <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow">
            <Button onClick={() => navigate(-1)} variant="outlined" size="sm" className="mb-4">
                ← Quay lại
            </Button>

            <Typography variant="h4" className="mb-2">{post.title}</Typography>
            <Typography variant="paragraph" className="mb-4">{post.description}</Typography>

            <div className="flex gap-2 mb-4">
                {post.tags?.map((tag, i) => (
                <Chip key={i} value={tag} color="blue-gray" size="sm" />
                ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                {post.images.map((img, i) => (
                <img
                    key={i}
                    src={`${BASE_URL}${img}`}
                    alt={`img-${i}`}
                    className="w-full h-40 object-cover rounded"
                />
                ))}
            </div>

            <div className="flex items-center gap-2 mb-4">
                {/* <Avatar src={post.authorId?.avatar} alt={post.authorId?.fullName} size="sm" /> */}
                <span>{post.authorId}</span>
            </div>

            <Typography className="mb-2">Lượt thích: {post.like}</Typography>
            <Chip
                value={post.status ? "Đang hoạt động" : "Đã ẩn"}
                color={post.status ? "green" : "red"}
                size="sm"
            />
            <div className="mt-10">
                <Typography variant="h5" className="mb-2">Bình luận bài viết</Typography>
            </div>
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
        </div>
  );
}

export default PostDetail;